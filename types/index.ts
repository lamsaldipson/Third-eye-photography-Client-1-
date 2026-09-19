export type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  category: "Wedding" | "Bride" | "Groom" | "Portrait" | "Behind the scenes";
  uploadedAt: string;
};

export type BookingStatus = "new" | "contacted" | "confirmed" | "declined";

export type Booking = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: "Wedding" | "Engagement" | "Pre-wedding shoot" | "Reception" | "Other";
  eventDate: string;
  venue: string;
  guestCount: string;
  package: "Essential" | "Signature" | "Heirloom" | "Not sure yet";
  message: string;
  status: BookingStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  name: string;
  timeframe: string;
  body: string;
};
