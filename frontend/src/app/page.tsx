"use client";

import FaqAccordion from "@/components/faq-accordion";
import Hero from "@/components/hero";
import RainingLetters from "@/components/raining-text";
import dynamic from "next/dynamic";

// Dynamically import Terminal component to avoid SSR issues
const Terminal = dynamic(() => import("@/components/terminal"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-[#020A09] animate-pulse rounded" />
  ),
});

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
