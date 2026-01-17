import type { Request, Response, NextFunction } from "express";
import { UserService } from "services/user.service";
import { AppError } from "utils/AppError";
import { AppResponse } from "utils/AppResponse";
import { asyncHandler } from "utils/AsyncHandler";

const userService = new UserService();

const options = {
    httpOnly: true,
    secure: true
}

export const signup = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const data = await userService.signup(req.body);

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
            .json(AppResponse.successObject( "Login successObjectfull", {token: result.token}));
    }
)

export const signout = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const userId = req?.userId;
        if(!userId) return next(new AppError("Unauthorized", 401));

        return res.status(200)
            .clearCookie("token", options)
            .json(AppResponse.successObject( "Logout successfull"));
    }
)



