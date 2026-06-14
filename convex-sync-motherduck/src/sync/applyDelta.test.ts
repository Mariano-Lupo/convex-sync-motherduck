import { describe, expect, test } from "bun:test";

import { applyDelta } from "./applyDelta";
import {
    createNotesTable,
    clearNotesTable,
    getAllNotes,
} from "./duckdb";

describe("Delta Application", () => {
    test("returns the affected id", async () => {
        const result = await applyDelta({
            operation: "insert",
            id: "123",
        });

        expect(result).toBe("123");
    });


    test(
        "insert update and delete deltas",
        async () => {
            createNotesTable();
            clearNotesTable();

            await applyDelta({
                operation: "insert",
                id: "note-1",
                title: "Original",
                completed: false,
                createdAt: 1,
                updatedAt: 1,
            });

            let notes =
                await getAllNotes();

            expect(notes.length).toBe(1);
            expect(notes[0].title)
                .toBe("Original");

            await applyDelta({
                operation: "update",
                id: "note-1",
                title: "Updated",
                completed: true,
                updatedAt: 2,
            });

            notes =
                await getAllNotes();

            expect(notes[0].title)
                .toBe("Updated");

            expect(notes[0].completed)
                .toBe(true);

            await applyDelta({
                operation: "delete",
                id: "note-1",
            });

            notes =
                await getAllNotes();

            expect(notes.length).toBe(0);
        }
    );
});