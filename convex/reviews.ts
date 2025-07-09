import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'
export const getAllReviews = query({
    args: {

    },
    handler:  async ({db}) => {
        return await db.query('reviews').collect()
    }
})

export const createReview = mutation({
    args: {
        authorId: v.string(),
        text: v.string(),
        stars: v.number()
    },
    handler: async ({db}, {authorId, text, stars}) => {
        const createdAt = Date.now();
        const id = await db.insert("reviews", { authorId, text, createdAt, stars });
        return id;
    }
})