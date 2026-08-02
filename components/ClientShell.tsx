"use client";

import { useLenis } from "@/hooks/useLenis";
import CursorGlow from "@/components/CursorGlow";
import FloatingPetals from "@/components/FloatingPetals";
import ScrollProgressLeaf from "@/components/ScrollProgressLeaf";
import BackToTop from "@/components/BackToTop";
import MusicToggle from "@/components/MusicToggle";
import Navbar from "@/components/Navbar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useLenis();

  return (
    <>
      <Navbar />
      <CursorGlow />
      <FloatingPetals />
      <ScrollProgressLeaf />
      {children}
      <BackToTop />
      <MusicToggle />
    </>
  );
}
