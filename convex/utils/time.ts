// Get current time in GMT+6 timestamp
export const getCurrentTimeInGMT6 = () => {
   const now = new Date();
   // Get UTC timestamp in milliseconds
   const utcMillis = now.getTime();
   // Adjust to GMT+6 and convert to Unix seconds
   const gmt6Unix = Math.floor(utcMillis / 1000);
   return gmt6Unix;
};

// Get formatted current time in GMT+6 timestamp
export const getFormattedCurrentTimeInGMT6 = () => {
   const now = new Date();

   const options = {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
   } as Intl.DateTimeFormatOptions;

   const formatter = new Intl.DateTimeFormat("en-US", options);
   return formatter.format(now);
};

// Convert HH:MM:SS in GMT+6 to timestamp
export const convertHHMMSSToTimestamp = (time: string): number => {
   const [hours, minutes] = time.split(":").map(Number);
   const now = new Date();

   const gmt6OffsetMs = 6 * 60 * 60 * 1000;
   const nowInGMT6 = new Date(now.getTime() + gmt6OffsetMs);
   const gmt6Year = nowInGMT6.getUTCFullYear();
   const gmt6Month = nowInGMT6.getUTCMonth();
   const gmt6Date = nowInGMT6.getUTCDate();

   const utcDateForGmt6 = new Date(Date.UTC(gmt6Year, gmt6Month, gmt6Date, hours - 6, minutes, 0));
   return Math.floor(utcDateForGmt6.getTime() / 1000);
};
