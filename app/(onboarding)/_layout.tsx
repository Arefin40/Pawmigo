import React from "react";
import Storage from "@/lib/storage";
import { Stack } from "expo-router";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
   const [showOnboarding, setShowOnboarding] = React.useState<boolean | null>(null);
   React.useEffect(() => {
      async function checkIfAlreadyOnboarded() {
         const onboarded = await Storage.get("onboarded");
         setShowOnboarding(onboarded === true ? false : true);
         if (onboarded === true) router.push("/(routes)/tabs/home");
      }
      checkIfAlreadyOnboarded();
   }, []);

   if (showOnboarding === null) return null;

   return (
      <View className="flex-1 relative">
         <SafeAreaView className="relative flex flex-1">
            <Stack
               screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                  animation: "slide_from_right"
               }}
            >
               <Stack.Screen name="index" />
               <Stack.Screen name="(routes)" />
            </Stack>
         </SafeAreaView>
      </View>
   );
}
