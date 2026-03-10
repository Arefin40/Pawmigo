import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { convertHHMMSSToTimestamp, getCurrentTimeInGMT6 } from "./utils/time";

// Add new item to the queue
export const add = mutation({
   args: {
      rfid: v.string(),
      portion: v.number(),
      timestamp: v.optional(v.number()),
      isManual: v.boolean(),
      scheduleId: v.optional(v.string())
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
         timestamp: args.timestamp || getCurrentTimeInGMT6(),
         isManual: args.isManual,
         isCompleted: false,
         beep: pet.beep,
         scheduleId: args.scheduleId
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
            timestamp: convertHHMMSSToTimestamp(schedule.timestamp),
            isManual: false,
            scheduleId: schedule.id
         });
      }
   }
});

export const syncQueueWithSchedule = mutation({
   handler: async (ctx) => {
      // Clear the incomplete queues
      await ctx.runMutation(api.queue.clearIncompleteQueues);

      // Get today's schedules and add them to the queue
      const todaySchedules = await ctx.runQuery(api.schedules.getTodaySchedules);
      const completedScheduleIds = await ctx.runQuery(api.queue.getCompletedQueueIds);

      for (const schedule of todaySchedules) {
         if (!completedScheduleIds.includes(schedule.id)) {
            await ctx.runMutation(api.queue.add, {
               rfid: schedule.rfid,
               portion: schedule.portion,
               timestamp: convertHHMMSSToTimestamp(schedule.timestamp),
               isManual: false,
               scheduleId: schedule.id
            });
         }
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

// Get all completed queue's schedule ids
export const getCompletedQueueIds = query({
   handler: async (ctx) => {
      const completedQueues = await ctx.db
         .query("queue")
         .filter((q) => q.eq(q.field("isCompleted"), true))
         .collect();

      return completedQueues.reduce<string[]>((acc, current) => {
         if (current.scheduleId) acc.push(current.scheduleId);
         return acc;
      }, []);
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
   args: { id: v.id("queue"), timestamp: v.optional(v.number()) },
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
         timestamp: args.timestamp || getCurrentTimeInGMT6()
      });

      // Update last feed time
      await ctx.runMutation(api.devices.updateLastFeed, {
         portion: item.portion
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

// Clear incomplete queues
export const clearIncompleteQueues = mutation({
   handler: async (ctx) => {
      const incompleteQueues = await ctx.db
         .query("queue")
         .filter((q) => q.eq(q.field("isCompleted"), false))
         .collect();

      if (incompleteQueues.length > 0) {
         await Promise.all(incompleteQueues.map((queue) => ctx.db.delete(queue._id)));
      }
   }
});

// Get queue status grouped by rfid
export const getQueueStatus = query({
   handler: async (ctx) => {
      const [queue, pets] = await Promise.all([
         ctx.db.query("queue").collect(),
         ctx.db.query("pets").collect()
      ]);

      const petImageMap = pets.reduce(
         (acc, pet) => {
            acc[pet.rfid] = pet.image || null;
            return acc;
         },
         {} as Record<string, string | null>
      );

      const status = queue.reduce(
         (acc, { rfid, _id, isManual, isCompleted }) => {
            if (!acc[rfid]) {
               acc[rfid] = { feeds: [], image: petImageMap[rfid] || "" };
            }
            acc[rfid].feeds.push({ id: _id, isManual, isCompleted });
            return acc;
         },
         {} as Record<
            string,
            {
               feeds: { id: Id<"queue">; isManual: boolean; isCompleted: boolean }[];
               image: string;
            }
         >
      );

      // Convert to array format
      return Object.entries(status).map(([rfid, { feeds, image }]) => ({
         rfid,
         image,
         feeds
      }));
   }
});

// Schedule a manual feeding
export const scheduleManualFeeding = mutation({
   args: { id: v.id("activities"), petId: v.id("pets") },
   handler: async (ctx, args) => {
      // Mark the activity log as read
      await ctx.runMutation(api.activities.markTheActivityLogAsRead, { id: args.id });

      // Add a manual feeding in queue
      const pet = await ctx.db.get(args.petId);
      if (!pet) throw new Error("Pet not found");
      await ctx.runMutation(api.queue.add, {
         rfid: pet.rfid,
         portion: 1,
         timestamp: getCurrentTimeInGMT6(),
         isManual: true
      });
   }
});
