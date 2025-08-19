import * as z from "zod";
import { loginSchema, registrationSchema, writeupFormSchema } from "./schema";

export type IconProps = React.HTMLAttributes<SVGElement>;

export type NavItem = {
  name: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Status = {
  status: "default" | "success" | "error";
  message: string;
  data?: object;
};

export type RewardCatalog = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  imageUrl: string;
  rarity: string;
};

export type Reward = {
  id: string;
  userId: string;
  rewardCatalogId: string;
  name: string;
  obtainedAt: Date;
  status: string;
  rewardCatalog: RewardCatalog;
};

export type LogInFormInputs = z.infer<typeof loginSchema>;
export type RegistrationFormInputs = z.infer<typeof registrationSchema>;
export type WriteUpFormInputs = z.infer<typeof writeupFormSchema>;

export type MetaDataResponse = {
  policyId: string;
  assetName: string;
  metadata: {
    "721": {
      [policyId: string]: {
        [assetName: string]: {
          name: string;
          image: string;
          rarity: string;
          type: string;
          description: string;
        };
      };
    };
  };
  compiledScript: string;
};

export type CategoryResponse = {
  name: string;
  category_id: string;
  description: string;
};

export type Challenge = {
  challenge_id: string;
  title: string;
  description: string;
  category_id: string;
  thumbnail: string | null;
  difficulty: string;
  points: number;
  flag: string;
  resources: string;
  created_at: string;
  created_by: string;
  solves: number;
  category: CategoryResponse;
  user: {
    username: string;
    user_id: string;
  };
};

export type Rank = {
  user_id: string;
  experience: number;
  username: string;
  solves: number;
};

export type User = {
  user_id: string;
  username: string;
  email: string;
  bio?: string;
  role: string;
  join_date: string;
  country?: string;
  experience: number;
  solves: number;
};

export type UserStats = {
  totalChallengesSolved: number;
  totalChallengesCreated: number;
  totalWriteups: number;
  averageSolveTime: string;
  favoriteCategory: string;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  totalUsers: number;
};

export type Submission = {
  submission_id: string;
  user_id: string;
  challenge_id: string;
  submission_time: string;
  user: {
    username: string;
    user_id: string;
  };
  challenge: Challenge;
};

export type Writeup = {
  writeup_id: string;
  user_id: string;
  challenge_id: string;
  title: string;
  content: string;
  created_at: Date;
  visibility: string;
  user?: {
    username: string;
    user_id: string;
  };
};
