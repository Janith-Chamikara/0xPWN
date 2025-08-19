import Heading from "@/components/heading";
import CreateChallenge from "./form";
import { Suspense } from "react";

export default function CreateChallengePage() {
  return (
    <main className="max-w-7xl mx-auto">
      <div className="mt-[60px]">
        <Heading>Create a challenge</Heading>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <CreateChallenge />
        </Suspense>
      </div>
    </main>
  );
}
