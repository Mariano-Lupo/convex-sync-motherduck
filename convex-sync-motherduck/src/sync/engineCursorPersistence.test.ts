import { describe, expect, test } from "bun:test";

import { runEngine } from "./engine";
import { getSyncStateForTable } from "./duckdb";

describe("Engine Cursor Persistence", () => {
    test("cursor is persisted after engine run", async () => {
        await runEngine();

        const state =
            await getSyncStateForTable("notes");

        expect(state).not.toBeNull();
        expect(state?.last_cursor).toBe("1");
    });
});