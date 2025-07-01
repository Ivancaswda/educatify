import {defineSchema, defineTable} from "convex/server";
import {v} from 'convex/values'
export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        userId: v.string(),
        password: v.optional(v.string()),
        image: v.optional(v.string()),
        // whether role will be student or mentor
        role: v.union(v.literal("student"), v.literal("mentor")),
       // clerkId: v.string(),
        createdAt: v.optional(v.number()),
        // nessesary id of clerk
    }).index('by_user_id', ["userId"])
        .index('by_email', ['email']), // defining it by clerk_id

    lessons: defineTable({
        title: v.string(),
        desc: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.string(),
        streamCallId: v.string(),
        studentIds: v.array(v.string()),
        mentorIds: v.array(v.string()),
        userId: v.optional(v.string()),
        homework: v.optional(v.object({
            content: v.string(),
            createdAt: v.number(),
            files: v.optional(v.array(v.string()))
        }))
    }).index('by_student_id', ["studentIds"]).index('by_stream_call_id', ['streamCallId']),
    hiddenHomeworks: defineTable({
       lessonId: v.id('lessons'),
       studentId: v.string()
    }).index('by_student_and_lesson',['studentId', "lessonId"] ),
    comments: defineTable({
        content: v.string(),
        rating: v.number(),
        mentorId: v.string(),
        lessonId: v.id("lessons"),
        studentId: v.string()
    }).index('by_lesson_id', ['lessonId']),

    editorContent: defineTable({
        lessonId: v.string(),
        content: v.any()
    }),
    hiddenLiveLessons: defineTable({
        lessonId: v.id('lessons'),
        studentId: v.string() // user who decided to conceal the live-lesson
    }).index('by_student_and_lesson', ["studentId", "lessonId"]),

    reviews: defineTable({
        authorId: v.string(),
        text: v.string(),
        createdAt: v.optional(v.number()),
        stars: v.number()
    }),
    blogPosts: defineTable({
        title: v.string(),
        content: v.string(),
        image: v.string(),
        excerpt: v.string(),
        authorId: v.string()
    })


/*  chats: defineTable({
        participantIds: v.array(v.string()),
        createdAt: v.number(),
    }),


    messages: defineTable({
        chatId: v.string(),
        senderId: v.string(),
        text: v.string(),
        imageUrl: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_chat_id", ["chatId"]), */


})