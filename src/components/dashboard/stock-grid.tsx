"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types";

interface StockGridProps {
  products: Product[];
  highlightIds?: string[];
}

export function StockGrid({ products, highlightIds = [] }: StockGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const low = p.stock <= p.reorderLevel;
        const highlighted = highlightIds.includes(p._id);
        return (
          <Card
            key={p._id}
            className={`card transition-all ${highlighted ? "ring-2 ring-saffron-500" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant={low ? "danger" : "success"}>
                  {p.stock} {p.unit}
                </Badge>
              </div>
              <p className="text-xs text-teal-600">{p.nameHi} · {p.sku}</p>
            </CardHeader>
            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-teal-100">
                <div
                  className={`h-full transition-all ${low ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{
                    width: `${Math.min(100, (p.stock / (p.reorderLevel * 2)) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-teal-600">
                Reorder at {p.reorderLevel} {p.unit}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
