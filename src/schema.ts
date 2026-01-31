import { z } from "zod";

export const signupSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .max(55, "First name must be at most 55 characters"),

  lastname: z
    .string()
    .max(55, "Last name must be at most 55 characters")
    .optional(), // since it's not `.notNull()` in your model

  email: z
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
});

export type SignupInputType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({  
    email: z
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
}).strict();

export type SigninInputType = z.infer<typeof signinSchema>;

// schema for url

export const createUrlSchema = z.object({
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(10, "Short code must be at most 10 characters"),

  targetURL: z
    .url("Target URL must be a valid URL"),

  userId: z
    .uuid("Invalid user ID"),
  title: z
    .string().nonempty("Title can't be empty")
});


export const createUrlRequestSchema = z.object({
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(10, "Short code must be at most 10 characters")
    .optional(),

  targetURL: z
    .url("Target URL must be a valid URL"),
   
  title: z.string().nonempty("Title can't be empty")
});

export type CreateUrlBodyType = z.infer<typeof createUrlSchema>;

export const otpRequestSchema = z.object({
  email: z.email("Invalid email").max(255)
});

export const verifyOtpSchema = z.object({
  email: z.email("Invalid email").max(255),
  otp: z.string()
})

export const otpInsertSchema = z.object({
  email: z.email().max(255),
  otpHash: z.string().max(255),
  expiresAt: z.date(),
  verifiedAt: z.date().optional()
});

export type OtpInsertType = z.infer<typeof otpInsertSchema>;


export const otpEntitySchema = z.object({
  id: z
    .uuid("ID must be a valid UUID"),

  email: z
    .email("Email must be a valid email address")
    .max(255, "Email must be at most 255 characters"),

  otpHash: z
    .string()
    .max(255, "OTP hash must be at most 255 characters"),

  expiresAt: z
    .date("Expiry time is required" ),

  attempts: z
    .number()
    .int("Attempts must be an integer")
    .default(0),

  verifiedAt: z
    .date()
    .nullable()
    .optional(),

  createdAt: z
    .date()
    .default(new Date()),
});

export type OtpEntityType = z.infer<typeof otpEntitySchema>;


