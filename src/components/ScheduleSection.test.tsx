import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByText("Ք.Հրազդան,Չարենցի փողոց 3")).toBeInTheDocument();
  });

  it("renders a direct address link for the ceremony event", () => {
    render(<ScheduleSection />);

    const ceremonyCard = getEventCard("Կեչառիսի վանական համալիր");
    const ceremonyLink = within(ceremonyCard).getByRole("link", { name: "Ուղղել հասցեն" });
    const ceremonyMapUrl = siteConfig.events.find(event => event.id === "ceremony")?.mapLinks.google;

    expect(ceremonyMapUrl).toBeDefined();
    expect(ceremonyLink).toHaveAttribute("href", ceremonyMapUrl);
  });

  it("opens and closes a Google/Yandex chooser for the Palais venue", async () => {
    const user = userEvent.setup();
    render(<ScheduleSection />);

    const partyCard = getEventCard("«Պալաիս» ռեստորանային համալիր");
    const chooserButton = within(partyCard).getByRole("button", { name: "Ուղղել հասցեն" });

    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
    expect(within(partyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();
    expect(within(partyCard).queryByRole("link", { name: "Yandex Maps" })).not.toBeInTheDocument();

    await user.click(chooserButton);

    const googleLink = within(partyCard).getByRole("link", { name: "Google Maps" });
    const yandexLink = within(partyCard).getByRole("link", { name: "Yandex Maps" });

    expect(chooserButton).toHaveAttribute("aria-expanded", "true");
    expect(yandexLink).toHaveAttribute(
      "href",
      "https://yandex.com/maps/org/palais_wedding_hall/202867135433/?ll=44.753757%2C40.500713&utm_source=share&z=18"
    );

    await user.click(chooserButton);

    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
    expect(within(partyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();
    expect(within(partyCard).queryByRole("link", { name: "Yandex Maps" })).not.toBeInTheDocument();

    await user.click(chooserButton);
    expect(within(partyCard).getByRole("link", { name: "Google Maps" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
    expect(within(partyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();

    await user.click(chooserButton);
    await user.click(within(partyCard).getByRole("link", { name: "Google Maps" }));

    expect(within(partyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();
    expect(within(partyCard).queryByRole("link", { name: "Yandex Maps" })).not.toBeInTheDocument();
    expect(googleLink).toHaveAttribute(
      "href",
      siteConfig.events.find(event => event.id === "party")?.mapLinks.google
    );
  });
});
