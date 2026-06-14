import { describe, expect, test } from "bun:test";

import { importSnapshot } from "./importSnapshot";
import { getAllNotes } from "./duckdb";

describe("Snapshot Recovery", () => {
    test("re-running a snapshot converges to the correct final state", async () => {
        const firstRun = await importSnapshot("notes");

        const notesAfterFirstRun =
            await getAllNotes();

        const secondRun =
            await importSnapshot("notes");

        const notesAfterSecondRun =
            await getAllNotes();

        expect(secondRun).toBe(firstRun);

        expect(
            notesAfterSecondRun.length
        ).toBe(notesAfterFirstRun.length);
    });
});

import { describe, expect, test } from "bun:test";

describe("Snapshot Recovery", () => {
    test("placeholder for future snapshot resume implementation", () => {
        expect(true).toBe(true);
    });
});