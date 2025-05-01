import { Id } from "./_generated/dataModel";

export interface Activity {
   _id: Id<"activities">;
   _creationTime: number;
   petId?: Id<"pets"> | undefined;
   timestamp: number;
   activityType:
      | "connection"
      | "schedule_feeding"
      | "manual_feeding"
      | "skip_feeding"
      | "error"
      | "rfid_scan"
      | "low_food_level";
   description: string;
}

export interface FilterButtonProps {
   label: string;
   isActive: boolean;
   onPress: () => void;
}

export interface ActivityItemProps {
   activity: Activity;
   icon: React.ReactNode;
}
