import "@/global.css";
import React from "react";
import Header from "@/components/Header";
import background from "@/assets/images/BG.png";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sora_700Bold } from "@expo-google-fonts/sora";
import { Mulish_500Medium, Mulish_600SemiBold, Mulish_700Bold } from "@expo-google-fonts/mulish";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
   const [fontsLoaded] = useFonts({
      Mulish_500Medium,
      Mulish_600SemiBold,
      Mulish_700Bold,
      Sora_700Bold
   });

   if (!fontsLoaded) {
      return <Text>Loading fonts...</Text>;
   }

   return (
      <>
         <View className="flex-1 relative bg-transparent">
            <StatusBar style="light" backgroundColor="rgba(255, 255, 255, 0.05)" />
            <SafeAreaView className="relative flex flex-1 bg-transparent">
               <Header />

               <Stack
                  screenOptions={{
                     headerShown: false,
                     contentStyle: { backgroundColor: "transparent" },
                     animation: "slide_from_right"
                  }}
               >
                  <Stack.Screen name="(tabs)" />
               </Stack>
            </SafeAreaView>

            <Image blurRadius={70} source={background} className="absolute w-full h-full -z-50" />
         </View>
         <PortalHost />
      </>
   );
}
