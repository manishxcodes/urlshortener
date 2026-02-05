import { requestOtp, verifyOtp } from "controllers/otp.controller.js";
import { Router } from "express";
import { validate } from "middleware/validate.middleware.js";
import { otpRequestSchema, verifyOtpSchema } from "schema.js";


const router = Router();

router.post('/send', validate(otpRequestSchema), requestOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtp);

export default router;