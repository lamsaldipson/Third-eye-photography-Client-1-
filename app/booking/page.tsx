import BookingForm from "./BookingForm";
import { studio } from "@/lib/content";

export const metadata = {
  title: "Book a date — Third Eye Photography",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-10 py-16">
      <p className="text-sm text-maroon mb-4">Booking request</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4 max-w-lg">
        Tell us about your day.
      </h1>
      <p className="text-ink/65 max-w-md mb-10 leading-relaxed">
        Send over the details below and we'll confirm availability and send
        a quote. For anything urgent, call {studio.phone} directly.
      </p>
      <BookingForm />
    </section>
  );
}
