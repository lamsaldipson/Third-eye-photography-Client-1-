"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Booking, GalleryImage } from "@/types";

const CATEGORIES: GalleryImage["category"][] = [
  "Wedding",
  "Bride",
  "Groom",
  "Portrait",
  "Behind the scenes",
];

const STATUSES: Booking["status"][] = ["new", "contacted", "confirmed", "declined"];

const STATUS_LABEL: Record<Booking["status"], string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  declined: "Declined",
};

export default function AdminDashboard({
  initialImages,
  initialBookings,
}: {
  initialImages: GalleryImage[];
  initialBookings: Booking[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"photos" | "bookings">("bookings");
  const [images, setImages] = useState(initialImages);
  const [bookings, setBookings] = useState(initialBookings);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: data });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
      setImages((prev) => [body.image, ...prev]);
      formRef.current?.reset();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const prev = images;
    setImages((cur) => cur.filter((img) => img.id !== id));
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) setImages(prev);
  }

  async function handleStatusChange(id: string, status: Booking["status"]) {
    const prev = bookings;
    setBookings((cur) => cur.map((b) => (b.id === id ? { ...b, status } : b)));
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setBookings(prev);
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="text-sm text-maroon mb-2">Studio dashboard</p>
          <h1 className="font-display text-3xl text-ink">
            Welcome back
          </h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Sign out
        </button>
      </div>

      <div className="flex gap-2 border-b border-ink/10 mb-8">
        <TabButton active={tab === "bookings"} onClick={() => setTab("bookings")}>
          Bookings ({bookings.length})
        </TabButton>
        <TabButton active={tab === "photos"} onClick={() => setTab("photos")}>
          Photos ({images.length})
        </TabButton>
      </div>

      {tab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 && (
            <p className="text-ink/60">No booking requests yet.</p>
          )}
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border border-ink/10 rounded-sm p-5 grid md:grid-cols-[1fr_auto] gap-4"
            >
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-display text-lg text-ink">{b.fullName}</h3>
                  <span className="text-sm text-ink/50">
                    {b.eventType} · {b.eventDate}
                  </span>
                </div>
                <p className="text-sm text-ink/70 mt-1">
                  {b.email} · {b.phone}
                </p>
                {(b.venue || b.guestCount) && (
                  <p className="text-sm text-ink/60 mt-1">
                    {b.venue && <>Venue: {b.venue}</>}
                    {b.venue && b.guestCount && " · "}
                    {b.guestCount && <>~{b.guestCount} guests</>}
                  </p>
                )}
                <p className="text-sm text-ink/60 mt-1">Package: {b.package}</p>
                {b.message && (
                  <p className="text-sm text-ink/70 mt-3 leading-relaxed max-w-lg">
                    {b.message}
                  </p>
                )}
              </div>
              <div className="flex md:flex-col items-start gap-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    handleStatusChange(b.id, e.target.value as Booking["status"])
                  }
                  className="field-input !py-2 !px-3 text-sm w-auto"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-ink/40">
                  Received {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "photos" && (
        <div>
          <form
            ref={formRef}
            onSubmit={handleUpload}
            className="border border-ink/10 rounded-sm p-6 mb-10 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
          >
            <div className="sm:col-span-3">
              <label htmlFor="file" className="field-label">
                Photo
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
                className="field-input file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-maroon file:text-paperlight file:text-sm"
              />
            </div>
            <div>
              <label htmlFor="caption" className="field-label">
                Caption (optional)
              </label>
              <input id="caption" name="caption" className="field-input" />
            </div>
            <div>
              <label htmlFor="category" className="field-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue="Wedding"
                className="field-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload photo"}
            </button>
            {uploadError && (
              <p className="sm:col-span-3 text-sm text-maroon-dark bg-maroon/5 border border-maroon/20 rounded-sm px-4 py-3">
                {uploadError}
              </p>
            )}
          </form>

          {images.length === 0 ? (
            <p className="text-ink/60">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-sm overflow-hidden bg-ink/5 group"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || "Uploaded photo"}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-2 right-2 bg-ink/80 text-paperlight text-xs px-2.5 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent text-paperlight text-[11px] px-2 py-1.5">
                    {img.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${
        active
          ? "border-maroon text-ink"
          : "border-transparent text-ink/50 hover:text-ink/80"
      }`}
    >
      {children}
    </button>
  );
}
