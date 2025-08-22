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

// Helper to safely check File in environments where it might not exist (SSR/Node)
const isFileAvailable = typeof File !== "undefined";
const isBrowserFile = (val: unknown): val is File =>
  isFileAvailable && val instanceof File;

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
    // Use environment-safe validation for File to avoid SSR build errors
    thumbnail: z
      .any()
      .refine((file) => {
        // If no file provided, it's fine (handled by object-level refine when uploadThumbnail is true)
        if (!file) return true;
        // Skip strict checks on the server where File is not available
        if (!isBrowserFile(file)) return true;
        return file.size <= 5 * 1024 * 1024; // <= 5MB
      }, "File size must be less than 5MB")
      .refine((file) => {
        if (!file) return true;
        if (!isBrowserFile(file)) return true;
        return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      }, "Only JPEG, PNG, and WebP images are allowed")
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
