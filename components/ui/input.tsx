import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#374151] outline-none transition-all duration-200 ease-out placeholder:text-[#9CA3AF] hover:border-[#CBD5E1] focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-[#F9FAFB]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
