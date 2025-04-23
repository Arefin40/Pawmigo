import React from "react";
import { View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useLocalSearchParams } from "expo-router";
import ScheduleForm from "@/components/ScheduleForm";

function ScheduleDetailsScreen() {
   const { id } = useLocalSearchParams();
   const schedule = useQuery(api.schedules.getSchedule, { id: id as Id<"schedule"> });

   return (
      <View className="flex flex-1 p-4">
         <ScheduleForm schedule={schedule} />
      </View>
   );
}

export default ScheduleDetailsScreen;
