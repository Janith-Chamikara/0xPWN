"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Download,
  Flag,
  Star,
  Users,
  Clock,
  Trophy,
  Pen,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { Challenge, Status, Writeup } from "@/lib/types";
import {
  getChallengeById,
  getWriteupByChallengeId,
  submitChallengeFlag,
} from "@/lib/actions";
import Loader from "@/components/loader";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import WriteupDialogForm from "@/components/writeup-dialog-form";

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

export default function ChallengePage() {
  const { id } = useParams();
  console.log(id, "CHALLENGE ID");

  const { data, isLoading, refetch } = useQuery<Status | undefined>({
    queryKey: ["singleChallenge"],
    queryFn: () => getChallengeById(id as string),
  });
  const {
    data: writeupData,
    isLoading: writeupLoading,
    refetch: refetchWriteup,
  } = useQuery<Status | undefined>({
    queryKey: ["writups"],
    queryFn: () => getWriteupByChallengeId(id as string),
  });
  const writups = (writeupData?.data as Writeup[]) ?? [];
  console.log(writeupData, "WRITEUP DATA");
  console.log(data, "SINGLE CHALLENGE DATA");
  const challenge = (data?.data as Challenge) || null;
  const [flag, setFlag] = useState("");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleFlagSubmit = async () => {
    if (flag == "") {
      toast.error("Flag cannot be empty");
      return;
    }
    const response = await submitChallengeFlag({
      flag: flag,
      challenge_id: id as string,
      user_id: session?.user.user_id,
    });

    console.log(flag, id, session?.user.user_id);

    if (response) {
      if (response.status === "success") {
        setSubmitMessage(response?.message as string);
        refetch();
      } else {
        setSubmitMessage(response?.message as string);
      }
      setIsSubmitting(false);
    }
  };

  if (!challenge && !isLoading) {
    return (
      <div className="min-h-screen text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Challenge Not Found</h1>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  return (
    <Loader isLoading={isLoading}>
      {challenge && (
        <div className="min-h-screen">
          <main className="container mt-[60px] mx-auto px-4 py-8">
            <Heading>{challenge?.title}</Heading>
            <Link
              href="/challenges"
              className="inline-flex items-center text-green-400 hover:text-green-300 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenges
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Thumbnail Section */}
                {challenge?.thumbnail && (
                  <Card className="bg-transparent border-primary_color overflow-hidden">
                    <div className="relative w-full h-64 lg:h-80">
                      <CldImage
                        src={challenge.thumbnail}
                        alt={challenge.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className="border-primary_color text-primary_color">
                              {challenge.category?.name}
                            </Badge>
                            <Badge
                              className={`${getLevelColor(
                                challenge.difficulty
                              )} border`}
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-lg font-semibold text-yellow-400">
                            <Star className="h-5 w-5 fill-yellow-400" />
                            <span>{challenge.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="bg-transparent border-primary_color">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        {!challenge?.thumbnail && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="border-primary_color  text-primary_color">
                              {challenge?.category?.name}
                            </Badge>
                            <Badge
                              className={`${getLevelColor(
                                challenge?.difficulty
                              )} border`}
                            >
                              {challenge?.difficulty}
                            </Badge>
                          </div>
                        )}
                        <CardTitle className="text-2xl mb-2">
                          {challenge?.title}
                        </CardTitle>
                      </div>
                      {!challenge?.thumbnail && (
                        <div className="flex items-center space-x-1 text-lg font-semibold text-yellow-400">
                          <Star className="h-5 w-5 fill-yellow-400" />
                          <span>{challenge?.points}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card className=" border-primary_color">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      Challenge Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-gray-300">
                      {challenge?.description}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className=" border-primary_color">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Flag className="h-5 w-5 mr-2" />
                      Submit Flag
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitFlag} className="space-y-4">
                      <Input
                        placeholder="flag{your_flag_here}"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        className=" border-green-500/30 text-green-400 placeholder:text-gray-500 focus:border-green-400"
                      />
                      <Button
                        onClick={handleFlagSubmit}
                        type="submit"
                        variant={"default"}
                        disabled={isSubmitting || !flag.trim()}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Flag"}
                      </Button>
                      {submitMessage && (
                        <div
                          className={`text-sm p-2 rounded ${
                            submitMessage.includes("successfully")
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {submitMessage}
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
                <Card className="border-primary_color">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Challenge Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button size="sm" variant={"default"}>
                        <a href={`${challenge?.resources}`} target="_blank">
                          View resources
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary_color">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <Pen className="h-5 w-5 mr-2" />
                      Create Writeup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <WriteupDialogForm
                        refetch={refetchWriteup}
                        challengeId={challenge.challenge_id}
                        trigger={
                          <Button size="sm" variant={"default"}>
                            Create Writeup
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary_color">
                  <CardHeader>
                    <CardTitle>Challenge Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>Solves</span>
                      </div>
                      <span className="text-green-400 font-semibold">
                        {challenge?.solves}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Trophy className="h-4 w-4" />
                        <span>Points</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">
                        {challenge?.points}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Created</span>
                      </div>
                      <span className="text-gray-300">
                        {new Date(challenge?.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <span>Author</span>
                      </div>
                      <Link
                        href={`/user/${challenge.created_by}`}
                        className="text-gray-300 hover:text-primary_color transition-colors"
                      >
                        {challenge?.user?.username}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Writeups Section */}
            <div className="mt-8">
              <Card className="bg-transparent border-primary_color">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Pen className="h-5 w-5 mr-2" />
                    Community Writeups ({writups.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {writeupLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Loading writeups...</p>
                    </div>
                  ) : writups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {writups.map((writeup) => (
                        <Link
                          key={writeup.writeup_id}
                          href={`/writeups/${writeup.writeup_id}`}
                          className="block"
                        >
                          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg text-green-400 line-clamp-2">
                                  {writeup.title}
                                </CardTitle>
                                <Badge
                                  className={`ml-2 text-xs ${
                                    writeup.visibility === "public"
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  } border`}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  {writeup.visibility}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>
                                    {writeup.user?.username || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(
                                      writeup.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-gray-300 text-sm line-clamp-3">
                                {writeup.content.substring(0, 120)}...
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <Pen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No writeups available yet</p>
                        <p className="text-sm">
                          Be the first to create a writeup for this challenge!
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      )}
    </Loader>
  );
}
