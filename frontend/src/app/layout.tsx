import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import MeshWrapper from "@providers/wallet-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import hero_background from "@public/hero-background.png";
import Footer from "@/components/footer";
import AuthContextProvider from "@/providers/auth-provider";
import QueryContextProvider from "@/providers/query-provider";

const unbounded = Unbounded({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "0XPWN",
  description: "Built with Mesh.js and Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.className} font-outfit bg-[#020A09]  text-primary_color px-[24px] lg:px-[40px]`}
      >
        <AuthContextProvider>
          <QueryContextProvider>
            <MeshWrapper>
              <Navbar />

              <Image
                src={hero_background}
                layout="fill"
                quality={100}
                alt="hero background image"
                className="z-[-100] hidden md:block  absolute inset-0 mx-auto object-cover"
              />

              {children}
              <Toaster position="top-right" />
              <Footer />
            </MeshWrapper>
          </QueryContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
