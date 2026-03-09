import { RsvpPayload, SubmitResult } from "../types/site";

export const submitRsvp = async (
  payload: RsvpPayload,
  endpoint: string
): Promise<SubmitResult> => {
  if (!endpoint) {
    return {
      ok: false,
      message: "RSVP endpoint is not configured"
    };
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });

    // With no-cors we can't read status; if fetch doesn't throw,
    // assume success so the UI can show the thank-you message.
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Network error"
    };
  }
};
