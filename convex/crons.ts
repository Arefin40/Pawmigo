import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
   "Schedule Daily Feedings",
   {
      hourUTC: 16,
      minuteUTC: 30
   },
   api.queue.scheduleDailyFeedings,
   {}
);

export default crons;
