import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a device to the database
export const addDevice = mutation({
   args: {
      deviceId: v.string(),
      secret: v.string()
   },
   handler: async (ctx, args) => {
      const deviceId = await ctx.db.insert("devices", {
         deviceId: args.deviceId,
         secret: args.secret
      });
      await ctx.db.insert("deviceState", {
         deviceId: args.deviceId,
         foodLevel: 0,
         connectionStatus: "offline"
      });
      return deviceId;
   }
});

// Get all devices from the database
export const getDevices = query({
   handler: async (ctx) => {
      return await ctx.db.query("devices").collect();
   }
});

// Get a device by deviceId
export const getDeviceById = query({
   args: {
      id: v.id("devices")
   },
   handler: async (ctx, args) => {
      const device = await ctx.db.get(args.id);
      return device;
   }
});

// Get a device by deviceId
export const getDeviceByDeviceId = query({
   args: {
      deviceId: v.string()
   },
   handler: async (ctx, args) => {
      const device = await ctx.db
         .query("devices")
         .filter((q) => q.eq(q.field("deviceId"), args.deviceId))
         .first();
      return device;
   }
});

// Get device state
export const getDeviceState = query({
   args: { id: v.string() },
   handler: async (ctx, args) => {
      const result = await ctx.db
         .query("deviceState")
         .filter((q) => q.eq(q.field("deviceId"), args.id))
         .first();
      return result;
   }
});

// Register a device
export const registerDevice = mutation({
   args: { id: v.id("devices") },
   handler: async (ctx, args) => {
      const device = await ctx.db
         .query("devices")
         .withIndex("by_device_id", (q) => q.eq("deviceId", args.id || "22101040"))
         .unique();

      if (device) {
         await ctx.db.patch(device._id, { registrationDate: new Date().toISOString() });
      }
   }
});

// Update a device's status
export const updateDeviceStatus = mutation({
   args: {
      id: v.optional(v.id("deviceState")),
      status: v.union(v.literal("online"), v.literal("offline"))
   },
   handler: async (ctx, args) => {
      const device = await ctx.db
         .query("deviceState")
         .withIndex("by_device_id", (q) => q.eq("deviceId", args.id || "22101040"))
         .unique();

      if (device) {
         await ctx.db.patch(device._id, {
            connectionStatus: args.status
         });
      }
   }
});

// Update a device's food level
export const updateFoodLevel = mutation({
   args: {
      id: v.optional(v.id("deviceState")),
      foodLevel: v.number()
   },
   handler: async (ctx, args) => {
      const device = await ctx.db
         .query("deviceState")
         .withIndex("by_device_id", (q) => q.eq("deviceId", args.id || "22101040"))
         .unique();

      if (device) {
         await ctx.db.patch(device._id, { foodLevel: args.foodLevel });
      }
   }
});

// Update last feed
export const updateLastFeed = mutation({
   args: {
      id: v.optional(v.id("deviceState")),
      portion: v.number(),
      image: v.optional(v.string())
   },
   handler: async (ctx, args) => {
      const device = await ctx.db
         .query("deviceState")
         .withIndex("by_device_id", (q) => q.eq("deviceId", args.id || "22101040"))
         .unique();

      if (device) {
         await ctx.db.patch(device._id, {
            lastFeed: {
               time: getCurrentTimeInGMT6(),
               portion: args.portion,
               petImage: args.image
            }
         });
      }
   }
});

function getCurrentTimeInGMT6() {
   const now = new Date();

   const options = {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
   } as Intl.DateTimeFormatOptions;

   const formatter = new Intl.DateTimeFormat("en-US", options);
   return formatter.format(now);
}
