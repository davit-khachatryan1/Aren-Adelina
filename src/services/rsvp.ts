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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `HTTP ${response.status}`
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Network error"
    };
  }
};
