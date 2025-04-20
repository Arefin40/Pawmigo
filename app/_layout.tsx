import "@/global.css";
import React from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { Sora_700Bold } from "@expo-google-fonts/sora";
import { Mulish_500Medium, Mulish_600SemiBold, Mulish_700Bold } from "@expo-google-fonts/mulish";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Initialize Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
   unsavedChangesWarning: false
});

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
   const [fontsLoaded] = useFonts({
      Mulish_500Medium,
      Mulish_600SemiBold,
      Mulish_700Bold,
      Sora_700Bold
   });

   if (!fontsLoaded) return null;

   return (
      <ConvexProvider client={convex}>
         <Slot />
      </ConvexProvider>
   );
}
