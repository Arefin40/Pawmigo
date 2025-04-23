import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BlurView } from "expo-blur";
import { Cat } from "lucide-react-native";
import { iconWithClassName } from "@/lib/utils";

iconWithClassName(Cat);

export default function HomeScreen() {
   const feeder = useQuery(api.devices.getDeviceByDeviceId, { deviceId: "22101040" });
   const nextFeed = "8:00 PM";
   const lastFed = "7:00 AM (50g)";
   const isOnline = feeder?.status === "online";

   return (
      <View className="flex flex-1 p-6 gap-y-4 bg-transparent">
         {/* Status Header */}
         <BlurView
            intensity={30}
            className="flex-row items-center justify-between p-4 rounded-2xl overflow-hidden"
         >
            <View className="flex gap-y-0.5">
               <Text className="text-white font-sans text-base">Device Status</Text>
               <Text className="text-white/60 font-sans text-sm">
                  {isOnline ? "Connected" : "Disconnected"}
               </Text>
            </View>

            <View className="w-7 h-7 bg-white/10 rounded-full items-center justify-center">
               <View
                  className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-rose-500"}`}
               />
            </View>
         </BlurView>

         {/* Next Feeding */}
         <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
            <Text className="text-white/60 font-sans mb-2">Next Feeding</Text>
            <Text className="text-3xl text-white font-strong">{nextFeed}</Text>
         </BlurView>

         {/* Last Fed */}
         <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
            <Text className="text-white/60 font-sans mb-2">Last Fed</Text>
            <Text className="text-2xl text-white font-strong">{lastFed}</Text>
         </BlurView>

         {/* Food Level */}
         <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
            <Text className="text-white/60 font-sans mb-4">Food Level</Text>
            <Progress value={feeder?.foodLevel ?? 0} className="h-3 bg-white/20" />
            <Text className="text-white/60 font-sans mt-2">
               {feeder?.foodLevel ?? 0}% remaining
            </Text>
         </BlurView>

         <View className="mt-6 py-3 bg-white/5 rounded-lg flex items-center justify-center">
            <Text className="text-white font-em">Manual Feed</Text>
         </View>

         {/* Pet at Feeder Alert */}
         <BlurView
            intensity={30}
            className="p-4 rounded-3xl flex-row items-center gap-4 overflow-hidden"
         >
            <View className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
               <Cat size={24} className="text-sky-500" />
            </View>

            <View className="flex-1 gap-y-1">
               <Text className="font-sans text-white">Luna is at the feeder</Text>
               <Text className="font-sans text-muted-foreground">Waiting for approval</Text>
            </View>

            <Button className="px-4 py-2 rounded-full">
               <Text className="text-white font-em">View</Text>
            </Button>
         </BlurView>
      </View>
   );
}
