"use client";

import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Users, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { CategoryResponse, Challenge, Status } from "@/lib/types";
import { getAllCategories, getAllChallenges } from "@/lib/actions";
import Loader from "@/components/loader";
import NoItemsFound from "@/components/no-items-found";
import { CldImage } from "next-cloudinary";

const getLevelColor = (level: string) => {
  switch (level) {
    case "Easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function ChallengesDashboard() {
  const { data, isLoading } = useQuery<Status | undefined>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
  const { data: challengesData, isLoading: challengesIsLoading } = useQuery<
    Status | undefined
  >({
    queryKey: ["challenges"],
    queryFn: () => getAllChallenges(),
  });
  const availableCategories = (data?.data as CategoryResponse[]) ?? [];
  const challenges = (challengesData?.data as Challenge[]) ?? [];
  console.log(challenges, "CHALLENGES DATA");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  return (
    <main className="container mx-auto flex flex-col gap-12 px-4 py-8">
      <div className="text-center mt-[60px]">
        <Heading>Challenges</Heading>
        <p className="text-lg max-w-2xl mx-auto">
          Test your cybersecurity skills across various categories. Solve
          challenges to earn points and climb the leaderboard.
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-col  gap-4 items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search challenges..."
              className="pl-10 bg-transparent focus:border-green-400"
            />
          </div>

          <div className="flex flex-wrap  gap-2">
            {availableCategories.map((category) => (
              <Button
                onClick={() => setSelectedCategory(category.category_id)}
                key={category.category_id}
                variant={"default"}
                size="sm"
                className={
                  category.category_id === selectedCategory
                    ? " text-white "
                    : " text-green-400"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
          <Link href={"create-challenge"} className="w-full">
            <Button variant={"default"}>Create a challenge</Button>
          </Link>
        </div>
      </div>

      {/* Challenges Grid */}
      <Loader isLoading={isLoading || challengesIsLoading}>
        {challenges.length === 0 ? (
          <NoItemsFound
            title="No challenges found"
            description="There are no challenges to show right now. Be the first to create one and start the competition!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.challenge_id}
                href={`/challenges/${challenge.challenge_id}`}
              >
                <Card className="relative border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group overflow-hidden">
                  {/* Thumbnail Section */}
                  {challenge.thumbnail ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <CldImage
                        src={challenge.thumbnail}
                        alt={challenge.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-green-500/10 to-green-600/5 border-b border-green-500/20 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-green-400/40" />
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4">
                    <Badge
                      className={`${getLevelColor(
                        challenge.difficulty
                      )} border`}
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-400"
                      >
                        {challenge.category.name}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{challenge.points}</span>
                      </div>
                    </div>
                    <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {challenge.description.split(" ").slice(0, 20).join(" ")}
                      ...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{challenge.solves} solves</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Loader>
    </main>
  );
}
