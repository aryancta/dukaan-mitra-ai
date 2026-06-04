import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-teal-950 placeholder:text-teal-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
