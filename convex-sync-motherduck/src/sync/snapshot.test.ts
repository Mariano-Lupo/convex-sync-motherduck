import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";

import { importSnapshot } from "./importSnapshot";
import { getAllNotes } from "./duckdb";

describe("Snapshot import", () => {
    test("imports the same rows as the JSONL export", async () => {
        const sourceText = readFileSync(
            "export/notes/documents.jsonl",
            "utf-8"
        ).trim();

        const sourceLines = sourceText.length > 0 ? sourceText.split(/\r?\n/) : [];
        const sourceRows = sourceLines.map((line) => JSON.parse(line) as { _id: string });

        const importedCount = await importSnapshot("notes");
        const importedNotes = await getAllNotes();

        expect(importedCount).toBe(sourceRows.length);
        expect(importedNotes.length).toBe(sourceRows.length);

        const sourceIds = sourceRows.map((row) => row._id).sort();
        const importedIds = importedNotes.map((note) => note.id).sort();

        expect(importedIds).toEqual(sourceIds);
    });
});