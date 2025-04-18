import React from "react";
import { Text } from "@/components/ui/text";
import { iconWithClassName } from "@/lib/icons";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Clock, Zap, Wifi, WifiOff, AlertTriangle, Rss, Cat } from "lucide-react-native";
import type { Activity, ActivityItemProps, FilterButtonProps } from "@/types/activities";
import { axios, isAxiosError } from "@/hooks/axios";

iconWithClassName(Clock);
iconWithClassName(Zap);
iconWithClassName(Wifi);
iconWithClassName(WifiOff);
iconWithClassName(AlertTriangle);
iconWithClassName(Rss);
iconWithClassName(Cat);

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onPress }) => (
   <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${isActive ? "bg-white/20" : "bg-white/10"}`}
   >
      <Text className="text-white">{label}</Text>
   </TouchableOpacity>
);

const filters = [
   { label: "All", value: "all" },
   { label: "Feeding", value: "feeding" },
   { label: "Errors", value: "errors" }
];

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, icon }) => (
   <View className="flex-row items-center gap-4 px-6 py-4 mb-3 bg-white/10 rounded-3xl">
      {icon}
      <View className="flex-1 gap-y-1">
         <Text className="text-white font-sans">{activity.details}</Text>
         <Text className="text-muted-foreground text-sm font-sans">
            {new Date(activity.timestamp).toLocaleString()}
         </Text>
      </View>
   </View>
);

export default function ActivitiesScreen() {
   const [filter, setFilter] = React.useState<"all" | "feeding" | "errors">("all");
   const [activities, setActivities] = React.useState<Activity[]>([]);

   React.useEffect(() => {
      const fetchActivities = async () => {
         try {
            const { data } = await axios.get("/activities");
            setActivities(data.activities);
         } catch (error) {
            if (isAxiosError(error)) {
               console.error("Failed to fetch activities:", error.response?.data || error.message);
            } else {
               console.error("An unexpected error occurred:", error);
            }
         }
      };
      fetchActivities();
   }, []);

   const filteredActivities = activities.filter((activity) => {
      if (filter === "feeding") {
         return activity.type === "scheduled" || activity.type === "manual";
      }
      if (filter === "errors") {
         return activity.type === "error" || activity.type === "connection";
      }
      return true;
   });

   const getIcon = (type: Activity["type"]) => {
      switch (type) {
         case "scheduled":
            return <Clock size={24} className="text-sky-400" />;
         case "manual":
            return <Zap size={24} className="text-violet-400" />;
         case "scan":
            return <Cat size={24} className="text-green-400" />;
         case "error":
            return <AlertTriangle size={24} className="text-rose-400" />;
         case "connection":
            return <WifiOff size={24} className="text-amber-400" />;
         default:
            return <Rss size={24} className="text-white" />;
      }
   };

   return (
      <View className="flex flex-1 p-4">
         <Text className="font-strong text-2xl text-white mb-6">Activity Log</Text>

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
               <ActivityItem key={activity.id} activity={activity} icon={getIcon(activity.type)} />
            ))}
         </ScrollView>
      </View>
   );
}
