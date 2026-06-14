import { describe, expect, test } from "bun:test";

import {
    createSyncStateTable,
    saveSyncState,
    getSyncStateForTable,
} from "./duckdb";

describe("Sync State Recovery", () => {
    test("persists error state", async () => {
        createSyncStateTable();

        saveSyncState(
            "notes",
            "error",
            null,
            null,
            0,
            "Simulated crash"
        );

        const state =
            await getSyncStateForTable("notes");

        expect(state).not.toBeNull();
        expect(state?.phase).toBe("error");
        expect(state?.last_error).toBe(
            "Simulated crash"
        );
    });
});