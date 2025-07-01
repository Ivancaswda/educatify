import {v} from 'convex/values'
import {mutation, query} from "./_generated/server";


export const getAllPosts = query({
    args: {

    },
    handler: async (ctx) => {
        const blogPosts = await ctx.db.query('blogPosts').order('desc').collect()
        return blogPosts!
    }
})

export const createPost = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        image: v.string(),
        excerpt: v.string(),
        authorId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('blogPosts',args)
    }
})

export const getPostById = query({
    args: {
        postId: v.id('blogPosts')
    },
    handler: async (ctx, {postId}) => {
        const post = await ctx.db.get(postId)
        return post!
    }
})

export const deletePost = mutation({
    args: {
        id: v.id('blogPosts')
    },
    handler: async (ctx, {id})=> {
        return await ctx.db.delete(id)
    }
})

export const updatePost = mutation({
    args: {
        id: v.id('blogPosts'),
        title: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        image: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, ...updatedData} = args

        const dataToUpdate = Object.fromEntries(     // Удаляем поля которые не переданы
            Object.entries(updatedData).filter(([_, v]) => v !== undefined)
        )
        await ctx.db.patch(id, dataToUpdate)
    }
})