import type { NextFunction, Request, Response } from "express";
import { UserRepository } from "repositories/user.repository.ts";
import { AppError } from "utils/AppError";
import { asyncHandler } from "utils/AsyncHandler";
import jwt from 'jsonwebtoken';
import type { SignupInputType } from "schema";

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userRepository = new UserRepository();

export const authMiddleware = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const authToken = req.header("Authorization");
        if(!authToken || authToken.startsWith("Bearer ")) throw new AppError("Authorization missing", 401);

        const jwt_secret = process.env.JWT_SECRET;
        if(!jwt_secret) throw new AppError("Server config error. jwt secret missing", 500);

        const token = authToken.split(" ")[1] || req.cookies?.token;
        if(!token) throw new AppError("Invalid token", 401);

        const decoded = jwt.verify(token, jwt_secret) as { id: string};
        if(!decoded || !decoded.id) throw new AppError("Invalid token", 401);

        const user = await userRepository.findById(decoded.id);
        if(!user) throw new AppError("User no longer exists", 401);

        req.userId = user.id;
        next();
    }
)