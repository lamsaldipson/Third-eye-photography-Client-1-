import { reviews, studio } from "@/lib/content";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-6 md:px-10 py-20">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          What couples say
        </h2>
        <p className="text-ink/60 text-sm">
          {studio.rating.toFixed(1)} average from {studio.reviewCount} Google reviews
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 md:gap-8">
        {reviews.map((review, i) => (
          <figure
            key={review.id}
            className={`pt-6 ${i > 0 ? "md:border-l md:border-ink/10 md:pl-8" : ""}`}
          >
            <blockquote className="text-ink/85 leading-relaxed">
              "{review.body}"
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="text-ink">{review.name}</span>
              <span className="text-ink/45"> · {review.timeframe}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
