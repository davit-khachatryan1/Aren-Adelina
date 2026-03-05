export type SectionId = "hero" | "story" | "schedule" | "rsvp" | "info";

export interface EventItem {
  id: string;
  title: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  icon: string;
}

export interface StoryImageSpec {
  src: string;
  alt: string;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
  layer: "primary" | "secondary";
}

export interface WeddingConfig {
  locale: "hy";
  coupleNames: string;
  weddingDateISO: string;
  heroImage: string;
  storyImages: StoryImageSpec[];
  events: EventItem[];
  musicFile: string;
  rsvpEndpoint: string;
  ctaLabel: string;
}

export interface CountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export interface RsvpPayload {
  attending: "yes" | "no";
  attendingParts: Array<"ceremony" | "party">;
  fullName: string;
  guestCount: number;
  note?: string;
}

export type SubmitResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };
