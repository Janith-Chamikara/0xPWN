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

export const createChallengeSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    category_id: z.string().uuid("Invalid category ID format"),
    resources: z.string().min(1, "You need to provide links"),
    difficulty: DifficultyEnum,
    uploadThumbnail: z.boolean().default(false),
    thumbnail: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "File size must be less than 5MB"
      )
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only JPEG, PNG, and WebP images are allowed"
      )
      .optional(),
    points: z.string().min(1, "Points required"),
    flag: z.string().min(5, "Flag must be at least 5 characters long"),
  })
  .refine(
    (data) => {
      // If uploadThumbnail is true, thumbnail must be provided
      if (data.uploadThumbnail && !data.thumbnail) {
        return false;
      }
      return true;
    },
    {
      message: "Thumbnail is required when upload option is selected",
      path: ["thumbnail"],
    }
  );

export const writeupFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});
