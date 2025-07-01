/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as authInternal from "../authInternal.js";
import type * as blogPosts from "../blogPosts.js";
import type * as chats from "../chats.js";
import type * as comments from "../comments.js";
import type * as editorContent from "../editorContent.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as reviews from "../reviews.js";
import type * as stats from "../stats.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authInternal: typeof authInternal;
  blogPosts: typeof blogPosts;
  chats: typeof chats;
  comments: typeof comments;
  editorContent: typeof editorContent;
  files: typeof files;
  http: typeof http;
  lessons: typeof lessons;
  reviews: typeof reviews;
  stats: typeof stats;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
