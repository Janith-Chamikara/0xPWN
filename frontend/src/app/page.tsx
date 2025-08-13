import FaqAccordion from "@/components/faq-accordion";

import Hero from "@/components/hero";
import RainingLetters from "@/components/raining-text";
import Terminal from "@/components/terminal";

export default function Home() {
  return (
    <main className="container  mx-auto max-w-7xl px-4 py-8">
      <RainingLetters />
      <Hero />
      <div className="flex flex-col gap-20">
        <Terminal />
        <FaqAccordion />
      </div>
    </main>
  );
}
