import { promises as fs } from "fs";
import path from "path";
import type { Booking, GalleryImage } from "@/types";

// Datastore for bookings + gallery metadata, with two backends:
//
// 1. Cloudflare KV (used automatically when this app is running on
//    Cloudflare — `opennextjs-cloudflare preview` / `deploy`, where the
//    `DATA_KV` binding from wrangler.jsonc is available). This is what
//    persists in production once deployed to Workers.
// 2. Local JSON files under /data (used for plain `next dev`, or any host
//    with a normal persistent disk — a VPS, Docker, Railway, Render,
//    etc). This keeps local development dependency-free.
//
// Every route in this app only talks to the functions below, so this is
// the only place that needs to know which backend is active.

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function getKv(): Promise<KVNamespace | null> {
  try {
    // Imported dynamically so this file doesn't hard-depend on the
    // Cloudflare adapter's runtime context when running anywhere else
    // (plain `next dev`, or a normal Node.js host).
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    return (ctx?.env as CloudflareEnv | undefined)?.DATA_KV ?? null;
  } catch {
    return null;
  }
}

async function readJsonFile<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

async function readJsonKv<T>(kv: KVNamespace, key: string): Promise<T[]> {
  const raw = await kv.get(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJsonKv<T>(kv: KVNamespace, key: string, data: T[]): Promise<void> {
  await kv.put(key, JSON.stringify(data));
}

async function readCollection<T>(key: "gallery" | "bookings", file: string): Promise<T[]> {
  const kv = await getKv();
  if (kv) return readJsonKv<T>(kv, key);
  return readJsonFile<T>(file);
}

async function writeCollection<T>(
  key: "gallery" | "bookings",
  file: string,
  data: T[]
): Promise<void> {
  const kv = await getKv();
  if (kv) return writeJsonKv(kv, key, data);
  return writeJsonFile(file, data);
}

export async function getGallery(): Promise<GalleryImage[]> {
  const images = await readCollection<GalleryImage>("gallery", GALLERY_FILE);
  return images.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function addGalleryImage(image: GalleryImage): Promise<void> {
  const images = await readCollection<GalleryImage>("gallery", GALLERY_FILE);
  images.push(image);
  await writeCollection("gallery", GALLERY_FILE, images);
}

export async function deleteGalleryImage(id: string): Promise<GalleryImage | null> {
  const images = await readCollection<GalleryImage>("gallery", GALLERY_FILE);
  const target = images.find((img) => img.id === id) ?? null;
  await writeCollection(
    "gallery",
    GALLERY_FILE,
    images.filter((img) => img.id !== id)
  );
  return target;
}

export async function getBookings(): Promise<Booking[]> {
  const bookings = await readCollection<Booking>("bookings", BOOKINGS_FILE);
  return bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addBooking(booking: Booking): Promise<void> {
  const bookings = await readCollection<Booking>("bookings", BOOKINGS_FILE);
  bookings.push(booking);
  await writeCollection("bookings", BOOKINGS_FILE, bookings);
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<void> {
  const bookings = await readCollection<Booking>("bookings", BOOKINGS_FILE);
  const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  await writeCollection("bookings", BOOKINGS_FILE, next);
}
