import { describe, expect, test } from "bun:test";

import {
    createNotesTable,
    clearNotesTable,
    insertNote,
    getAllNotes,
    deleteNote,
} from "./duckdb";

describe("DuckDB Notes", () => {
    test("insert and delete note", async () => {
        createNotesTable();
        clearNotesTable();

        insertNote({
            id: "test-1",
            title: "Test Note",
            completed: false,
            createdAt: 1,
            updatedAt: 1,
        });

        let notes = await getAllNotes();

        expect(notes.length).toBe(1);
        expect(notes[0].id).toBe("test-1");

        deleteNote("test-1");

        notes = await getAllNotes();

        expect(notes.length).toBe(0);
    });
});