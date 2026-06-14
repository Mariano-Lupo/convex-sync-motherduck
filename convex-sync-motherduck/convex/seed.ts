import { mutation } from "./_generated/server";

export const run = mutation({
    args: {},
    handler: async (ctx) => {
        const existingNotes =
            await ctx.db.query("notes").collect();

        for (const note of existingNotes) {
            await ctx.db.delete(note._id);
        }

        const now = Date.now();

        for (let i = 1; i <= 500; i++) {
            await ctx.db.insert("notes", {
                title: `Seed Note ${i}`,
                completed: i % 2 === 0,
                createdAt: now,
                updatedAt: now,
            });
        }

        return {
            deleted: existingNotes.length,
            inserted: 500,
        };
    },
});