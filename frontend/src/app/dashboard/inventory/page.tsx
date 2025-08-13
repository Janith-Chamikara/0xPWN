"use client";
import Loader from "@/components/loader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteChallenge, getAllChallengesCreatedByUser } from "@/lib/actions";
import { Challenge, Status } from "@/lib/types";
import { getLevelColor } from "@/lib/utils";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { Coins, Gem, Star, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("Session data in inventory page:", session);

  const { data, isLoading, refetch } = useQuery<Status | undefined>({
    queryKey: ["userCreatedChallenges", session?.user.user_id],
    queryFn: () =>
      getAllChallengesCreatedByUser(session?.user.user_id as string),
  });

  const userCreatedChallenges = (data?.data as Challenge[]) ?? [];

  const handleDeleteChallenge = async (challengeId: string) => {
    const response = await deleteChallenge(challengeId);
    if (response) {
      if (response.status === "success") {
        toast.success("Challenge deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete challenge");
      }
    }
  };

  console.log("Data fetched explorer page :", data);

  // const unMintedRewards = availableRewards.filter(
  //   (item) => item.status === "UNMINTED"
  // );
  // const mintedRewards = availableRewards.filter(
  //   (item) => item.status !== "UNMINTED"
  // );
  return (
    <div className="min-h-screen max-w-7xl mx-auto mt-6  !text-primary_color  ">
      <Card className="mt-6 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center justify-between">
            <div className="flex items-center">
              <Gem className="w-5 h-5 mr-2" />
              My challenges
            </div>
          </CardTitle>
        </CardHeader>
        <Loader isLoading={isLoading}>
          <CardContent>
            <div className="flex flex-col gap-4">
              {userCreatedChallenges.map((challenge) => (
                <Card
                  key={challenge.challenge_id}
                  className="relative border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer "
                >
                  <CardHeader>
                    <div className="flex items-start justify-start gap-4 mb-2">
                      <Badge
                        className={`${getLevelColor(
                          challenge.difficulty
                        )} border`}
                      >
                        {challenge.difficulty}
                      </Badge>
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
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{challenge.solves} solves</span>
                      </div>
                    </div>
                    <div className="flex flex-row mt-4 gap-4">
                      <Button
                        onClick={() =>
                          router.push(
                            `/create-challenge?id=${challenge.challenge_id}&edit=true`
                          )
                        }
                        variant={"default"}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#020A09]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-none" asChild>
                              <Button variant={"default"}>Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction className="border-none" asChild>
                              <Button
                                variant={"default"}
                                onClick={() =>
                                  handleDeleteChallenge(challenge.challenge_id)
                                }
                              >
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Loader>
      </Card>
      <Card className="mt-6 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              Solved Challenges
            </div>
          </CardTitle>
        </CardHeader>
        <Loader isLoading={isLoading}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"></div>
          </CardContent>
        </Loader>
      </Card>
    </div>
  );
}
