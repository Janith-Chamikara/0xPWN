"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User as UserIcon, Calendar, Trophy, Globe, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Status, User } from "@/lib/types";
import { getUserProfileById } from "@/lib/actions";
import Loader from "@/components/loader";
import Heading from "@/components/heading";
import NoItemsFound from "@/components/no-items-found";

function getExperienceLevel(experience: number) {
  if (experience < 500) return { level: "Beginner", color: "text-green-400" };
  if (experience < 1500)
    return { level: "Intermediate", color: "text-blue-400" };
  if (experience < 3000) return { level: "Advanced", color: "text-purple-400" };
  return { level: "Expert", color: "text-yellow-400" };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatJoinDuration(joinDate: string) {
  const now = new Date();
  const joined = new Date(joinDate);
  const diffTime = Math.abs(now.getTime() - joined.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: profileData, isLoading: profileLoading } = useQuery<
    Status | undefined
  >({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfileById(userId),
    enabled: !!userId,
  });

  const user = (profileData?.data as User) ?? null;
  const isLoading = profileLoading;

  if (!user) {
    return (
      <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
        <div className="text-center mt-[60px]">
          <Heading>User Not Found</Heading>
          <p className="text-lg">
            The requested user profile could not be found.
          </p>
          <NoItemsFound />
        </div>
      </main>
    );
  }

  const experienceLevel = user
    ? getExperienceLevel(user.experience)
    : { level: "", color: "" };
  const progressToNextLevel = user ? ((user.experience % 500) / 500) * 100 : 0;

  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <Loader isLoading={isLoading}>
        {user && (
          <>
            {/* Header Section */}
            <div className="text-center mt-[60px]">
              <Heading>User Profile</Heading>
              <p className="text-lg max-w-2xl mx-auto">
                Explore the cybersecurity journey and achievements of this
                community member.
              </p>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Card */}
              <div className="lg:col-span-2">
                <Card className="bg-transparent border-primary_color">
                  <CardHeader className="text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-24 h-24 border-2 border-primary_color">
                        <AvatarImage src="" alt={user.username} />
                        <AvatarFallback className="text-2xl bg-primary_color/10 text-primary_color">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl text-primary_color">
                          {user.username}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Badge
                            variant="default"
                            className={experienceLevel.color}
                          >
                            {experienceLevel.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bio */}
                    {user.bio && (
                      <div>
                        <h3 className="font-semibold text-primary_color mb-2 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          About
                        </h3>
                        <p className=" leading-relaxed">{user.bio}</p>
                      </div>
                    )}

                    <div className="border-t border-primary_color/20 my-4"></div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary_color" />
                        <div>
                          <p className="text-sm ">Joined</p>
                          <p className="font-medium">
                            {formatDate(user.join_date)}
                          </p>
                          <p className="text-xs ">
                            {formatJoinDuration(user.join_date)}
                          </p>
                        </div>
                      </div>
                      {user.country && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary_color" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Country
                            </p>
                            <p className="font-medium">{user.country}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-primary_color/20 my-4"></div>

                    {/* Experience Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-primary_color flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Experience Progress
                        </h3>
                        <span className="text-sm ">
                          {user.experience.toFixed(1)} XP
                        </span>
                      </div>
                      <Progress
                        value={progressToNextLevel}
                        className="h-2  text-primary_color"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="bg-transparent border-primary_color">
                  <CardHeader>
                    <CardTitle className="text-primary_color flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Challenges Solved</span>
                      <span className="font-bold text-primary_color">
                        {user.solves}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Experience</span>
                      <span className="font-bold text-primary_color">
                        {user.experience.toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </Loader>
    </main>
  );
}
