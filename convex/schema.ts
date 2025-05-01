import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   // Device table
   devices: defineTable({
      deviceId: v.string(),
      secret: v.string(),
      registrationDate: v.optional(v.string())
   }).index("by_device_id", ["deviceId"]),

   // Tracking states
   deviceState: defineTable({
      deviceId: v.string(),
      connectionStatus: v.union(v.literal("online"), v.literal("offline")),
      foodLevel: v.number(),
      lastFeed: v.optional(
         v.object({
            time: v.string(),
            portion: v.number(),
            petImage: v.optional(v.string())
         })
      )
   }).index("by_device_id", ["deviceId"]),

   // Pets table
   pets: defineTable({
      name: v.string(),
      image: v.optional(v.string()),
      rfid: v.string(),
      beep: v.number()
   }).index("by_rfid", ["rfid"]),

   // Feeding Queue table
   queue: defineTable({
      rfid: v.string(),
      portion: v.number(),
      timestamp: v.number(),
      isManual: v.boolean(),
      isCompleted: v.boolean(),
      beep: v.number()
   })
      .index("by_completed", ["isCompleted"])
      .index("by_timestamp", ["timestamp"]),

   // Schedule table
   schedule: defineTable({
      petId: v.id("pets"),
      name: v.optional(v.string()),
      timestamp: v.string(),
      days_of_week: v.array(
         v.union(
            v.literal("SAT"),
            v.literal("SUN"),
            v.literal("MON"),
            v.literal("TUE"),
            v.literal("WED"),
            v.literal("THU"),
            v.literal("FRI")
         )
      ),
      portion: v.number(),
      enabled: v.boolean()
   })
      .index("by_pet_id", ["petId"])
      .index("by_enabled", ["enabled"]),

   // Activities table
   activities: defineTable({
      activityType: v.union(
         v.literal("schedule_feeding"),
         v.literal("manual_feeding"),
         v.literal("skip_feeding"),
         v.literal("error"),
         v.literal("connection"),
         v.literal("rfid_scan"),
         v.literal("low_food_level")
      ),
      petId: v.optional(v.id("pets")),
      description: v.string(),
      timestamp: v.number()
   })
});
