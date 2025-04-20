import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";

// Merge class names
export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

// Interop class names with Lucide icons
export function iconWithClassName(icon: LucideIcon) {
   cssInterop(icon, {
      className: {
         target: "style",
         nativeStyleToProp: {
            color: true,
            opacity: true
         }
      }
   });
}
