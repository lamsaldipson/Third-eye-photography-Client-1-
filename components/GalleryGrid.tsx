import Image from "next/image";
import type { GalleryImage } from "@/types";
import WisdomEyeMark from "./WisdomEyeMark";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="border border-dashed border-ink/20 rounded-sm py-20 px-8 text-center">
        <WisdomEyeMark className="w-10 h-8 text-ink/30 mx-auto mb-4" />
        <p className="text-ink/60 max-w-sm mx-auto">
          No photos yet. Once the studio uploads work from the admin
          dashboard, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {images.map((img, i) => (
        <div
          key={img.id}
          className={`relative overflow-hidden rounded-sm bg-ink/5 ${
            i % 5 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={img.url}
            alt={img.caption || "Photograph by Third Eye Photography"}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
          {img.caption && (
            <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent text-paperlight text-xs px-3 py-2">
              {img.caption}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
