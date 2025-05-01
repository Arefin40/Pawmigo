import React from "react";
import { Bowl } from "@/icons";
import { Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { formatTo12Hour, iconWithClassName } from "@/lib/utils";
import { ScrollView, Pressable, View } from "react-native";

iconWithClassName(Plus);

export default function SchedulesScreen() {
   const { id } = useLocalSearchParams();
   const updateSchedule = useMutation(api.schedules.updateSchedule);
   const schedules = useQuery(api.schedules.getSchedules, { petId: id as Id<"pets"> });

   return (
      <View className="relative flex flex-1 p-4">
         <Text className="font-strong text-2xl text-white mb-6">Schedules</Text>
         <ScrollView showsVerticalScrollIndicator={false} className="flex-1 w-full">
            {schedules?.map((schedule, index) => {
               return (
                  <Pressable
                     key={schedule._id}
                     onPress={() => router.push(`/schedules/details/${schedule._id}`)}
                     className="bg-white/10 backdrop-blur-md p-4 rounded-3xl overflow-hidden mb-4 gap-y-1"
                  >
                     <Text className="font-em text-white/60">{schedule.name || "Meal"}</Text>

                     <View className="flex-row items-center justify-between">
                        <Text className="font-em text-3xl">
                           {formatTo12Hour(schedule.timestamp)}
                        </Text>
                        <Switch
                           checked={schedule.enabled}
                           onCheckedChange={(enabled) =>
                              updateSchedule({ id: schedule._id, enabled })
                           }
                        />
                     </View>

                     <View className="mt-0.5 flex-row items-center justify-between">
                        <Text className="font-em text-sm text-white/60">
                           {schedule.days_of_week.length === 7
                              ? "Everyday"
                              : schedule.days_of_week.join(" ")}
                        </Text>
                        <View className="flex-row items-center gap-x-2">
                           {Array.from({ length: schedule.portion }).map((_, index) => (
                              <Bowl key={index} size={16} fill="#a5a5a5" />
                           ))}
                        </View>
                     </View>
                  </Pressable>
               );
            })}
         </ScrollView>

         <Button
            onPress={() => router.push(`/schedules/${id}/create`)}
            className="absolute bottom-8 right-8 !w-16 !h-16 rounded-full flex-shrink-0 elevation-md"
         >
            <Text className="text-white font-semibold text-3xl font-strong">
               <Plus className="w-6 h-6 text-white flex-shrink-0" />
            </Text>
         </Button>
      </View>
   );
}
