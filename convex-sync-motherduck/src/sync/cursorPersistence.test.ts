import { describe, expect, test } from "bun:test";

import {
    createSyncStateTable,
    saveSyncState,
    getSyncStateForTable,
} from "./duckdb";

describe("Cursor Persistence", () => {
    test("persists last_cursor", async () => {
        createSyncStateTable();
        saveSyncState(
            "cursor_test",
            "done",
            "123",
            null,
            0,
            null
        );

        const state = await getSyncStateForTable("cursor_test");

        expect(state?.last_cursor)
            .toBe("123");
    });
});