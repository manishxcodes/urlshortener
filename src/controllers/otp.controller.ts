import type {Request, Response } from "express";
import { OtpService } from "services/otp.service";
import { AppResponse } from "utils/AppResponse";
import { asyncHandler } from "utils/AsyncHandler";

const otpService = new OtpService();

export const requestOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const email = req.body.email;
        await otpService.requestOtp(email);

        return  AppResponse.success(res, "OTP sent");
    }
);

export const verifyOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const email = req.body.email;
        const otp = req.body.otp;
        const { verificationToken } = await otpService.verifyOtp(email, otp);

        return AppResponse.success(res, "OTP verified", { verificationToken });
    }
)