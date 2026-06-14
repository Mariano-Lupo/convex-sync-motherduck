import { describe, expect, test } from "bun:test";

import { runEngine } from "./engine";
import {
    createSyncStateTable,
    getSyncStateForTable,
} from "./duckdb";

describe("Sync Engine", () => {
    test("completes snapshot successfully", async () => {
        createSyncStateTable();

        await runEngine();

        const state =
            await getSyncStateForTable("notes");

        expect(state).not.toBeNull();
        expect(state?.phase).toBe("done");
        expect(Number(state?.rows_applied)).toBeGreaterThan(0);
    });
});