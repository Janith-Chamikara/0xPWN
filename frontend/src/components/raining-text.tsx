"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";

interface Character {
  char: string;
  x: number;
  y: number;
  speed: number;
}

const RainingLetters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  const createCharacters = useCallback(() => {
    const allChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const charCount = 300;
    const newCharacters: Character[] = [];

    for (let i = 0; i < charCount; i++) {
      newCharacters.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      });
    }
    return newCharacters;
  }, []);

  useEffect(() => {
    setCharacters(createCharacters());
  }, [createCharacters]);

  useEffect(() => {
    const updateActiveIndices = () => {
      const newActiveIndices = new Set<number>();
      const numActive = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numActive; i++) {
        newActiveIndices.add(Math.floor(Math.random() * characters.length));
      }
      setActiveIndices(newActiveIndices);
    };

    const flickerInterval = setInterval(updateActiveIndices, 200);
    return () => clearInterval(flickerInterval);
  }, [characters.length]);

  useEffect(() => {
    let animationFrameId: number;
    const updatePositions = () => {
      setCharacters((prevChars) =>
        prevChars.map((char) => ({
          ...char,
          y: char.y + char.speed,
          ...(char.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"[
              Math.floor(
                Math.random() *
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
                    .length
              )
            ],
          }),
        }))
      );
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      {/* Fixed background container */}
      <div className="fixed inset-0 w-full h-full bg-transparent overflow-hidden pointer-events-none z-0">
        {/* Raining Characters */}
        {characters.map((char, index) => (
          <span
            key={index}
            className={`absolute text-xs transition-colors duration-100 ${
              activeIndices.has(index)
                ? "text-[#00ff00] text-base scale-125 z-10 font-bold animate-pulse"
                : "text-slate-800 font-light"
            }`}
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              transform: `translate(-50%, -50%) ${
                activeIndices.has(index) ? "scale(1.25)" : "scale(1)"
              }`,
              textShadow: activeIndices.has(index)
                ? "0 0 6px rgba(0,255,0,0.4), 0 0 8px rgba(0,255,0,0.2)"
                : "none",
              opacity: activeIndices.has(index) ? 0.6 : 0.2,
              transition: "color 0.1s, transform 0.1s, text-shadow 0.1s",
              willChange: "transform, top",
              fontSize: "1.8rem",
            }}
          >
            {char.char}
          </span>
        ))}
      </div>
    </>
  );
};

export default RainingLetters;
