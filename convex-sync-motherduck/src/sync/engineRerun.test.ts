import { describe, expect, test } from "bun:test";

import { runEngine } from "./engine";
import {
    createSyncStateTable,
    getSyncStateForTable,
} from "./duckdb";

describe("Engine Re-run", () => {
    test("does not re-import after completion", async () => {
        createSyncStateTable();

        await runEngine();

        const firstState =
            await getSyncStateForTable("notes");

        expect(firstState).not.toBeNull();
        expect(firstState?.phase).toBe("done");

        const firstRows =
            Number(firstState?.rows_applied);

        await runEngine();

        const secondState =
            await getSyncStateForTable("notes");

        expect(secondState).not.toBeNull();
        expect(secondState?.phase).toBe("done");

        const secondRows =
            Number(secondState?.rows_applied);

        expect(secondRows).toBe(firstRows);
    });
});