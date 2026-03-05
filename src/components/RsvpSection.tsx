import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteConfig } from "../config/siteConfig";
import { normalizeRsvpPayload, RsvpFormValues, rsvpSchema } from "../schema/rsvpSchema";
import { submitRsvp } from "../services/rsvp";
import { useSectionReveal } from "../hooks/useSectionReveal";

export const RsvpSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);

  useSectionReveal(sectionRef, ".rsvp-reveal", {
    y: 10,
    stagger: 0.05,
    duration: 0.5,
    ease: "power1.out",
    threshold: 0.2
  });

  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attending: "yes",
      attendingParts: [],
      fullName: "",
      guestCount: 1,
      note: ""
    }
  });

  const attending = watch("attending");
  const canAttend = attending === "yes";

  useEffect(() => {
    if (canAttend) {
      return;
    }

    setValue("attendingParts", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    const currentGuests = Number(getValues("guestCount"));
    if (Number.isFinite(currentGuests) && currentGuests < 0) {
      setValue("guestCount", 0, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [canAttend, getValues, setValue]);

  const onSubmit = handleSubmit(async values => {
    setSubmitMessage("");
    setIsError(false);

    const payload = normalizeRsvpPayload(values);
    const result = await submitRsvp(payload, siteConfig.rsvpEndpoint);

    if (result.ok) {
      setSubmitMessage(siteConfig.rsvp.labels.success);
      return;
    }

    setIsError(true);
    setSubmitMessage(
      result.message === "RSVP endpoint is not configured"
        ? "Խնդրում ենք նախ սահմանել RSVP endpoint-ը"
        : siteConfig.rsvp.labels.errorFallback
    );
  });

  return (
    <section ref={sectionRef} id="rsvp" className="rsvp-section" data-section="rsvp">
      <h2 className="rsvp-title rsvp-reveal">{siteConfig.rsvp.title}</h2>
      <p className="rsvp-subtitle rsvp-reveal">{siteConfig.rsvp.subtitle}</p>

      <form className="rsvp-form" onSubmit={onSubmit} data-testid="rsvp-form">
        <fieldset className="rsvp-group rsvp-reveal">
          <legend className="rsvp-group-title">{siteConfig.rsvp.labels.attendingQuestion}</legend>
          <div className="rsvp-options">
            <label className="rsvp-option" htmlFor="attending-yes">
              <input id="attending-yes" type="radio" value="yes" {...register("attending")} />
              <span>{siteConfig.rsvp.labels.attendingYes}</span>
            </label>
            <label className="rsvp-option" htmlFor="attending-no">
              <input id="attending-no" type="radio" value="no" {...register("attending")} />
              <span>{siteConfig.rsvp.labels.attendingNo}</span>
            </label>
          </div>
          {errors.attending ? <p className="field-error">{errors.attending.message}</p> : null}
        </fieldset>

        <fieldset className="rsvp-group rsvp-reveal">
          <legend className="rsvp-group-title">{siteConfig.rsvp.labels.partsQuestion}</legend>
          <div className="rsvp-options">
            <label className={`rsvp-option ${!canAttend ? "is-disabled" : ""}`} htmlFor="invite-ceremony">
              <input
                id="invite-ceremony"
                type="checkbox"
                value="ceremony"
                disabled={!canAttend}
                {...register("attendingParts")}
              />
              <span>{siteConfig.rsvp.labels.ceremony}</span>
            </label>
            <label className={`rsvp-option ${!canAttend ? "is-disabled" : ""}`} htmlFor="invite-party">
              <input
                id="invite-party"
                type="checkbox"
                value="party"
                disabled={!canAttend}
                {...register("attendingParts")}
              />
              <span>{siteConfig.rsvp.labels.party}</span>
            </label>
          </div>
          {errors.attendingParts ? (
            <p className="field-error">{errors.attendingParts.message}</p>
          ) : null}
        </fieldset>

        <label className="rsvp-field rsvp-reveal" htmlFor="rsvp-full-name">
          <span className="rsvp-field-label">{siteConfig.rsvp.labels.fullName}</span>
          <input
            id="rsvp-full-name"
            className="rsvp-input"
            type="text"
            placeholder="Գրեք ձեր անունը"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName ? <span className="field-error">{errors.fullName.message}</span> : null}
        </label>

        <label className="rsvp-field rsvp-reveal" htmlFor="rsvp-guest-count">
          <span className="rsvp-field-label">{siteConfig.rsvp.labels.guestCount}</span>
          <input
            id="rsvp-guest-count"
            className="rsvp-input"
            type="number"
            min={canAttend ? 1 : 0}
            step={1}
            {...register("guestCount", { valueAsNumber: true })}
          />
          {errors.guestCount ? <span className="field-error">{errors.guestCount.message}</span> : null}
        </label>

        <label className="rsvp-field rsvp-reveal" htmlFor="rsvp-note">
          <span className="rsvp-field-label">{siteConfig.rsvp.labels.note}</span>
          <textarea id="rsvp-note" className="rsvp-textarea" rows={4} {...register("note")} />
          {errors.note ? <span className="field-error">{errors.note.message}</span> : null}
        </label>

        <div className="rsvp-submit-wrap rsvp-reveal">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            data-testid="submit-rsvp"
          >
            {isSubmitting ? "Ուղարկվում է..." : siteConfig.rsvp.labels.submit}
          </button>
        </div>

        {submitMessage ? (
          <p className={`submit-message ${isError ? "error" : "success"}`}>{submitMessage}</p>
        ) : null}
      </form>
    </section>
  );
};
