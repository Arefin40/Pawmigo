import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
export const getTodaySchedules = query(async ({ db }) => {
   const today = daysOfWeek[new Date().getDay()];

   const schedules = await db
      .query("schedule")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();

   const todaySchedules = schedules.filter((schedule) => schedule.days_of_week.includes(today));
   return todaySchedules;
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
