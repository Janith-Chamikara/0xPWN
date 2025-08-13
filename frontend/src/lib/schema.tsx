import * as z from "zod";

export const registrationSchema = z
  .object({
    username: z.string().min(1, { message: "Provide your user name." }),
    email: z.string().min(1, { message: "Provide a valid email." }),
    bio: z.string().optional(),
    wallet: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Provide a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password is too long" }),
});

const DifficultyEnum = z.enum(["Easy", "Medium", "Hard"]);

export const createChallengeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  category_id: z.string().uuid("Invalid category ID format"),
  resources: z.string().min(1, "You need to provide links"),
  difficulty: DifficultyEnum,
  points: z.string().min(1, "Points required"),
  flag: z.string().min(5, "Flag must be at least 5 characters long"),
});
