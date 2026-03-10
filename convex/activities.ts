import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { getCurrentTimeInGMT6 } from "./utils/time";
import { api } from "./_generated/api";

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

// Logs wrong RFID detected and sends push notification
export const WrongRFIDDetected = action({
   args: { rfid: v.string(), timestamp: v.number() },
   handler: async (ctx, args): Promise<void> => {
      // Find pet by RFID and device state in parallel
      const pet = await ctx.runQuery(api.pets.getPetDetails, { rfid: args.rfid });

      // Log wrong RFID detected
      await ctx.runMutation(api.activities.logPetActivity, {
         rfid: args.rfid,
         activityType: "rfid_scan",
         timestamp: args.timestamp || getCurrentTimeInGMT6()
      });

      // Send push notification
      const device = await ctx.runQuery(api.devices.getDeviceState, { id: "22101040" });
      if (device?.pushToken) {
         const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
               host: "exp.host",
               accept: "application/json",
               "accept-encoding": "gzip, deflate",
               "content-type": "application/json"
            },
            body: JSON.stringify({
               to: device.pushToken,
               sound: "default",
               title: "Pawmigo",
               body: pet?.name
                  ? `${pet?.name} is roaming around`
                  : `Unknown pet detected with RFID: ${args.rfid}`
            })
         });
         return response.json();
      }
   }
});

// Logs a connection activity
export const connection = mutation({
   handler: async (ctx, args) => {
      return await ctx.db.insert("activities", {
         activityType: "connection",
         description: "Device connected to the network.",
         timestamp: Date.now()
      });
   }
});

// Logs a low food level activity
export const lowFoodLevel = mutation({
   handler: async (ctx, args) => {
      return await ctx.db.insert("activities", {
         activityType: "low_food_level",
         description: "Please refill food.",
         timestamp: Date.now()
      });
   }
});

// Logs skipped feeding activity
export const skippedFeeding = mutation({
   args: { rfid: v.string() },
   handler: async (ctx, args) => {
      // Find pet by RFID
      const pet = await ctx.db
         .query("pets")
         .withIndex("by_rfid", (q) => q.eq("rfid", args.rfid))
         .unique();

      return await ctx.db.insert("activities", {
         activityType: "skip_feeding",
         description: `${pet?.name} skipped its scheduled feed.`,
         timestamp: Date.now(),
         petId: pet?._id
      });
   }
});

// Get actionable rfid scan activities with pet details
export const getActionableRFIDScanActivities = query({
   args: {},
   handler: async (ctx) => {
      const fiveMinutesAgo = getCurrentTimeInGMT6() - 5 * 60 * 1000;

      return await ctx.db
         .query("activities")
         .withIndex("by_activityType", (q) => q.eq("activityType", "rfid_scan"))
         .filter((q) =>
            q.and(q.gt(q.field("timestamp"), fiveMinutesAgo), q.neq(q.field("isRead"), true))
         )
         .order("desc")
         .collect();
   }
});

// Mark the activity log as read
export const markTheActivityLogAsRead = mutation({
   args: { id: v.id("activities") },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, { isRead: true });
   }
});

// Delete all activities logs
export const clear = mutation({
   handler: async (ctx) => {
      const activities = await ctx.db.query("activities").collect();
      if (activities.length > 0) {
         await Promise.all(activities.map((activity) => ctx.db.delete(activity._id)));
      }
   }
});
