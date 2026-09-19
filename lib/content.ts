import type { Review } from "@/types";

export const studio = {
  name: "Third Eye Photography",
  tagline: "Wedding photography in Kathmandu",
  rating: 5.0,
  reviewCount: 16,
  phone: "986-2668927",
  phoneHref: "tel:+9779862668927",
  website: "third-eye-photography.web.app",
  address: "M8RP+99M, Kathmandu, Bagmati Province 44600",
  mapsUrl:
    "https://www.google.com/maps/place/Third+eye+photography/@27.6937589,85.3344402,16.5z/data=!4m6!3m5!1s0x39eb19004ac29797:0xd33bcb0072fd9507!8m2!3d27.6941603!4d85.3352535!16s%2Fg%2F11vk93mncc!18m1!1e1",
  hours: [
    { day: "Sunday", time: "9 AM – 7 PM" },
    { day: "Monday", time: "9 AM – 7 PM" },
    { day: "Tuesday", time: "9 AM – 7 PM" },
    { day: "Wednesday", time: "9 AM – 7 PM" },
    { day: "Thursday", time: "9 AM – 7 PM" },
    { day: "Friday", time: "9 AM – 7 PM" },
    { day: "Saturday", time: "Closed" },
  ],
  lgbtqFriendly: true,
};

export const reviews: Review[] = [
  {
    id: "rohan-neupane",
    name: "Rohan Neupane",
    timeframe: "7 months ago",
    body: "The photos are absolutely stunning — full of light, emotion, and authenticity. Looking through the gallery felt like reliving the entire day all over again. Family and friends haven't stopped complimenting the pictures.",
  },
  {
    id: "jenisha-timalsina",
    name: "Jenisha Timalsina",
    timeframe: "6 months ago",
    body: "I honestly don't have enough words to express how happy I am with Third Eye Photography. The photos and videos truly touched my heart. Every picture feels alive and full of emotion — they captured not just moments, but feelings that we will treasure forever.",
  },
  {
    id: "asmita-sigdel",
    name: "Asmita Sigdel",
    timeframe: "7 months ago",
    body: "We are beyond happy with the experience and the final photos. From start to finish, everything was handled with such professionalism and care. The photographer made us feel completely comfortable, which made every shot look natural and full of genuine emotion. The photo album and frame are beautiful.",
  },
];

export const packages = [
  {
    id: "essential",
    name: "Essential",
    subtitle: "One day, one photographer",
    description:
      "Full coverage of your ceremony with a same-week preview and a curated online gallery.",
  },
  {
    id: "signature",
    name: "Signature",
    subtitle: "Two days, second shooter, film",
    description:
      "Covers your reception and ceremony, adds a second photographer and a short highlight film.",
  },
  {
    id: "heirloom",
    name: "Heirloom",
    subtitle: "Full event, album, and frame",
    description:
      "Everything in Signature, plus a hand-bound album and a framed print chosen from your gallery.",
  },
] as const;
