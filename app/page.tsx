"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import EnvelopeInvite from "@/components/EnvelopeInvite";
import WeddingDetails from "@/components/WeddingDetails";
import CountdownTimer from "@/components/CountdownTimer";
import OurStory from "@/components/OurStory";
import SacredSymbols from "@/components/SacredSymbols";
import Venue from "@/components/Venue";
import Schedule from "@/components/Schedule";
import Blessings from "@/components/Blessings";
import RSVPForm from "@/components/RSVPForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <main className={loading ? "invisible" : "visible"}>
        <Hero />
        <EnvelopeInvite />
        <WeddingDetails />
        <CountdownTimer />
        <OurStory />
        <SacredSymbols />
        <Venue />
        <Schedule />
        <Blessings />
        <RSVPForm />
        <Footer />
      </main>
    </>
  );
}
