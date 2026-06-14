import { beforeEach, describe, expect, test } from "vitest";
import { type Delta } from "./applyDelta";

import { applyChanges } from "./applyChanges";
import {
    clearNotesTable,
    createNotesTable,
    getAllNotes,
} from "./duckdb";

describe("applyChanges", () => {
    beforeEach(() => {
        createNotesTable();
        clearNotesTable();
    });

    test("applies multiple deltas in order", async () => {
        await applyChanges([
            {
                operation: "insert",
                id: "1",
                title: "first",
                completed: false,
                createdAt: 1,
                updatedAt: 1,
            },
            {
                operation: "update",
                id: "1",
                title: "updated",
                completed: true,
                updatedAt: 2,
            },
        ]);

        const notes = await getAllNotes();

        expect(notes).toHaveLength(1);
        expect(notes[0].title).toBe("updated");
        expect(notes[0].completed).toBe(true);
    });


    test("returns number of applied changes", async () => {
        const count = await applyChanges([
            {
                operation: "insert",
                id: "1",
                title: "a",
                completed: false,
                createdAt: 1,
                updatedAt: 1,
            },
            {
                operation: "delete",
                id: "1",
            },
        ]);

        expect(count).toBe(2);
    });

    test("replaying the same insert delta does not create duplicates", async () => {
        const deltas: Delta[] = [
            {
                operation: "insert",
                id: "1",
                title: "note",
                completed: false,
                createdAt: 1,
                updatedAt: 1,
            },
        ];

        await applyChanges(deltas);
        await applyChanges(deltas);

        const notes = await getAllNotes();

        expect(notes).toHaveLength(1);
        expect(notes[0].id).toBe("1");
    });
});