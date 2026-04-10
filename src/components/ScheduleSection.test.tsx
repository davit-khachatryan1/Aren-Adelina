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
    expect(screen.getByText("Ք.Հրազդան,Կամոյի 3")).toBeInTheDocument();
  });

  it("opens the Google/Yandex chooser for the ceremony venue", async () => {
    const user = userEvent.setup();
    render(<ScheduleSection />);

    const ceremony = siteConfig.events.find(event => event.id === "ceremony");
    const ceremonyCard = getEventCard("Կեչառիսի վանական համալիր");
    const chooserButton = within(ceremonyCard).getByRole("button", { name: "Տեսնել հասցեն" });

    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
    expect(within(ceremonyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();

    await user.click(chooserButton);

    expect(chooserButton).toHaveAttribute("aria-expanded", "true");
    expect(within(ceremonyCard).getByRole("link", { name: "Google Maps" })).toHaveAttribute(
      "href",
      ceremony?.mapLinks.google
    );
    expect(within(ceremonyCard).getByRole("link", { name: "Yandex Maps" })).toHaveAttribute(
      "href",
      ceremony?.mapLinks.yandex
    );

    await user.keyboard("{Escape}");
    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes a Google/Yandex chooser for the Palais venue", async () => {
    const user = userEvent.setup();
    render(<ScheduleSection />);

    const party = siteConfig.events.find(event => event.id === "party");
    const partyCard = getEventCard("«Պալաիս» ռեստորանային համալիր");
    const chooserButton = within(partyCard).getByRole("button", { name: "Տեսնել հասցեն" });

    expect(chooserButton).toHaveAttribute("aria-expanded", "false");
    expect(within(partyCard).queryByRole("link", { name: "Google Maps" })).not.toBeInTheDocument();
    expect(within(partyCard).queryByRole("link", { name: "Yandex Maps" })).not.toBeInTheDocument();

    await user.click(chooserButton);

    const googleLink = within(partyCard).getByRole("link", { name: "Google Maps" });
    const yandexLink = within(partyCard).getByRole("link", { name: "Yandex Maps" });

    expect(chooserButton).toHaveAttribute("aria-expanded", "true");
    expect(googleLink).toHaveAttribute("href", party?.mapLinks.google);
    expect(yandexLink).toHaveAttribute("href", party?.mapLinks.yandex);

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
  });
});
