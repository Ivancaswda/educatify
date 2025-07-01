// convex/files.ts
import { action } from "./_generated/server";

export const generateUploadUrl = action({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});
