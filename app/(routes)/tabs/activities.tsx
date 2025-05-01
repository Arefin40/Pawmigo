import React from "react";
import { useQuery } from "convex/react";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { iconWithClassName } from "@/lib/utils";
import { View, ScrollView, TouchableOpacity } from "react-native";
import type { Activity, ActivityItemProps, FilterButtonProps } from "@/types/activities";
import { Clock, Zap, Wifi, AlertTriangle, Rss, Cat } from "lucide-react-native";
import LoadingState from "@/components/LoadingState";

iconWithClassName(Clock);
iconWithClassName(Zap);
iconWithClassName(Wifi);
iconWithClassName(AlertTriangle);
iconWithClassName(Rss);
iconWithClassName(Cat);

const filters = [
   { label: "All", value: "all" },
   { label: "Pet Activity", value: "pet" },
   { label: "Device Logs", value: "device" }
];

export default function ActivitiesScreen() {
   const [filter, setFilter] = React.useState<"all" | "pet" | "device">("all");
   const activities = useQuery(api.activities.getActivities);
   if (activities === undefined) return <LoadingState />;

   const filteredActivities = activities.filter((activity) => {
      if (filter === "pet") {
         return (
            activity.activityType === "schedule_feeding" ||
            activity.activityType === "manual_feeding" ||
            activity.activityType === "skip_feeding" ||
            activity.activityType === "rfid_scan"
         );
      } else if (filter === "device") {
         return (
            activity.activityType === "error" ||
            activity.activityType === "connection" ||
            activity.activityType === "low_food_level"
         );
      }
      return true;
   });

   return (
      <View className="flex flex-1 p-4">
         <Text className="font-strong text-2xl text-white mb-6">Activities</Text>

         <View className="flex-row gap-2 mb-4">
            {filters.map(({ label, value }) => (
               <FilterButton
                  key={value}
                  label={label}
                  isActive={filter === value}
                  onPress={() => setFilter(value as typeof filter)}
               />
            ))}
         </View>

         <ScrollView className="flex-1">
            {filteredActivities.map((activity) => (
               <ActivityItem
                  key={activity._id}
                  activity={activity}
                  icon={getActivityIcon(activity.activityType)}
               />
            ))}
         </ScrollView>
      </View>
   );
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onPress }) => (
   <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${isActive ? "bg-white/20" : "bg-white/10"}`}
   >
      <Text className="text-white">{label}</Text>
   </TouchableOpacity>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, icon }) => (
   <View className="flex-row items-center gap-4 px-6 py-4 mb-3 bg-white/10 rounded-3xl">
      {icon}
      <View className="flex-1 gap-y-1">
         <Text className="text-white font-sans">{activity.description}</Text>
         <Text className="text-muted-foreground text-sm font-sans">
            {new Date(activity.timestamp).toLocaleString()}
         </Text>
      </View>
   </View>
);

const getActivityIcon = (type: Activity["activityType"]) => {
   switch (type) {
      case "schedule_feeding":
         return <Clock size={24} className="text-sky-400" />;
      case "manual_feeding":
         return <Zap size={24} className="text-violet-400" />;
      case "rfid_scan":
         return <Cat size={24} className="text-green-400" />;
      case "error":
         return <AlertTriangle size={24} className="text-rose-400" />;
      case "connection":
         return <Wifi size={24} className="text-green-400" />;
      default:
         return <Rss size={24} className="text-white" />;
   }
};
