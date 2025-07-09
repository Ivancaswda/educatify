import {mutation, query} from "./_generated/server";
import {v} from 'convex/values';

export const getAllLessons = query({
    handler: async (ctx) => {

        const lessons = await ctx.db.query('lessons').order('desc').collect();

        return lessons!;
    },
});

export const getMyLessons = query({
    args: {
      userId: v.optional(v.string())
    },

    handler: async (ctx, {userId}) => {




        // 1. Найдём текущего пользователя в базе
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", userId)) // Предположим, ты clerkId хранить в subject
            .first();

        if (!user) return []; // не нашли пользователя

        // 2. Теперь фильтруем уроки, где его id есть в studentIds
        const allLessons = await ctx.db.query("lessons").collect();

        const myLessons = allLessons.filter((lesson) =>
            lesson.studentIds.some((id) => id.toString() === user._id.toString())
        );

        return myLessons;
    },
});

export const getLessonByStreamCallId = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query('lessons')
            .withIndex('by_stream_call_id', (q) => q.eq('streamCallId', args.streamCallId))
            .first();
    },
});

export const createLesson = mutation({
    args: {
        userId: v.optional(v.string()),
        title: v.string(),
        desc: v.optional(v.string()),
        startTime: v.number(),
        status: v.string(),
        streamCallId: v.string(),
        studentIds: v.array(v.string()),
        mentorIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {


        return await ctx.db.insert('lessons', {
            ...args,
        });
    },
});

export const updateLessonStatus = mutation({
    args: {
        id: v.id('lessons'),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === 'completed' ? { endTime: Date.now() } : {}),
        });
    },
});


export const createHomework = mutation({
    args: {
        lessonId: v.string(),
        content: v.string(),
        files: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        await ctx.db.patch( args.lessonId,{
            homework: {
                content: args.content,
                files: args.files ?? [],
                createdAt: Date.now()
            }
        })
    }
})

export const deleteHomework = mutation({
    args: {
        lessonId: v.id('lessons'),
        userId: v.string()
    },
    handler: async (ctx, {lessonId, userId}) => {


        const lesson = await ctx.db.get(lessonId)
        if (!lesson) throw new Error("Lesson not found");


        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        if (!user) throw new Error("User not found");


        if (user.role !== "mentor" || !lesson.mentorIds || !lesson.mentorIds.includes(user._id) && !lesson.mentorIds.includes(user.userId)) {
            throw new Error("Forbidden: You are not a mentor of this lesson");
        }
        return await ctx.db.patch(lessonId, {homework: undefined})
    }
})


export const hideHomework = mutation({
    args: {
        lessonId: v.id('lessons'),
        userId: v.string()
    },
    handler: async (ctx, {lessonId, userId}) => {

       // Проверим, что студент существует
        const user = await ctx.db.query('users').withIndex('by_user_id', (q) =>  q.eq('userId', userId)).first()


        if (!user || user.role !== 'student') {
            throw new Error("Only students can hide homework");
        }

        const lesson = await ctx.db.get(lessonId)
        if (!lesson) throw new Error('Lesson is not found')


        await ctx.db.insert('hiddenHomeworks', {
            lessonId,
            studentId: user.userId
        })

        return  {success:true}

    }
})

export const getHiddenHomework = query({
    args: {
        studentId: v.optional(v.string())
    },
    handler: async (ctx, {studentId}) => {
        const hidden = await ctx.db.query('hiddenHomeworks').withIndex('by_student_and_lesson', (q) => q.eq('studentId', studentId)).collect()


        return hidden.map(h => h.lessonId)
    }
})


export const hideLiveLesson = mutation({
    args: {
        lessonId: v.id('lessons'),
        studentId: v.string()
    },
    handler: async (ctx, {lessonId, studentId}) => {


        if (!studentId) {
            throw  new Error('User  not found')
        }

        /*  if ( studentid.role === "mentor") {
            throw new Error("Only students can hide lessons");
        } */


        await ctx.db.insert('hiddenLiveLessons', { // inserting lesson in hiddenLiveLessons table of schema thus veiling it
            lessonId: lessonId,
            studentId: studentId
        })
        return {success: true}
    }
})

export const getHiddenLiveLessons = query({
    args: {
        studentId: v.string()
    },
    handler: async (ctx, {studentId}) => {
        const hiddenLessons = await ctx.db.query('hiddenLiveLessons').withIndex('by_student_and_lesson', (q) => q.eq('studentId', studentId)).collect()

        return hiddenLessons.map((h) => h.lessonId) // returning lessonId of hiddenLiveLesson
    }
})

export const updateLessonStudents = mutation({
    args: {
        streamCallId: v.string(),
        studentIds: v.array(v.string()),
        userId: v.string()
    },
    handler: async (ctx, args) => {


        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!user || user.role !== "mentor") {
            throw new Error("Only mentors can update student list");
        }

        const lesson = await ctx.db
            .query("lessons")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();

        if (!lesson) throw new Error("Lesson not found");

        // Проверка, что пользователь — ментор в этом уроке
        if (!lesson.mentorIds.includes(user._id) && !lesson.mentorIds.includes(user.userId)) {
            throw new Error("You are not the mentor of this lesson");
        }

        await ctx.db.patch(lesson._id, {
            studentIds: args.studentIds,
        });
    },
});



export const deleteLesson = mutation({
    args: {
        lessonId: v.id("lessons"),
        mentorId: v.string()
    },
    handler: async (ctx, { lessonId, mentorId }) => {


        // Найдём пользователя по clerkId
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", mentorId))
            .first();

        if (!user) throw new Error("User not found");

        if (user.role !== "mentor") throw new Error("Only mentors can delete lessons");

        const lesson = await ctx.db.get(lessonId);
        if (!lesson) throw new Error("Lesson not found");


        if (!lesson.mentorIds.includes(user._id) && !lesson.mentorIds.includes(user.userId)) {
            throw new Error("Forbidden: You are not a mentor of this lesson");
        }

        // Удаляем урок
        await ctx.db.delete(lessonId);

        return { success: true };
    },
});
