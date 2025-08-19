"use server";
import { axiosPublic } from "./axios";
import { isAxiosError } from "axios";
import { Status } from "./types";
import { FieldValues } from "react-hook-form";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

//auth actions
export const loginAction = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("/auth/sign-in", data);
    console.log(response.data);
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;
    const accessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const refreshTokenExpiresIn = response.data.refreshTokenExpiresIn;
    return {
      data: {
        user: { ...response.data.user },
        tokenInfo: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        },
      },
      message: response.data.message,
      status: "success",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: "error",
      } as Status;
    }
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axiosPublic.get("/auth/refresh", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    console.log(response);
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    const newAccessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const newRefreshTokenExpiresIn = response.data.refreshTokenExpiresIn;

    return {
      data: {
        accessToken: newAccessToken,
        accessTokenExpiresIn: newAccessTokenExpiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn: newRefreshTokenExpiresIn,
      },
      message: response.data.message,
      status: "success",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: "error",
      } as Status;
    }
  }
};

export const signUpAction = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("auth/sign-up", data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getAllUsersByRank = async () => {
  try {
    const response = await axiosPublic.get("/user/get-users-by-rank");
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//rewards actions
export const getAllAvailableRewardCatalogs = async () => {
  try {
    const response = await axiosPublic.get("/rewards/get-info-all");
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getAllAvailableRewardByUserId = async (userId: string) => {
  try {
    const response = await axiosPublic.get(
      `/rewards/get-available-rewards-for-user?userId=${userId}`
    );
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//notification actions
export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/notifications/get-all?userId=${session.user.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return { notifications: response.data };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [] };
  }
}
export async function markNotificationAsRead(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.post(
      `/notifications/mark-read?id=${id}&userId=${session.user.user_id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return { notification: response.data };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    await axiosPublic.post(
      `/notifications/mark-all-read?userId=${session.user.user_id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all notifications as read");
  }
}

//mint rewards
export const getNFTMetaData = async (rewardId: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(
      `/mint/get-config?rewardId=${rewardId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const updateRewardAsMinted = async (rewardId: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.put(
      `/mint/update-reward-status`,
      { rewardId },
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//challenge actions
export async function getAllChallenges() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(`/challenge/get-info-all`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });

    console.log("API Response:", response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}
export async function getChallengeById(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/challenge/get-info-single?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

export const createChallenge = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("challenge/create", data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const updateChallenge = async (data: FieldValues, id: string) => {
  try {
    const response = await axiosPublic.put(`challenge/update?id=${id}`, data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getAllCategories = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `challenge/get-challenge-categories`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getAllChallengesCreatedByUser = async (userId: string) => {
  try {
    const response = await axiosPublic.get(
      `/challenge/get-challenges-created-by-user?id=${userId}`
    );
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const deleteChallenge = async (challengeId: string) => {
  try {
    const response = await axiosPublic.delete(
      `/challenge/delete?id=${challengeId}`
    );
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const submitChallengeFlag = async (data: object) => {
  try {
    const response = await axiosPublic.post("challenge/solve-challenge", data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

// User profile actions
export const getUserProfile = async (userId: string) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await axiosPublic.get(
      `/user/get-info-single?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo?.accessToken}`,
        },
      }
    );
    return {
      status: "success",
      data: response.data,
      message: "User profile fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message || "Failed to fetch user profile",
      } as Status;
    }
  }
};

export const getUserChallenges = async (userId: string) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await axiosPublic.get(`/users/${userId}/challenges`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo?.accessToken}`,
      },
    });
    return {
      status: "success",
      data: response.data,
      message: "User challenges fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message:
          error.response?.data.message || "Failed to fetch user challenges",
      } as Status;
    }
  }
};

export async function getUserSolvedChallenges(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    const response = await axiosPublic.get(
      `/submission/user-solved-challenges?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo?.accessToken}`,
        },
      }
    );
    return {
      status: "success",
      data: response.data,
      message: "User solved challenges fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message:
          error.response?.data.message ||
          "Failed to fetch user solved challenges",
      } as Status;
    }
  }
}

export const getUserSubmissions = async (userId: string) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await axiosPublic.get(`/users/${userId}/submissions`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo?.accessToken}`,
      },
    });
    return {
      status: "success",
      data: response.data,
      message: "User submissions fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message:
          error.response?.data.message || "Failed to fetch user submissions",
      } as Status;
    }
  }
};

// Get user profile by ID
export const getUserProfileById = async (userId: string) => {
  try {
    const response = await axiosPublic.get(
      `/user/get-info-single?id=${userId}`
    );
    return {
      status: "success",
      data: response.data,
      message: "User profile fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message || "Failed to fetch user profile",
      } as Status;
    }
  }
};

// Get user statistics by ID
export const getUserStatsById = async (userId: string) => {
  try {
    const response = await axiosPublic.get(`/user/${userId}`);
    return {
      status: "success",
      data: response.data,
      message: "User statistics fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching user statistics:", error);
      return {
        status: "error",
        message:
          error.response?.data.message || "Failed to fetch user statistics",
      } as Status;
    }
  }
};

//writeup actions
export const createWriteup = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("/writeup/create", data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message:
        (response.data.message as string) || "Writeup created successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("Error response data:", error.response?.data);
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getWriteupById = async (writeupId: string) => {
  try {
    const response = await axiosPublic.get(
      `/writeup/get-info-single?id=${writeupId}`
    );
    return {
      status: "success",
      data: response.data,
      message: "Writeup fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message || "Failed to fetch writeup",
      } as Status;
    }
  }
};

export const getWriteupByChallengeId = async (challengeId: string) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await axiosPublic.get(
      `/writeup/get-by-challenge?challengeId=${challengeId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo?.accessToken}`,
        },
      }
    );
    return {
      status: "success",
      data: response.data,
      message: "Writeup fetched successfully",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("Error response data:", error.response?.data);
      return {
        status: "error",
        message: error.response?.data.message || "Failed to fetch writeup",
      } as Status;
    }
  }
};
