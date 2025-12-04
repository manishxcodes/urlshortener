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

export type SignupInputType = z.infer<typeof signupSchema>

export const signinSchema = z.object({  
    email: z
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
}).strict();

export type SigninInputType = z.infer<typeof signinSchema>
