import { requestOtp, verifyOtp } from "controllers/otp.controller";
import { Router } from "express";
import { validate } from "middleware/validate.middleware";
import { otpRequestSchema, verifyOtpSchema } from "schema";


const router = Router();

router.post('/send', validate(otpRequestSchema), requestOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtp);

export default router;