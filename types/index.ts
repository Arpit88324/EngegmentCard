export interface WeddingDetails {
  bride: string;
  groom: string;
  weddingDate: string; // ISO string
  displayDate: string;
  venue: string;
  venueAddress: string;
  mapQuery: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: "welcome" | "engagement" | "dinner" | "blessing";
}

export interface RSVPFormData {
  name: string;
  phone: string;
  guests: number;
  willAttend: "yes" | "no" | "";
  message: string;
}

export interface RSVPRecord extends RSVPFormData {
  id: string;
  submittedAt: string;
}
