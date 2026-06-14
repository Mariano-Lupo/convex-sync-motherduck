import { describe, expect, test } from "bun:test";

import {
    saveSyncState,
} from "./duckdb";

import {
    getPendingDeltas,
} from "./getPendingDeltas";

describe("Cursor Filtering", () => {
    test(
        "filters already applied deltas",
        async () => {
            saveSyncState(
                "cursor_filter_test",
                "done",
                "1",
                null,
                0,
                null
            );

            const deltas =
                await getPendingDeltas(
                    "cursor_filter_test"
                );

            expect(deltas.length)
                .toBe(0);
        }
    );
});