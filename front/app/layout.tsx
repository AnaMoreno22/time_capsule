import "./globals.css";
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from "next/font/google";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Hero } from "./components/Hero";
import { Profile } from "./components/Profile";
import { SignIn } from "./components/SignIn";
import { Copyright } from "./components/Copyright";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = BaiJamjuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bai-jamjuree",
});

export const metadata = {
  title: "SpaceTime",
  description:
    "Uma cápsula do tempo construída com React, Next.js, Tailwind e TypeScript",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has("token");
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <div className="grid min-h-screen grid-cols-2">
          <div className="relative  flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] px-28 py-16 ">
            {/* Blur  */}
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-700 opacity-50 blur-full" />
            {/* Stripes  */}
            <div className="absolute bottom-0 right-2 top-0 w-2  bg-stripes " />
            {isAuthenticated ? <Profile /> : <SignIn />}

            <Hero />

            <Copyright />
          </div>{" "}
          <div className="flex flex-col bg-[url(../assets/bg-stars.svg)] p-16 ">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}