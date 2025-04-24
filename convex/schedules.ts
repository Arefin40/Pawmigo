import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

// Create a new schedule
export const createSchedule = mutation({
   args: {
      petId: v.id("pets"),
      name: v.optional(v.string()),
      timestamp: v.string(),
      portion: v.number(),
      days_of_week: v.array(
         //prettier-ignore
         v.union(
            v.literal("SAT"), v.literal("SUN"), v.literal("MON"),
            v.literal("TUE"), v.literal("WED"), v.literal("THU"),
            v.literal("FRI")
         )
      )
   },
   handler: async (ctx, args) => {
      return await ctx.db.insert("schedule", { ...args, enabled: true });
   }
});

// Get all schedules for a pet
export const getSchedules = query({
   args: { petId: v.id("pets") },
   handler: async (ctx, args) => {
      const schedules = await ctx.db
         .query("schedule")
         .filter((q) => q.eq(q.field("petId"), args.petId))
         .collect();
      return schedules.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
   }
});

// Get a schedule by id
export const getSchedule = query({
   args: { id: v.id("schedule") },
   handler: async (ctx, args) => {
      return await ctx.db.get(args.id);
   }
});

// Get all schedules for a pet
export const getSchedulesByPetId = query({
   args: { petId: v.id("pets") },
   handler: async (ctx, args) => {
      const schedules = await ctx.db
         .query("schedule")
         .withIndex("by_pet_id", (q) => q.eq("petId", args.petId))
         .collect();
      return schedules.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
   }
});

// Get all enabled schedules for a pet
export const getEnabledSchedules = query({
   args: { petId: v.id("pets") },
   handler: async (ctx, { petId }) => {
      return ctx.db
         .query("schedule")
         .withIndex("by_pet_id", (q) => q.eq("petId", petId))
         .filter((q) => q.eq(q.field("enabled"), true))
         .collect();
   }
});

// Get today's schedules
export const getTodaySchedules = query({
   handler: async ({ db }) => {
      const today = daysOfWeek[new Date().getDay()];

      // Get all enabled schedules
      const enabledSchedules = await db
         .query("schedule")
         .withIndex("by_enabled", (q) => q.eq("enabled", true))
         .collect();

      // Filter schedules for today and map to desired format
      const todaySchedules = enabledSchedules
         .filter((schedule) => schedule.days_of_week.includes(today))
         .map((schedule) => ({
            petId: schedule.petId,
            portion: schedule.portion,
            timestamp: schedule.timestamp
         }))
         .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      // Get pet RFID for each schedule
      const schedules = await Promise.all(
         todaySchedules.map(async ({ petId, ...schedule }) => {
            const pet = await db.get(petId);
            if (!pet || !pet.rfid) {
               throw new Error(`Pet with ID ${petId} not found or has no RFID`);
            }
            return {
               rfid: pet.rfid,
               ...schedule
            };
         })
      );

      return schedules;
   }
});

// Update a schedule
export const updateSchedule = mutation({
   args: {
      id: v.id("schedule"),
      name: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      portion: v.optional(v.number()),
      enabled: v.optional(v.boolean()),
      days_of_week: v.optional(
         v.array(
            //prettier-ignore
            v.union(
               v.literal("SAT"), v.literal("SUN"), v.literal("MON"),
               v.literal("TUE"), v.literal("WED"), v.literal("THU"),
               v.literal("FRI")
            )
         )
      )
   },
   handler: async (ctx, { id, ...updates }) => {
      await ctx.db.patch(id, updates);
   }
});

// Delete a schedule
export const deleteSchedule = mutation({
   args: {
      id: v.id("schedule")
   },
   handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
   }
});
