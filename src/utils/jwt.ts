import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

const jwt_secret = process.env.JWT_SECRET!;

export const signToken = (payload: object) => {
    const token = jwt.sign(payload, jwt_secret);
    if(!token) throw new AppError("Cannot generate jwt token", 500);

    return token;
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, jwt_secret);
}