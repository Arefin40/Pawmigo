import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Add new item to the queue
export const add = mutation({
   args: {
      rfid: v.string(),
      portion: v.number(),
      timestamp: v.optional(v.number()),
      isManual: v.boolean()
   },
   handler: async (ctx, args) => {
      const pet = await ctx.db
         .query("pets")
         .withIndex("by_rfid", (q) => q.eq("rfid", args.rfid))
         .unique();

      if (!pet) throw new Error("Pet not found");

      await ctx.db.insert("queue", {
         rfid: args.rfid,
         portion: args.portion,
         timestamp: args.timestamp || new Date().getTime(),
         isManual: args.isManual,
         isCompleted: false,
         beep: pet.beep
      });
   }
});

// Get today's schedules and add them to the queue
export const scheduleDailyFeedings = mutation({
   handler: async (ctx) => {
      // Clear the queue
      await ctx.runMutation(api.queue.clear);

      // Get today's schedules and add them to the queue
      const todaySchedules = await ctx.runQuery(api.schedules.getTodaySchedules);
      for (const schedule of todaySchedules) {
         await ctx.runMutation(api.queue.add, {
            rfid: schedule.rfid,
            portion: schedule.portion,
            timestamp: convertToTimestamp(schedule.timestamp),
            isManual: false
         });
      }
   }
});

// Get all items in the queue
export const today = query({
   handler: async (ctx) => {
      const queue = await ctx.db.query("queue").order("asc").collect();

      const groupedByRfid = new Map<string, typeof queue>();
      for (const item of queue) {
         if (!groupedByRfid.has(item.rfid)) {
            groupedByRfid.set(item.rfid, []);
         }
         groupedByRfid.get(item.rfid)!.push(item);
      }

      return Array.from(groupedByRfid.entries()).map(([rfid, queues]) => ({
         rfid,
         queues
      }));
   }
});

// Get all incomplete items in the queue
export const getIncompleteQueue = query({
   handler: async (ctx) => {
      const queue = await ctx.db
         .query("queue")
         .filter((q) => q.eq(q.field("isCompleted"), false))
         .collect();

      return queue
         .sort((a, b) => a.timestamp - b.timestamp)
         .map(({ _creationTime, ...rest }) => ({
            ...rest
         }));
   }
});

// get first item in the queue
export const getFirst = query({
   handler: async (ctx) => {
      const queue = await ctx.db
         .query("queue")
         .filter((q) => q.eq(q.field("isCompleted"), false))
         .collect();

      if (queue.length === 0) return null;

      const firstItem = queue.sort((a, b) => a.timestamp - b.timestamp)[0];
      const { _creationTime, ...rest } = firstItem;
      return rest;
   }
});

// Mark an item as completed
export const complete = mutation({
   args: { id: v.id("queue") },
   handler: async (ctx, args) => {
      // Get the queue item
      const item = await ctx.db.get(args.id);
      if (!item) throw new Error("Item not found");

      // Update the item's completion status
      await ctx.db.patch(args.id, { isCompleted: true });

      // Log the pet activity
      await ctx.runMutation(api.activities.logPetActivity, {
         rfid: item.rfid,
         activityType: item.isManual ? "manual_feeding" : "schedule_feeding",
         timestamp: item.timestamp
      });
   }
});

// Clear the queue
export const clear = mutation({
   handler: async (ctx) => {
      const docs = await ctx.db.query("queue").collect();
      if (docs.length > 0) {
         await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)));
      }
   }
});

// Convert HH:MM:SS in GMT+6 to timestamp in milliseconds
export const convertToTimestamp = (time: string) => {
   const [hours, minutes, seconds] = time.split(":");
   const now = new Date();
   // Create date in GMT+6 timezone
   const date = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
   );
   // Convert to UTC by subtracting 6 hours (GMT+6 to UTC)
   date.setHours(date.getHours() - 6);
   return date.getTime();
};
