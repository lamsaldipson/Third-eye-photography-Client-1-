import { getBookings, getGallery } from "@/lib/data";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Dashboard — Third Eye Photography",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [images, bookings] = await Promise.all([getGallery(), getBookings()]);

  return (
    <section className="mx-auto max-w-6xl px-6 md:px-10 py-12">
      <AdminDashboard initialImages={images} initialBookings={bookings} />
    </section>
  );
}
