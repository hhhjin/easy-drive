import z from "zod";

export const createUsernameSchema = z.object({
  username: z
    .string()
    .min(4, "Your username must contain at least 4 characters")
    .max(12, "Your username cannot contain more than 12 characters")
    .regex(
      /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,}$/,
      "This username is not available"
    ),
});

export const updateReadOnlyPasswordSchema = z.object({
  readOnlyPassword: z
    .string()
    .min(8, "Read-only-password must contain at least 8 characters")
    .max(20, "Read-only-password cannot contain more than 20 characters"),
});
