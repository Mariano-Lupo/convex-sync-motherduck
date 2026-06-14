import { describe, expect, test } from "bun:test";

import {
    saveSyncState,
} from "./duckdb";

import {
    getPendingDeltas,
} from "./getPendingDeltas";

describe("Pending Deltas", () => {
    test(
        "returns pending deltas after cursor",
        async () => {
            saveSyncState(
                "pending_deltas_test",
                "done",
                "0",
                null,
                0,
                null
            );

            const deltas =
                await getPendingDeltas(
                    "pending_deltas_test"
                );

            expect(deltas.length)
                .toBe(1);
        }
    );
});