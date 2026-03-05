import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RsvpSection } from "./RsvpSection";

describe("RsvpSection behavior", () => {
  it("disables participation checkboxes when attendance is no", async () => {
    const user = userEvent.setup();
    render(<RsvpSection />);

    const ceremony = screen.getByLabelText("Լիդիայի") as HTMLInputElement;
    const party = screen.getByLabelText("Դավիթի") as HTMLInputElement;
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

    const ceremony = screen.getByLabelText("Լիդիայի") as HTMLInputElement;
    const party = screen.getByLabelText("Դավիթի") as HTMLInputElement;

    await user.click(screen.getByLabelText("Ցավոք, չեմ կարող"));
    expect(ceremony.disabled).toBe(true);
    expect(party.disabled).toBe(true);

    await user.click(screen.getByLabelText("Այո, կգամ"));

    expect(ceremony.disabled).toBe(false);
    expect(party.disabled).toBe(false);
  });
});
