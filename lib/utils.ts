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

// Upload image to Cloudinary
export const uploadToCloudinary = async (base64Img: string) => {
   const data = new FormData();
   data.append("file", `data:image/jpeg;base64,${base64Img}`);
   data.append("upload_preset", "pawmigo");

   const res = await fetch(process.env.EXPO_PUBLIC_CLOUDINARY_API!, {
      method: "POST",
      body: data
   });

   const result = await res.json();
   return result.secure_url as string;
};

// Format time to 12 hour
export const formatTo12Hour = (timestamp: string) => {
   const [hourStr, minuteStr] = timestamp.split(":");
   let hour = parseInt(hourStr, 10);
   const minute = minuteStr;
   const period = hour >= 12 ? "PM" : "AM";

   hour = hour % 12 || 12;

   return `${hour}:${minute} ${period}`;
};

// Format time to 24 hour
export const formatTo24Hour = (timestamp: string) => {
   const [time, modifier] = timestamp.trim().split(" ");
   let [hour, minute] = time.split(":").map(Number);

   if (modifier.toUpperCase() === "PM" && hour !== 12) hour += 12;
   if (modifier.toUpperCase() === "AM" && hour === 12) hour = 0;

   const hourStr = String(hour).padStart(2, "0");
   const minuteStr = String(minute).padStart(2, "0");

   return `${hourStr}:${minuteStr}:00`;
};
