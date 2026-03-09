import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RsvpSection } from "./RsvpSection";

describe("RsvpSection behavior", () => {
  it("keeps core fields accessible by labels", () => {
    render(<RsvpSection />);

    expect(screen.getByLabelText("Այո, կգամ")).toBeInTheDocument();
    expect(screen.getByLabelText("Ցավոք, չեմ կարող")).toBeInTheDocument();
    expect(screen.getByLabelText("Ադելինայի")).toBeInTheDocument();
    expect(screen.getByLabelText("Արենի")).toBeInTheDocument();
    expect(screen.getByLabelText("Անուն, Ազգանուն")).toBeInTheDocument();
    expect(screen.getByLabelText("Հյուրերի քանակը")).toBeInTheDocument();
    expect(screen.getByLabelText("Մեկնաբանություն (ըստ ցանկության)")).toBeInTheDocument();
  });

  it("disables participation checkboxes when attendance is no", async () => {
    const user = userEvent.setup();
    render(<RsvpSection />);

    const ceremony = screen.getByLabelText("Ադելինայի") as HTMLInputElement;
    const party = screen.getByLabelText("Արենի") as HTMLInputElement;
    const guestCount = screen.getByLabelText("Հյուրերի քանակը") as HTMLInputElement;

    expect(ceremony.disabled).toBe(false);
    expect(party.disabled).toBe(false);
    expect(guestCount.min).toBe("1");

    await user.click(screen.getByLabelText("Ցավոք, չեմ կարող"));

    expect(ceremony.disabled).toBe(true);
    expect(party.disabled).toBe(true);
    expect(guestCount.min).toBe("0");
  });

  it("re-enables participation checkboxes when attendance returns to yes", async () => {
    const user = userEvent.setup();
    render(<RsvpSection />);

    const ceremony = screen.getByLabelText("Ադելինայի") as HTMLInputElement;
    const party = screen.getByLabelText("Արենի") as HTMLInputElement;

    await user.click(screen.getByLabelText("Ցավոք, չեմ կարող"));
    expect(ceremony.disabled).toBe(true);
    expect(party.disabled).toBe(true);

    await user.click(screen.getByLabelText("Այո, կգամ"));

    expect(ceremony.disabled).toBe(false);
    expect(party.disabled).toBe(false);
  });
});
