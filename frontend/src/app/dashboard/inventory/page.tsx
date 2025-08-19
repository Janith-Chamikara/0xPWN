"use client";
import Loader from "@/components/loader";
import NoItemsFound from "@/components/no-items-found";
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
import {
  deleteChallenge,
  getAllChallengesCreatedByUser,
  getUserSolvedChallenges,
} from "@/lib/actions";
import { Challenge, Status, Submission } from "@/lib/types";
import { getLevelColor } from "@/lib/utils";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { Coins, Gem, Star, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CldImage } from "next-cloudinary";

export default function InventoryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("Session data in inventory page:", session);

  const { data, isLoading, refetch } = useQuery<Status | undefined>({
    queryKey: ["userCreatedChallenges", session?.user.user_id],
    queryFn: () =>
      getAllChallengesCreatedByUser(session?.user.user_id as string),
  });
  const { data: userSolvedData, isLoading: isLoadingSolved } = useQuery<
    Status | undefined
  >({
    queryKey: ["userSolvedChallenges", session?.user.user_id],
    queryFn: () => getUserSolvedChallenges(session?.user.user_id as string),
  });

  const userCreatedChallenges = (data?.data as Challenge[]) ?? [];
  const userSolvedChallenges = (userSolvedData?.data as Submission[]) ?? [];

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
          {userCreatedChallenges.length === 0 && <NoItemsFound />}
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              {userCreatedChallenges.map((challenge) => (
                <Card
                  key={challenge.challenge_id}
                  className="relative border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer s"
                  onClick={() =>
                    router.push(`/challenges/${challenge.challenge_id}`)
                  }
                >
                  <div className="relative h-40 w-full">
                    <CldImage
                      src={challenge.thumbnail || "sample_challenge_image.png"}
                      alt={challenge.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge
                        className={`${getLevelColor(
                          challenge.difficulty
                        )} border text-xs bg-black`}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-black text-green-400 text-xs"
                      >
                        {challenge.category.name}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{challenge.points}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors text-lg line-clamp-1">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm line-clamp-2">
                      {challenge.description.length > 80
                        ? `${challenge.description.substring(0, 80)}...`
                        : challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{challenge.solves} solves</span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/create-challenge?id=${challenge.challenge_id}&edit=true`
                          );
                        }}
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#020A09]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your challenge and remove it
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-none" asChild>
                              <Button variant="default">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction className="border-none" asChild>
                              <Button
                                variant="default"
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
        <Loader isLoading={isLoadingSolved}>
          {userSolvedChallenges.length === 0 && <NoItemsFound />}
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              {userSolvedChallenges.map((submission) => (
                <Card
                  key={submission.submission_id}
                  className="relative border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/challenges/${submission.challenge.challenge_id}`
                    )
                  }
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        submission.challenge.thumbnail ||
                        "/sample challenge image.png"
                      }
                      alt={submission.challenge.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge
                        className={`${getLevelColor(
                          submission.challenge.difficulty
                        )} border text-xs bg-black`}
                      >
                        {submission.challenge.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-400 text-xs bg-black"
                      >
                        {submission.challenge.category.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 text-xs"
                      >
                        Solved
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{submission.challenge.points}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors text-lg line-clamp-1">
                      {submission.challenge.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm line-clamp-2">
                      {submission.challenge.description.length > 80
                        ? `${submission.challenge.description.substring(
                            0,
                            80
                          )}...`
                        : submission.challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{submission.challenge.solves} solves</span>
                      </div>
                      <div>
                        Solved:{" "}
                        {new Date(
                          submission.submission_time
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Loader>
      </Card>
    </div>
  );
}
