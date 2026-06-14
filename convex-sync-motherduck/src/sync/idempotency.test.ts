import { describe, expect, test } from "bun:test";

import {
    createNotesTable,
    clearNotesTable,
    insertNote,
    getAllNotes,
} from "./duckdb";

describe("DuckDB Idempotency", () => {
    test("re-inserting same note replaces instead of duplicating", async () => {
        createNotesTable();
        clearNotesTable();

        insertNote({
            id: "same-id",
            title: "First Version",
            completed: false,
            createdAt: 1,
            updatedAt: 1,
        });

        insertNote({
            id: "same-id",
            title: "Updated Version",
            completed: true,
            createdAt: 1,
            updatedAt: 2,
        });

        const notes = await getAllNotes();

        expect(notes.length).toBe(1);
        expect(notes[0].title).toBe("Updated Version");
        expect(notes[0].completed).toBe(true);
    });
});