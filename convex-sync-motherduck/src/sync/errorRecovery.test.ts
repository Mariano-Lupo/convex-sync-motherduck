import { describe, expect, test } from "bun:test";

import {
    createSyncStateTable,
    saveSyncState,
    getSyncStateForTable,
} from "./duckdb";

describe("Error Recovery", () => {
    test("can move from error state back to done", async () => {
        createSyncStateTable();

        saveSyncState(
            "notes",
            "error",
            null,
            null,
            0,
            "Simulated failure"
        );

        let state =
            await getSyncStateForTable("notes");

        expect(state?.phase).toBe("error");

        saveSyncState(
            "notes",
            "done",
            null,
            null,
            3,
            null
        );

        state =
            await getSyncStateForTable("notes");

        expect(state?.phase).toBe("done");
        expect(Number(state?.rows_applied)).toBe(3);
    });
});