import Heading from "@/components/heading";
import CreateChallenge from "./form";

export default function CreateChallengePage() {
  return (
    <main className="max-w-7xl mx-auto">
      <div className="mt-[60px]">
        <Heading>Create a challenge</Heading>

        <CreateChallenge />
      </div>
    </main>
  );
}
