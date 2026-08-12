"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import WeddingDetails from "@/components/WeddingDetails";
import CountdownTimer from "@/components/CountdownTimer";
import Venue from "@/components/Venue";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <main className={loading ? "invisible" : "visible"}>
        <Hero />
        <WeddingDetails />
        <CountdownTimer />
        <Venue />
      </main>
    </>
  );
}
