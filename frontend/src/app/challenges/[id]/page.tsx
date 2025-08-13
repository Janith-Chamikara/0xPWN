"use client";

import type React from "react";

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
import {
  ArrowLeft,
  Download,
  Flag,
  Star,
  Users,
  Clock,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { Challenge, Status } from "@/lib/types";
import { getChallengeById, submitChallengeFlag } from "@/lib/actions";
import Loader from "@/components/loader";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

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
        toast.success(response?.message as string);
        refetch();
      } else {
        toast.error(response?.message as string);
      }
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

    // Simulate API call
    setTimeout(() => {
      if (
        flag.toLowerCase().includes("flag") ||
        flag.toLowerCase().includes("ctf")
      ) {
        setSubmitMessage("🎉 Correct! Flag submitted successfully!");
      } else {
        setSubmitMessage("❌ Incorrect flag. Try again!");
      }
      setIsSubmitting(false);
    }, 1000);
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
                <Card className="bg-transparent border-primary_color">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
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
                        <CardTitle className="text-2xl mb-2">
                          {challenge?.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {challenge?.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 text-lg font-semibold text-yellow-400">
                        <Star className="h-5 w-5 fill-yellow-400" />
                        <span>{challenge?.points}</span>
                      </div>
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
                            submitMessage.includes("Correct")
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
                      <span className="text-gray-300">
                        {challenge?.user?.username}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      )}
    </Loader>
  );
}
