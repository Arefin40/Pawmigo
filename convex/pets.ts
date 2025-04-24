import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a pet to the database
export const addPet = mutation({
   args: {
      name: v.string(),
      rfid: v.string(),
      image: v.optional(v.string())
   },

   handler: async (ctx, args) => {
      const docs = await ctx.db.query("pets").collect();
      const beep = docs.length + 1;

      const petId = await ctx.db.insert("pets", {
         name: args.name,
         rfid: args.rfid,
         image: args.image ?? "",
         beep: beep
      });
      return petId;
   }
});

// Get all pets from the database
export const getPets = query({
   handler: async (ctx) => {
      return await ctx.db.query("pets").collect();
   }
});
