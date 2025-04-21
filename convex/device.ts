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
         secret: args.secret,
         status: "offline"
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

// Register a device
export const registerDevice = mutation({
   args: {
      id: v.id("devices")
   },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, {
         registrationDate: new Date().toISOString()
      });
   }
});

// Update a device's status
export const updateDeviceStatus = mutation({
   args: {
      id: v.id("devices"),
      status: v.union(v.literal("online"), v.literal("offline"))
   },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, {
         status: args.status
      });
   }
});

// Update a device's food level
export const updateFoodLevel = mutation({
   args: {
      id: v.id("devices"),
      foodLevel: v.number()
   },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, {
         foodLevel: args.foodLevel
      });
   }
});
