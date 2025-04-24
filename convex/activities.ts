import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get all activities from the database
 */
export const getActivities = query({
   args: {},
   handler: async (ctx, args) => {
      return await ctx.db.query("activities").order("desc").collect();
   }
});

/**
 * Logs pet-related activities including:
 * - RFID scans
 * - Scheduled feedings
 * - Manual feedings
 */
export const logPetActivity = mutation({
   args: {
      rfid: v.string(),
      timestamp: v.number(),
      activityType: v.union(
         v.literal("rfid_scan"),
         v.literal("schedule_feeding"),
         v.literal("manual_feeding"),
         v.literal("skip_feeding")
      )
   },
   handler: async (ctx, args) => {
      // Find pet by RFID
      const pet = await ctx.db
         .query("pets")
         .withIndex("by_rfid", (q) => q.eq("rfid", args.rfid))
         .unique();

      // Create description with pet name if found
      let description = "";
      if (args.activityType === "rfid_scan") {
         description = pet ? `${pet.name} just scanned in.` : `RFID ${args.rfid} scanned in.`;
      } else if (args.activityType === "schedule_feeding") {
         description = `${pet?.name} gets its scheduled feed.`;
      } else if (args.activityType === "manual_feeding") {
         description = `${pet?.name} was fed manually.`;
      } else if (args.activityType === "skip_feeding") {
         description = `${pet?.name} skipped its scheduled feed.`;
      }

      return await ctx.db.insert("activities", {
         petId: pet?._id,
         description,
         activityType: args.activityType,
         timestamp: args.timestamp
      });
   }
});

/**
 * Logs device-related activities including:
 * - Connection
 * - Error
 * - Manual feeding
 */
export const logDeviceActivity = mutation({
   args: {
      timestamp: v.number(),
      activityType: v.union(
         v.literal("connection"),
         v.literal("low_food_level"),
         v.literal("error")
      )
   },
   handler: async (ctx, args) => {
      let description = "";
      if (args.activityType === "connection") {
         description = "Device connected to the network.";
      } else if (args.activityType === "low_food_level") {
         description = "Please refill food.";
      } else if (args.activityType === "error") {
         description = "Device encountered an error.";
      }

      return await ctx.db.insert("activities", {
         activityType: args.activityType,
         description,
         timestamp: args.timestamp
      });
   }
});
