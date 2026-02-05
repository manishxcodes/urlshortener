import bcrypt from 'bcrypt';
import { AppError } from 'utils/AppError.js';
import { UserRepository } from 'repositories/user.repository.js';
import type { SignupInputType } from 'schema.js';
import { signToken, verifyToken } from 'utils/jwt.js';
import { OtpRepository } from 'repositories/otp.repository.js';

export class UserService {
    private repository = new UserRepository();
    private otpRepository = new OtpRepository();

    async signup (data: SignupInputType, verificationToken: string) {
        let payload;
        try {
            payload = verifyToken(verificationToken) as {email: string};
        } catch(err) {
            throw new AppError("Invalid verification token",401);
        }

        if(payload.email !== data.email) throw new AppError("Unathorized", 401);

        const otpRecord = await this.otpRepository.findLatestByEmail(payload.email);
        if(!otpRecord?.verifiedAt) throw new AppError("OTP not verified", 400);

        const existingUser = await this.repository.findByEmail(data.email);
        if(existingUser) throw new AppError("Email is already in use", 400);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = await this.repository.createUser({
            firstname: data.firstname,
            lastname: data.lastname,
            password: hashedPassword,
            email: data.email
        });
        if(!newUser) throw new AppError("Couldn't signup", 500);

        const token = signToken({id: newUser.id});

        const user = {
            email: newUser.email,
            id: newUser.id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
        }

        return { user, token };
    }

    async signin ({email, password}: {email: string, password: string}) {
        const user = await this.repository.findByEmail(email);
        if(!user) throw new AppError("User not found", 404);

        const match = await bcrypt.compare(password, user.password);
        if(!match) throw new AppError("Invalid email or password", 400);

        const token = signToken({ id: user.id });

        return { user, token };
    }
}