import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScheduleForm from "@/components/ScheduleForm";
import { Id } from "@/convex/_generated/dataModel";

export default function CreateScheduleScreen() {
   const { id } = useLocalSearchParams();

   return (
      <View className="flex flex-1 p-4">
         <ScheduleForm petId={id as Id<"pets">} />
      </View>
   );
}
