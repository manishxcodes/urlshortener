import type { Request, Response, NextFunction } from "express";
import { UserService } from "services/user.service.js";
import { AppError } from "utils/AppError.js";
import { AppResponse } from "utils/AppResponse.js";
import { asyncHandler } from "utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';

const userService = new UserService();

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
};


export const signup = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const verificationToken = req.headers["x-verification-token"] as string;
        if(!verificationToken) return next(new AppError("OTP verfication required", 401))
        const data = await userService.signup(req.body, verificationToken);

        return res.status(200)
            .cookie("token", data.token, options)
            .json(AppResponse.successObject( "Signup successfull", {token: data.token}));
    }
)

export const signin = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const result = await userService.signin(req.body);

        return res.status(200)
            .cookie("token", result.token, options)
            .json(AppResponse.successObject( "Login successfull", {token: result.token}));
    }
)

export const getAuthStatus = asyncHandler(
  async function (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      return res.status(200).json({
        authenticated: true,
        userId: decoded.id,
      });
    } catch {
      return res.status(200).json({ authenticated: false });
    }
  }
);


export const signout = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const userId = req?.userId;
        if(!userId) return next(new AppError("Unauthorized", 401));

        return res.status(200)
            .clearCookie("token", options)
            .json(AppResponse.successObject( "Logout successfull"));
    }
)



