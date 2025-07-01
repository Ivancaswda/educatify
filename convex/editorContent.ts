import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'


export const saveEditorContent = mutation({
    args: {
        lessonId: v.string(),
        content: v.any()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query('editorContent').filter((q) => q.eq(q.field('lessonId'), args.lessonId)).first()

        if (existing) {
            await ctx.db.patch(existing._id, {content: args.content})
        } else {
            await ctx.db.insert('editorContent',{
                lessonId: args.lessonId,
                content: args.content
            })
        }
    }
})

export const getEditorContent = query({
    args: { lessonId: v.string()},
    handler: async (ctx, args) => {
        const doc = await ctx.db.query('editorContent').filter((q) => q.eq(q.field('lessonId'), args.lessonId)).first()
        return doc?.content ?? null
    }
})