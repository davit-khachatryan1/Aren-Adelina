import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "../config/siteConfig";
import { ScheduleSection } from "./ScheduleSection";

const getEventCard = (venue: string) => {
  const card = screen.getByText(venue).closest("article");
  expect(card).not.toBeNull();
  return card as HTMLElement;
};

describe("ScheduleSection", () => {
  it("renders both schedule venues with their addresses", () => {
    render(<ScheduleSection />);

    expect(screen.getByText("Կեչառիսի վանական համալիր")).toBeInTheDocument();
    expect(screen.getByText("Խաչատուր Կեչառեցի փողոց")).toBeInTheDocument();
    expect(screen.getByText("«Պալաիս» ռեստորանային համալիր")).toBeInTheDocument();
    expect(screen.getByText("Ք.Հրազդան,Կամոյի 3")).toBeInTheDocument();
  });

  it("shows հասցեն with Google and Yandex icon links for the ceremony", () => {
    render(<ScheduleSection />);

    const ceremony = siteConfig.events.find(event => event.id === "ceremony");
    const ceremonyCard = getEventCard("Կեչառիսի վանական համալիր");

    expect(within(ceremonyCard).getByText("հասցեն")).toBeInTheDocument();

    const googleLink = within(ceremonyCard).getByRole("link", { name: "Google Maps" });
    const yandexLink = within(ceremonyCard).getByRole("link", { name: "Yandex Maps" });

    expect(googleLink).toHaveAttribute("href", ceremony?.mapLinks.google);
    expect(yandexLink).toHaveAttribute("href", ceremony?.mapLinks.yandex);
  });

  it("shows հասցեն with Google and Yandex icon links for the Palais venue", () => {
    render(<ScheduleSection />);

    const party = siteConfig.events.find(event => event.id === "party");
    const partyCard = getEventCard("«Պալաիս» ռեստորանային համալիր");

    expect(within(partyCard).getByText("հասցեն")).toBeInTheDocument();

    const googleLink = within(partyCard).getByRole("link", { name: "Google Maps" });
    const yandexLink = within(partyCard).getByRole("link", { name: "Yandex Maps" });

    expect(googleLink).toHaveAttribute("href", party?.mapLinks.google);
    expect(yandexLink).toHaveAttribute("href", party?.mapLinks.yandex);
  });
});
