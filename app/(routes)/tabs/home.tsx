import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Image, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BlurView } from "expo-blur";
import { Cat } from "lucide-react-native";
import { cn, iconWithClassName } from "@/lib/utils";
import { Bowl } from "@/icons";

iconWithClassName(Cat);

export default function HomeScreen() {
   const feeder = useQuery(api.devices.getDeviceState, { id: "22101040" });
   const queueStatus = useQuery(api.queue.getQueueStatus);
   const isOnline = feeder?.connectionStatus === "online";

   return (
      <ScrollView showsVerticalScrollIndicator={false}>
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
            {/* <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
               <Text className="text-white/60 font-sans mb-2">Next Feeding</Text>
               <Text className="text-3xl text-white font-strong">{nextFeed}</Text>
            </BlurView> */}

            {/* Last Fed */}
            <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
               <Text className="text-white/60 font-sans mb-2">Last Fed</Text>
               <View className="flex flex-row items-center justify-between gap-6">
                  <Text
                     className={cn("font-strong", {
                        "text-2xl text-white": feeder?.lastFeed?.time,
                        "text-lg text-muted-foreground": !feeder?.lastFeed?.time
                     })}
                  >
                     {feeder?.lastFeed?.time ? feeder?.lastFeed?.time : "Not used yet"}
                  </Text>

                  <View className="flex flex-row items-center justify-end gap-2">
                     {Array.from({ length: feeder?.lastFeed?.portion || 0 }).map((_, index) => (
                        <Bowl key={index} size={20} fill="#8d9187" />
                     ))}
                  </View>
               </View>
            </BlurView>

            {/* Queue Status */}
            <BlurView intensity={30} className="rounded-3xl p-6 overflow-hidden">
               <Text className="text-white/60 font-sans mb-2">Queue Status</Text>
               <View className="mt-2 flex items-start gap-y-2 gap-x-4">
                  {queueStatus?.map(({ rfid, image, feeds }) => (
                     <View key={rfid} className="flex-row flex-1 items-center gap-4">
                        <Image source={{ uri: image }} className="w-10 h-10 rounded-full" />
                        <View className="flex-1 flex-wrap flex-row gap-4">
                           {feeds.map((feed) => (
                              <View
                                 key={feed.id}
                                 className={cn("w-5 h-5 bg-white/30 rounded-full", {
                                    "bg-emerald-600": !feed.isManual && feed.isCompleted,
                                    "bg-emerald-200": feed.isManual && feed.isCompleted
                                 })}
                              />
                           ))}
                        </View>
                     </View>
                  ))}
               </View>
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
      </ScrollView>
   );
}
