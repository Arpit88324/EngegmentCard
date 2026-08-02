import type { Metadata } from "next";
import Hero from "@/components/Hero";
import EnvelopeInvite from "@/components/EnvelopeInvite";
import WeddingDetails from "@/components/WeddingDetails";
import Venue from "@/components/Venue";
import RSVPForm from "@/components/RSVPForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "You're Invited — Anuja & Mayuresh",
  description: "13th September · Rathode Lawn. Open your invitation.",
};

/**
 * This route is the link printed on the physical wedding card / PDF.
 * It skips the loading screen so guests land directly in the invitation
 * experience the moment they tap the icon.
 */
export default function InvitePage() {
  return (
    <main>
      <Hero />
      <EnvelopeInvite />
      <WeddingDetails />
      <Venue />
      <RSVPForm />
      <Footer />
    </main>
  );
}
