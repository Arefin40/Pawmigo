import React from "react";
import Header from "@/components/Header";
import background from "@/assets/images/BG.png";
import { Stack } from "expo-router";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
   return (
      <>
         <View className="flex-1 relative">
            <StatusBar style="light" backgroundColor="rgba(255, 255, 255, 0.05)" />
            <SafeAreaView className="relative flex flex-1">
               <Header />

               <Stack
                  screenOptions={{
                     headerShown: false,
                     contentStyle: { backgroundColor: "transparent" },
                     animation: "slide_from_right"
                  }}
               >
                  <Stack.Screen name="tabs" />
               </Stack>
            </SafeAreaView>

            <Image blurRadius={70} source={background} className="absolute w-full h-full -z-50" />
         </View>
         <PortalHost />
      </>
   );
}
