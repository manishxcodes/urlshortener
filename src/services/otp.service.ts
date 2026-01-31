import { OtpRepository } from "repositories/otp.repository";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AppError } from "utils/AppError";
import { signToken } from "utils/jwt";
import nodemailer from 'nodemailer'
import { UserRepository } from "repositories/user.repository";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD
    }
})

export class OtpService {
    private repo = new OtpRepository();
    private userRepo = new UserRepository();

    async requestOtp (email: string) {
        const existingUser = await this.userRepo.findByEmail(email);
        if(existingUser) throw new AppError("Email aleady in use", 409);

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpHash = await bcrypt.hash(otp, 10);

        const record = await this.repo.create({
            email,
            otpHash, 
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        })

        // send otp
         const mailOptions = {
            from: `"SnipLink:" ${process.env.USER_EMAIL}`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>OTP Verification</h2>
                    <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
                    <p>This code will expire in 3 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("mail info: ", nodemailer.getTestMessageUrl(info));

        return { message: "OTP sent" };
    }

    async verifyOtp (email: string, otp: string) {
        const record = await this.repo.findLatestByEmail(email);
        if(!record) throw new AppError("No OTP found", 400);

        if(record.expiresAt < new Date()) {
            throw new AppError("OTP expired", 400);
        }

        if(record.attempts && record.attempts >= 3) {
            throw new AppError("Too many attempts", 400);
        }

        const isMatch = await bcrypt.compare(otp, record.otpHash);
        if(!isMatch ) {
            await this.repo.incrementAttempts(record.id, record.attempts + 1);
        }

        await this.repo.markVerified(record.id);

        const verificationToken = signToken({email: record.email});
        return { verificationToken };
    }
}