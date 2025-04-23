import React from "react";
import { Bowl } from "@/icons";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Pressable, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { cn, formatTo12Hour, formatTo24Hour } from "@/lib/utils";
import type { DayOfWeek, ScheduleData, ScheduleFormProps } from "@/types/schedule";

const DAYS_OF_WEEK: DayOfWeek[] = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
const DEFAULT_SCHEDULE: ScheduleData = {
   name: "Meal",
   timestamp: "08:00:00",
   portion: 1,
   days_of_week: []
};

function ScheduleForm({ petId, schedule }: ScheduleFormProps) {
   const updateSchedule = useMutation(api.schedules.updateSchedule);
   const createSchedule = useMutation(api.schedules.createSchedule);
   const deleteSchedule = useMutation(api.schedules.deleteSchedule);

   const [time, setTime] = React.useState({ hour: "8", minute: "00", period: "AM" });
   const [feedData, setFeedData] = React.useState<ScheduleData>(DEFAULT_SCHEDULE);

   React.useEffect(() => {
      if (schedule) {
         setFeedData({
            name: schedule.name || DEFAULT_SCHEDULE.name,
            timestamp: schedule.timestamp,
            portion: schedule.portion,
            days_of_week: schedule.days_of_week
         });

         const [timeStr, period] = formatTo12Hour(schedule.timestamp).split(" ");
         const [hour, minute] = timeStr.split(":");
         setTime({ hour, minute, period });
      }
   }, [schedule]);

   const validateForm = () => {
      if (!feedData.name.trim()) {
         alert("Please provide a name for the schedule");
         return false;
      }
      if (feedData.days_of_week.length === 0) {
         alert("Please select at least one day for the schedule");
         return false;
      }
      return true;
   };

   const handleDayPress = (day: DayOfWeek) => {
      setFeedData((prev) => ({
         ...prev,
         days_of_week: prev.days_of_week.includes(day)
            ? prev.days_of_week.filter((d) => d !== day)
            : [...prev.days_of_week, day]
      }));
   };

   const handlePortionChange = (portion: number) => {
      setFeedData((prev) => ({ ...prev, portion }));
   };

   const handlePeriodChange = (period: string) => {
      setTime((prev) => ({ ...prev, period }));
      const formattedTime = formatTo24Hour(`${time.hour}:${time.minute} ${period}`);
      setFeedData((prev) => ({ ...prev, timestamp: formattedTime }));
   };

   const validateTime = (time: { hour: string; minute: string; period: string }) => {
      const hour = Math.max(1, Math.min(12, parseInt(time.hour) || 12)).toString();
      const minute = Math.max(0, Math.min(59, parseInt(time.minute) || 0))
         .toString()
         .padStart(2, "0");
      return { hour, minute, period: time.period };
   };

   const handleSubmitEditing = () => {
      const newTime = validateTime(time);
      setTime(newTime);
      const formattedTime = formatTo24Hour(`${newTime.hour}:${newTime.minute} ${newTime.period}`);
      setFeedData((prev) => ({ ...prev, timestamp: formattedTime }));
   };

   const onSave = React.useCallback(async () => {
      if (!validateForm()) return;

      if (schedule) {
         await updateSchedule({
            id: schedule._id,
            ...feedData
         });
      } else {
         // Create schedule logic here
         await createSchedule({
            petId: petId as Id<"pets">,
            ...feedData
         });
      }

      router.back();
   }, [feedData, schedule, updateSchedule]);

   const onDelete = React.useCallback(async () => {
      if (schedule) {
         await deleteSchedule({ id: schedule._id });
      }

      router.back();
   }, [schedule]);

   return (
      <View className="flex-1 gap-y-12">
         <View className="gap-y-1">
            <Text className="mb-2 text-lg font-sans text-muted-foreground">Feeding Time</Text>
            <View className="flex flex-row items-center justify-center">
               <View className="flex flex-row items-center px-6 rounded-full bg-white/10 py-4">
                  <View className="w-24 relative">
                     <Input
                        value={time.hour}
                        onChangeText={(text) => setTime({ ...time, hour: text })}
                        onSubmitEditing={handleSubmitEditing}
                        onEndEditing={handleSubmitEditing}
                        keyboardType="numeric"
                        maxLength={2}
                        className="absolute inset-x-0 top-1.5 -translate-y-1/2 bg-transparent border-0 text-white text-4xl text-center leading-none h-32 native:h-32 native:text-6xl tabular-nums"
                     />
                  </View>
                  <Text className="text-white/50 text-6xl pb-3">:</Text>
                  <View className="w-24 relative">
                     <Input
                        value={time.minute}
                        onChangeText={(text) => setTime({ ...time, minute: text })}
                        onSubmitEditing={handleSubmitEditing}
                        onEndEditing={handleSubmitEditing}
                        keyboardType="numeric"
                        maxLength={2}
                        className="absolute inset-x-0 top-1.5 -translate-y-1/2 bg-transparent border-0 text-white text-4xl text-center leading-none h-32 native:h-32 native:text-6xl tabular-nums"
                     />
                  </View>

                  <View className="flex-row items-center gap-1 ml-3">
                     {["AM", "PM"].map((period) => (
                        <Pressable
                           key={period}
                           className={cn(
                              "text-3xl bg-white/5 rounded-full flex items-center justify-center p-4 transition-colors",
                              time.period === period && "bg-white/20"
                           )}
                           onPress={() => handlePeriodChange(period)}
                        >
                           <Text className="text-white font-em">{period}</Text>
                        </Pressable>
                     ))}
                  </View>
               </View>
            </View>
         </View>

         {/* Repeat Feeding */}
         <View className="gap-y-1">
            <Text className="mb-2 text-lg font-sans text-muted-foreground">Repeat Feeding</Text>
            <View className="px-3 flex flex-row items-center justify-between bg-white/10 rounded-full py-3 gap-2">
               {DAYS_OF_WEEK.map((day) => (
                  <Pressable
                     key={day}
                     onPress={() => handleDayPress(day)}
                     className={cn(
                        "flex-1 aspect-square rounded-full bg-white/5 items-center justify-center",
                        feedData.days_of_week.includes(day) && "bg-primary"
                     )}
                  >
                     <Text className="text-white font-em text-sm">{day}</Text>
                  </Pressable>
               ))}
            </View>
         </View>

         {/* Name */}
         <View className="gap-y-2">
            <Text className="text-lg font-sans text-muted-foreground">Name</Text>
            <Input
               value={feedData.name}
               placeholder="Enter name"
               placeholderTextColor="#8d9187"
               onChangeText={(text) => setFeedData({ ...feedData, name: text })}
               className="bg-white/10 border-0 rounded-2xl py-3 px-4 text-white native:h-16"
            />
         </View>

         {/* Portion */}
         <View className="gap-y-2">
            <Text className="text-lg font-sans text-muted-foreground">Portion</Text>
            <View className="flex flex-row items-center justify-center gap-x-4">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Pressable key={index} onPress={() => handlePortionChange(index + 1)}>
                     <Bowl size={40} fill={index < feedData.portion ? "#f5f5f5" : "#656565"} />
                  </Pressable>
               ))}
            </View>
         </View>

         <View className="flex gap-y-4 items-center">
            {/* Save */}
            <Button className="w-4/5 rounded-full py-5 text-white native:h-16" onPress={onSave}>
               <Text className="text-white font-sans !text-xl">Save</Text>
            </Button>

            {/* Delete */}
            {schedule && (
               <Button
                  variant="outline"
                  className="w-4/5 rounded-full py-5 border-rose-950 bg-rose-500/30 native:h-16"
                  onPress={onDelete}
               >
                  <Text className="text-rose-500 font-sans !text-xl">Delete</Text>
               </Button>
            )}
         </View>
      </View>
   );
}

export default ScheduleForm;
