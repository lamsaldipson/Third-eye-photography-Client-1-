import LoginForm from "./LoginForm";

export const metadata = {
  title: "Studio login — Third Eye Photography",
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <p className="text-sm text-maroon mb-4">Studio login</p>
      <h1 className="font-display text-3xl text-ink mb-8">
        Manage bookings & photos
      </h1>
      <LoginForm />
    </section>
  );
}
