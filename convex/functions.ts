import {
   mutation as rawMutation,
   internalMutation as rawInternalMutation
} from "./_generated/server";
import { api } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";

const triggers = new Triggers<DataModel>();

// Register a trigger to run when a `schedule` changes
triggers.register("schedule", async (ctx, change) => {
   await ctx.runMutation(api.queue.scheduleDailyFeedings);
});

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));
