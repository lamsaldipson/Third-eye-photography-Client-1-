import GalleryGrid from "@/components/GalleryGrid";
import { getGallery } from "@/lib/data";

export const metadata = {
  title: "Gallery — Third Eye Photography",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <section className="mx-auto max-w-6xl px-6 md:px-10 py-16">
      <p className="text-sm text-maroon mb-4">Gallery</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-10 max-w-lg">
        Weddings we've had the honor of shooting.
      </h1>
      <GalleryGrid images={images} />
    </section>
  );
}
