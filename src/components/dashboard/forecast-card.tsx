"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FestivalForecast } from "@/lib/types";

export function ForecastCard({ forecast }: { forecast?: FestivalForecast }) {
  if (!forecast) return null;

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-teal-700" />
          {forecast.festival} in {forecast.daysUntil} days
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-teal-800">
        <p>{forecast.message}</p>
        <ul className="space-y-2">
          {forecast.items.map((item) => (
            <li key={item.productName} className="rounded-lg bg-white/80 px-3 py-2 border border-teal-100">
              <span className="font-medium">{item.productName}</span>
              <span className="text-teal-600"> · +{item.suggestedExtra} units</span>
              <p className="text-xs text-teal-600 mt-0.5">{item.reason}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
