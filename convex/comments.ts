import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'
import {identity} from "rxjs";
export const addComment = mutation({
    args: {
        lessonId: v.id('lessons'),
        content: v.string(),
        rating: v.number(),
        studentId: v.string(),
        mentorId: v.string()
    },
    handler: async (ctx, args) => {


        return await  ctx.db.insert('comments', {
            lessonId: args.lessonId,
            content: args.content,
            rating: args.rating,
            mentorId: args.mentorId,
            studentId: args.studentId
        })
    }
})

export const getAllComments = query({
    handler: async (ctx) => {
        const comments = await ctx.db.query('comments').collect()
        return comments!
    }
})

export const getComments = query({
    args: {lessonId: v.id('lessons')},
    handler: async (ctx, args) => {
        const comments = await ctx.db.query('comments').withIndex('by_lesson_id', (q) => q.eq('lessonId', args.lessonId))
            .collect()

        return comments!
    }
})

export const updateComment = mutation({
    args: {
        commentId: v.id('comments'),
        content: v.string(),
        rating: v.number(),
        mentorId: v.string()
    },
    handler:  async (ctx, args) => {


        await ctx.db.patch(args.commentId ,{
            mentorId: args.mentorId,
            content: args.content,
            rating: args.rating
        })
        return {success: true}
    }
})
export const deleteComment = mutation({
    args: {
        commentId: v.id('comments'),
        mentorId: v.string()
    },
    handler: async (ctx, {commentId, mentorId}) => {

        const comment =  await ctx.db.get(commentId)

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", mentorId))
            .first();

        if (!user) throw new Error("User not found");

        if (user.role !== "mentor") throw new Error("Only mentors can delete comments");
        if (!comment) throw  new Error('Comment not found')

        // Проверяем, что текущий пользователь — ментор этого урока
        if (comment?.mentorId !== user._id && comment?.mentorId !== user.userId ) {
            throw new Error("Forbidden: You are not a mentor of this lesson");
        }

        await ctx.db.delete(commentId)

        return  {success:true}
    }
})