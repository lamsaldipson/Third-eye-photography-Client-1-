"use client";

import { useState, type FormEvent } from "react";
import WisdomEyeMark from "@/components/WisdomEyeMark";

type Status = "idle" | "submitting" | "success" | "error";

const eventTypes = [
  "Wedding",
  "Engagement",
  "Pre-wedding shoot",
  "Reception",
  "Other",
] as const;

const packages = ["Essential", "Signature", "Heirloom", "Not sure yet"] as const;

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-maroon/20 bg-paperlight rounded-sm p-8 flex flex-col items-start gap-4">
        <WisdomEyeMark className="w-10 h-8 text-maroon" />
        <div>
          <h2 className="font-display text-2xl text-ink mb-2">Request sent</h2>
          <p className="text-ink/70 leading-relaxed max-w-sm">
            Thank you — we've received your details and will follow up by
            email or phone within a couple of days to confirm availability.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm text-maroon underline underline-offset-4 hover:text-maroon-dark"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="field-label">
            Full name
          </label>
          <input id="fullName" name="fullName" required className="field-input" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Phone number
          </label>
          <input id="phone" name="phone" required className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="field-input"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="eventType" className="field-label">
            Event type
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue=""
            className="field-input"
          >
            <option value="" disabled>
              Choose one
            </option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="eventDate" className="field-label">
            Event date
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            className="field-input"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="venue" className="field-label">
            Venue (if known)
          </label>
          <input id="venue" name="venue" className="field-input" />
        </div>
        <div>
          <label htmlFor="guestCount" className="field-label">
            Estimated guests
          </label>
          <input id="guestCount" name="guestCount" className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="package" className="field-label">
          Interested package
        </label>
        <select
          id="package"
          name="package"
          defaultValue="Not sure yet"
          className="field-input"
        >
          {packages.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Anything else we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="field-input resize-none"
          placeholder="Ceremony traditions, timeline, second-shooter needs, etc."
        />
      </div>

      {error && (
        <p className="text-sm text-maroon-dark bg-maroon/5 border border-maroon/20 rounded-sm px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}
