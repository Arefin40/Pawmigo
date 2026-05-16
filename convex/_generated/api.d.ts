/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as crons from "../crons.js";
import type * as devices from "../devices.js";
import type * as functions from "../functions.js";
import type * as pets from "../pets.js";
import type * as queue from "../queue.js";
import type * as schedules from "../schedules.js";
import type * as utils_time from "../utils/time.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  crons: typeof crons;
  devices: typeof devices;
  functions: typeof functions;
  pets: typeof pets;
  queue: typeof queue;
  schedules: typeof schedules;
  "utils/time": typeof utils_time;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
