"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { Writeup, Status } from "@/lib/types";
import { getWriteupById } from "@/lib/actions";
import Loader from "@/components/loader";
import { useParams } from "next/navigation";

export default function WriteupPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<Status | undefined>({
    queryKey: ["writeup", id],
    queryFn: () => getWriteupById(id as string),
  });

  const writeup = (data?.data as Writeup) || null;

  if (!writeup && !isLoading) {
    return (
      <div className="min-h-screen text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Writeup Not Found</h1>
          <Link href="/challenges">
            <Button className="bg-green-600 hover:bg-green-700">
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Loader isLoading={isLoading}>
      {writeup && (
        <div className="min-h-screen">
          <main className="container mt-[60px] mx-auto px-4 py-8">
            <Heading>{writeup.title}</Heading>

            <div className="flex items-center justify-between mb-6">
              <Link
                href={`/challenges/${writeup.challenge_id}`}
                className="inline-flex items-center text-green-400 hover:text-green-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Challenge
              </Link>

              <Badge
                className={`${
                  writeup.visibility === "public"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                } border`}
              >
                <Eye className="h-3 w-3 mr-1" />
                {writeup.visibility}
              </Badge>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-transparent border-primary_color mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <User className="h-4 w-4" />
                        <span>By: {writeup.user?.username || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(writeup.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-transparent border-primary_color">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Writeup Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {writeup.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      )}
    </Loader>
  );
}
