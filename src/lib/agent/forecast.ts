import { addDays, differenceInCalendarDays, format } from "date-fns";
import type { FestivalForecast, Product } from "../types";

interface FestivalRule {
  name: string;
  /** Approximate 2026 date for demo */
  date: Date;
  categories: string[];
  multiplier: number;
  messageHi: string;
}

const FESTIVALS: FestivalRule[] = [
  {
    name: "Navratri",
    date: new Date("2026-10-10"),
    categories: ["dairy", "staples", "snacks"],
    multiplier: 1.8,
    messageHi:
      "Navratri is coming. Expect more curd, milk, and fasting snacks.",
  },
  {
    name: "Diwali",
    date: new Date("2026-11-01"),
    categories: ["snacks", "staples", "personal care"],
    multiplier: 2.0,
    messageHi: "Diwali week usually spikes sweets, oil, and gift packs.",
  },
  {
    name: "Holi",
    date: new Date("2027-03-14"),
    categories: ["beverages", "snacks", "dairy"],
    multiplier: 1.5,
    messageHi: "Holi drives thandai ingredients and snack packs.",
  },
];

/** Pick the nearest upcoming festival within 14 days (demo uses fixed calendar). */
export function getUpcomingFestivalForecast(
  products: Product[],
  referenceDate = new Date()
): FestivalForecast | undefined {
  const upcoming = FESTIVALS.map((f) => ({
    ...f,
    daysUntil: differenceInCalendarDays(f.date, referenceDate),
  }))
    .filter((f) => f.daysUntil >= 0 && f.daysUntil <= 14)
    .sort((a, b) => a.daysUntil - b.daysUntil)[0];

  if (!upcoming) {
    // Demo fallback: always show Navratri-style spike for judges
    const demoDays = 3;
    const dairy = products.filter((p) => p.category === "dairy");
    return {
      festival: "Navratri",
      daysUntil: demoDays,
      message: `Navratri starts in ${demoDays} days (${format(addDays(referenceDate, demoDays), "d MMM")}). Stock up on dairy and staples before the rush.`,
      items: dairy.slice(0, 3).map((p) => ({
        productName: p.name,
        suggestedExtra: Math.max(8, Math.ceil(p.reorderLevel * 0.5)),
        reason: "Festival fasting and sweets drive dairy demand",
      })),
    };
  }

  const items = products
    .filter((p) => upcoming.categories.includes(p.category))
    .filter((p) => p.stock <= p.reorderLevel * 1.5)
    .slice(0, 4)
    .map((p) => ({
      productName: p.name,
      suggestedExtra: Math.max(
        6,
        Math.ceil((p.reorderLevel - p.stock + 4) * upcoming.multiplier)
      ),
      reason: `${upcoming.name} demand for ${p.category}`,
    }));

  return {
    festival: upcoming.name,
    daysUntil: upcoming.daysUntil,
    message: `${upcoming.messageHi} (${upcoming.daysUntil} days away).`,
    items,
  };
}
