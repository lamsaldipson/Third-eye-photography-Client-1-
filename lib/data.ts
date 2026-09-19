import { promises as fs } from "fs";
import path from "path";
import type { Booking, GalleryImage } from "@/types";

// Simple file-backed datastore.
//
// This keeps the demo fully working with zero external services: bookings
// and gallery metadata live in /data/*.json, and uploaded photos land in
// /public/uploads. That's perfect for running locally or on a host with a
// persistent disk (a VPS, Docker, Railway, Render, etc).
//
// It will NOT persist on serverless platforms with a read-only filesystem
// (e.g. a default Vercel deployment) because writes disappear when the
// function instance recycles. If you deploy there, swap the functions in
// this file for calls to a real database (Postgres, Supabase, PlanetScale)
// or an object store (S3, Cloudinary) for the uploads — every route in
// this app only talks to the functions below, so that's a localized swap.

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getGallery(): Promise<GalleryImage[]> {
  const images = await readJson<GalleryImage>(GALLERY_FILE);
  return images.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function addGalleryImage(image: GalleryImage): Promise<void> {
  const images = await readJson<GalleryImage>(GALLERY_FILE);
  images.push(image);
  await writeJson(GALLERY_FILE, images);
}

export async function deleteGalleryImage(id: string): Promise<GalleryImage | null> {
  const images = await readJson<GalleryImage>(GALLERY_FILE);
  const target = images.find((img) => img.id === id) ?? null;
  await writeJson(
    GALLERY_FILE,
    images.filter((img) => img.id !== id)
  );
  return target;
}

export async function getBookings(): Promise<Booking[]> {
  const bookings = await readJson<Booking>(BOOKINGS_FILE);
  return bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addBooking(booking: Booking): Promise<void> {
  const bookings = await readJson<Booking>(BOOKINGS_FILE);
  bookings.push(booking);
  await writeJson(BOOKINGS_FILE, bookings);
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<void> {
  const bookings = await readJson<Booking>(BOOKINGS_FILE);
  const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  await writeJson(BOOKINGS_FILE, next);
}
