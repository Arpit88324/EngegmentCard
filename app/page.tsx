"use client";

import { useState } from "react";
import VideoIntro from "@/components/VideoIntro";
import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import Venue from "@/components/Venue";

export default function HomePage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <VideoIntro onFinish={() => setIntroDone(true)} />}
      <main>
        <Hero />
        <CountdownTimer />
        <Venue />
      </main>
    </>
  );
}
