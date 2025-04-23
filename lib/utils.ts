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

