import { z } from "zod";
import { RsvpPayload } from "../types/site";

export const rsvpSchema = z
  .object({
    attending: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "Ընտրեք տարբերակ" })
    }),
    attendingParts: z.array(z.enum(["ceremony", "party"])).default([]),
    fullName: z
      .string()
      .trim()
      .min(2, "Մուտքագրեք անուն և ազգանուն"),
    guestCount: z.coerce
      .number({ invalid_type_error: "Մուտքագրեք թիվ" })
      .int("Միայն ամբողջ թիվ")
      .min(0, "Չի կարող լինել բացասական")
      .max(20, "Մաքսիմում 20"),
    note: z.string().trim().max(500, "Մաքսիմում 500 սիմվոլ").optional()
  })
  .superRefine((data, ctx) => {
    if (data.attending === "yes" && data.attendingParts.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ընտրեք գոնե մեկին",
        path: ["attendingParts"]
      });
    }

    if (data.attending === "yes" && data.guestCount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Մուտքագրեք հյուրերի քանակը",
        path: ["guestCount"]
      });
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const normalizeRsvpPayload = (values: RsvpFormValues): RsvpPayload => {
  const mappedParts = values.attendingParts.map(part => {
    if (part === "ceremony") return "Adelinayi";
    if (part === "party") return "Areni";
    return part;
  });

  return {
    attending: values.attending,
    attendingParts: mappedParts,
    fullName: values.fullName.trim(),
    guestCount: values.guestCount,
    note: values.note?.trim() || undefined
  };
};
