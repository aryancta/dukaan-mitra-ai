import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[100px] w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-teal-950 placeholder:text-teal-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
