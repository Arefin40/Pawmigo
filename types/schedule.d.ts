import { Id } from "@/convex/_generated/dataModel";

export type onChangeFn = (time: string) => void;

export type TimeInputProps = { onChange: onChangeFn; value?: string };

export interface Schedule {
   _id: Id<"schedule">;
   _creationTime: number;
   name?: string | undefined;
   petId: Id<"pets">;
   timestamp: string;
   portion: number;
   days_of_week: DayOfWeek[];
   enabled: boolean;
}

export interface ScheduleData {
   name: string;
   timestamp: string;
   portion: number;
   days_of_week: DayOfWeek[];
}

export interface ScheduleFormProps {
   petId?: Id<"pets">;
   schedule?: Schedule | null;
}

export type DayOfWeek = "SAT" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI";
