import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   // Device table
   devices: defineTable({
      deviceId: v.string(),
      secret: v.string(),
      status: v.union(v.literal("online"), v.literal("offline")),
      registrationDate: v.optional(v.string()),
      foodLevel: v.optional(v.number())
   }).index("by_device_id", ["deviceId"]),

   // Pets table
   pets: defineTable({
      name: v.string(),
      image: v.optional(v.string()),
      rfid: v.string()
   }).index("by_rfid", ["rfid"]),

   // Activities table
   activities: defineTable({
      activityType: v.union(
         v.literal("schedule_feeding"),
         v.literal("manual_feeding"),
         v.literal("error"),
         v.literal("connection"),
         v.literal("rfid_scan")
      ),
      petId: v.optional(v.id("pets")),
      description: v.string(),
      timestamp: v.string()
   })
});
