import z from "zod";

const UserRegistrationZodSchema = z.object({
  name: z
    .string("Not A String!!!!!")
    .min(3, "Name must atleast 3 characters long!!!")
    .max(10),
  email: z.email("Not email!!"),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

    .regex(/[0-9]/, "Password must contain atleast 1 Number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]),
});

const UserEmailVerifyZodSchema = z.object({
  email: z.email("Not email!"),
  otp: z.string().length(6),
});

const UserLoginZodSchema = z.object({
  email: z.email("Not email!"),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

    .regex(/[0-9]/, "Password must contain atleast 1 Number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
});

const UserForgotPasswordZodSchema = z.object({
  email: z.email("Invalid email address"),
});

const UserResetPasswordZodSchema = z.object({
  email: z.email("Invalid email address"),

  otp: z.string().length(6, "OTP must be exactly 6 digits"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});

export const UserValidation = {
  UserRegistrationZodSchema,
  UserEmailVerifyZodSchema,
  UserLoginZodSchema,
  UserForgotPasswordZodSchema,
  UserResetPasswordZodSchema,
};
