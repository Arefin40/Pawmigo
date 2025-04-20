import React from "react";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { View, ScrollView } from "react-native";
import Storage from "@/lib/storage";

export default function SettingsScreen() {
   const resetApp = async () => {
      await Storage.store("onboarded", false);
      router.push("/(onboarding)");
   };

   return (
      <ScrollView className="flex-1">
         <View className="flex-1 p-4">
            <Text className="font-strong text-2xl text-white mb-6">Settings</Text>

            <View className="space-y-4">
               <BlurView intensity={20} className="overflow-hidden rounded-2xl">
                  <View className="flex flex-row justify-between items-center p-5">
                     <Text className="text-white text-base font-sans">Onboarding</Text>
                     <Button
                        onPress={resetApp}
                        className="elevation-none border-none outline-none rounded-full font-em"
                     >
                        <Text>Reset</Text>
                     </Button>
                  </View>
               </BlurView>
            </View>
         </View>
      </ScrollView>
   );
}
