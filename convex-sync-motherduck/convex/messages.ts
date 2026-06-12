import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const listNotes = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("notes").order("desc").collect();
    },
});


export const addNote = mutation({
    args: {
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        await ctx.db.insert("notes", {
            title: args.title,
            completed: false,
            createdAt: now,
            updatedAt: now,
        });
    },
});


export const deleteNote = mutation({
    args: {
        id: v.id("notes"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});


export const updateNote = mutation({
    args: {
        id: v.id("notes"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            title: args.title,
            updatedAt: Date.now(),
        });
    },
});


export const toggleCompleted = mutation({
    args: {
        id: v.id("notes"),
    },
    handler: async (ctx, args) => {
        const note = await ctx.db.get(args.id);

        if (!note) {
            throw new Error("Task not found");
        }

        await ctx.db.patch(args.id, {
            completed: !note.completed,
            updatedAt: Date.now(),
        });
    },
});

export const getAllNotes = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("notes").collect();
    },
});