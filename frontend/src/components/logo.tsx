"use client";
import Image from "next/image";
import logo from "@public/logo.png";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  return (
    <Image
      onClick={() => router.push("/")}
      src={logo}
      className="w-[104px] h-[34px] md:w-[204px] md:h-[60px]"
      alt="Logo"
    />
  );
}
