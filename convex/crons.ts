import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
   "Schedule Daily Feedings",
   {
      hourUTC: 18,
      minuteUTC: 5
   },
   api.queue.scheduleDailyFeedings,
   {}
);

export default crons;
