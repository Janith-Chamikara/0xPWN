/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      email: string;
      username: string;
      experience: number;
      bio: string;
      wallet: string;
      solves: number;
      createdAt: string;
      updatedAt: string;
    };
    tokenInfo: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: number;
      refreshTokenExpiresIn: number;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      user_id: string;
      email: string;
      experience: number;
      bio: string;
      username: string;
      wallet: string;
      solves: number;
      createdAt: string;
      updatedAt: string;
    };
    tokenInfo: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: number;
      refreshTokenExpiresIn: number;
    };
  }
}
