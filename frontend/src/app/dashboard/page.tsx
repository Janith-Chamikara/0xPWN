/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Progress } from "@components/ui/progress";
import {
  Wallet,
  ShoppingCart,
  Sparkles,
  Crown,
  Check,
  Copy,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useClipboard } from "use-clipboard-copy";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Reward, Status } from "@/lib/types";
import { getAllAvailableRewardByUserId } from "@/lib/actions";

export default function DashboardPage() {
  const { data: session } = useSession();

  const router = useRouter();
  const { data, isLoading, refetch } = useQuery<Status | undefined>({
    queryKey: ["available-rewards", session?.user.user_id],
    queryFn: () =>
      getAllAvailableRewardByUserId(session?.user.user_id as string),
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const clipboard = useClipboard({
    copiedTimeout: 2000,
  });
  const handleCopy = () => {
    clipboard.copy(session?.user.user_id);
    setIsCopied(true);
  };

  const availableRewards = (data?.data as Reward[]) ?? [];
  console.log(availableRewards);
  const mintedRewards = availableRewards.map(
    (reward) => reward.status === "MINTED"
  );
  console.log("MINTED REWARDS ", mintedRewards);
  if (!session) {
    router.push("/sign-in");
    return;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto  !text-primary_color">
      <div className="grid grid-cols-1 gap-6">
        {/* Player Profile */}
        <Card className="mt-6 border-green-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Player Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 bg-transparent border-2 border-green-500">
                <AvatarFallback className="bg-transparent text-green-400">
                  {session.user.username.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-green-400">
                  {session.user?.username}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-row justify-start items-center gap-4 w-full">
                <div>User ID : </div>
                <div>
                  <Input
                    id="link"
                    defaultValue={session.user.user_id}
                    readOnly
                    className="min-w-[400px] w-full"
                  />
                </div>
                <Button
                  variant={"default"}
                  type="submit"
                  size="sm"
                  onClick={handleCopy}
                >
                  <span className="sr-only">Copy</span>
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Experience</span>
                <span className="text-green-400">
                  {session.user.experience} / 10000 XP
                </span>
              </div>
              <Progress
                value={(session.user.experience / 10000) * 100}
                className=" [&>div]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
