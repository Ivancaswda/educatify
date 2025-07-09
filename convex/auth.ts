
import { v4 as uuidv4 } from 'uuid';
import {action} from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

import {internal, api} from "./_generated/api";

const registerHandler = async (ctx, args) => {
    const userExists = await ctx.runQuery(api.authInternal.findUserByEmail, {
        email: args.email,
    });

    if (userExists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(args.password, 10);
    const userId = uuidv4();

    const dbId = await ctx.runMutation(api.authInternal._createUser, {
        name: args.name,
        email: args.email,
        password: hashed,
        role: args.role,
        image: args.image,
        createdAt: Date.now(),
        userId,
    });

    return {
        id: dbId,
        userId,
        name: args.name,
        email: args.email,
        role: args.role,
        image: args.image ?? null,
    };
};

export const registerUser = action({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string(),
        role: v.union(v.literal("student"), v.literal("mentor")),
        image: v.optional(v.string()),
    },
    handler: registerHandler,
});

export const login = action({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(api.authInternal.findUserByEmail, {
            email: args.email,
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(args.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image ?? null,
        };
    },
})