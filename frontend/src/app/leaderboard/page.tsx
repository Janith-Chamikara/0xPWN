"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, User } from "lucide-react";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { Rank, Status } from "@/lib/types";
import { getAllUsersByRank } from "@/lib/actions";
import Loader from "@/components/loader";

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">
          #{rank}
        </span>
      );
  }
}

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery<Status | undefined>({
    queryKey: ["users"],
    queryFn: () => getAllUsersByRank(),
    refetchInterval: 5 * 60 * 1000,
  });
  const ranks = (data?.data as Rank[]) ?? [];
  return (
    <main className="container mx-auto flex flex-col gap-12 px-4 py-8">
      <div className="text-center mt-[60px]">
        <Heading>Challenges</Heading>
        <p className="text-lg max-w-2xl mx-auto">
          Test your cybersecurity skills across various categories. Solve
          challenges to earn points and climb the leaderboard.
        </p>
      </div>

      <Loader isLoading={isLoading}>
        <Card className="bg-transparent border-primary_color overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium  border-b border-primary_color pb-4 mb-4">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2">Points</div>
              <div className="col-span-2">Solves</div>
            </div>

            <div className="space-y-3">
              {ranks.map((entry, index) => (
                <div
                  key={index + 1}
                  className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-green-800 "
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(index + 1)}
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className=" font-medium">{entry.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className="text-primary_color border-primary_color"
                    >
                      {entry.experience.toLocaleString()} pts
                    </Badge>
                  </div>

                  <div className="col-span-2">
                    <span>{entry.solves} solves</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Loader>

      <div className="mt-8 text-center">
        <p className=" text-sm">
          Rankings update every 5 minutes • Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </main>
  );
}
