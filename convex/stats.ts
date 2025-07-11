import {query} from "./_generated/server";
import {v} from 'convex/values'

export const getStatsForUser = query({
    args: {clerkId: v.optional(v.string())},
    handler: async (ctx, {clerkId}) => {
        console.log(clerkId)
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), clerkId))
            .first();
        console.log(user)


        if (user?.role === 'mentor') {
            const allLessons = await ctx.db.query('lessons').collect();

            const myLessons = allLessons.filter((lesson) =>
                lesson.mentorIds.includes(user._id ?? user.userId) || lesson.mentorIds.includes(user.userId)
            );
            console.log(myLessons)
            const totalStudents = new Set<string>();

            myLessons.forEach((lesson) => {
                lesson.studentIds.forEach((id) => totalStudents.add(id));
            });
            // displaying overall hours since user`s registration
            const registrationTime = user.createdAt || 0
            const totalHours = myLessons
                .filter(lesson => lesson.startTime >= registrationTime)
                .reduce((sum, lesson) => {
                    const duration = (lesson.endTime ?? lesson.startTime) - lesson.startTime;
                    return sum + duration;
                }, 0) / 3600000; // Перевод из миллисекунд в часы
            return {
                role: 'mentor',
                lessonsConducted: myLessons.length,
                totalStudents: totalStudents.size,
                totalHours: Math.round(totalHours * 10) /10
            };
        } else {

            const now = Date.now()

            const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

            const allLessons = await ctx.db.query('lessons').collect();

            const myLessons = allLessons.filter((lesson) =>
                lesson.studentIds.includes(user._id) || lesson.studentIds.includes(user.userId)
            );

            const MyLessonsByLastWeek = myLessons.filter((lesson) =>
            lesson.startTime >= oneWeekAgo && lesson.startTime <= now).length

            const myComments = await ctx.db
                .query('comments')
                .filter((q) => q.eq(q.field('studentId'), user._id))
                .collect();

            const averageRating =
                myComments.reduce((acc, c) => acc + c.rating, 0) /
                (myComments.length || 1);




            return {
                role: 'student',
                lessonsAttended: myLessons.length,
                lessonsLastWeek: MyLessonsByLastWeek,
                averageRating: Math.round(averageRating * 10) / 10,

            };
        }

    }
})


export const getStatsForMentorsBatch = query({
    args: { clerkIds: v.array(v.string()) },
    handler: async (ctx, { clerkIds }) => {
        if (clerkIds.length === 0) return [];

        const mentors = await ctx.db
            .query("users")
            .filter((q) => {
                const conditions = clerkIds.map((id) =>
                    q.eq(q.field("userId"), id)
                );
                return q.or(...conditions);
            })
            .collect();

        const allLessons = await ctx.db.query("lessons").collect();

        return mentors.map((mentor) => {
            const mentorLessons = allLessons.filter((lesson) =>
                lesson.mentorIds.includes(mentor._id)
            );

            const studentSet = new Set<string>();
            mentorLessons.forEach((lesson) => {
                lesson.studentIds.forEach((id) => studentSet.add(id));
            });

            return {
                clerkId: mentor.userId,
                lessonsConducted: mentorLessons.length,
                totalStudents: studentSet.size,
            };
        });
    },
});


export const getStatsForStudentsBatch = query({
    args: { clerkIds: v.array(v.string()) },
    handler: async (ctx, { clerkIds }) => {
        if (clerkIds.length === 0) return [];

        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

        const students = await ctx.db
            .query("users")
            .filter((q) => {
                const conditions = clerkIds.map((id) =>
                    q.eq(q.field("userId"), id)
                );
                return q.or(...conditions);
            })
            .collect();

        const allLessons = await ctx.db.query("lessons").collect();
        const allComments = await ctx.db.query("comments").collect();

        return students.map((student) => {
            const studentLessons = allLessons.filter((lesson) =>
                lesson.studentIds.includes(student._id));

            const lessonsAttended = studentLessons.length;

            const comments = allComments.filter(
                (c) => c.studentId === student._id);

            const averageRating =
                comments.reduce((acc, c) => acc + (c.rating ?? 0), 0) /
                (comments.length || 1);

            const lessonsLastWeek = studentLessons.filter(
                (lesson) =>
                    lesson.startTime >= oneWeekAgo && lesson.startTime <= now
            ).length;

            return {
                clerkId: student.userId,
                lessonsAttended,
                averageRating,
                lessonsLastWeek,
            };
        });
    },
});