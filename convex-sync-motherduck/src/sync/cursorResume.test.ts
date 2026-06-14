import { describe, expect, test } from "bun:test";

import { runEngine } from "./engine";
import { getPendingDeltas } from "./getPendingDeltas";

describe("Cursor Resume", () => {
    test(
        "reuses persisted cursor on later runs",
        async () => {
            await runEngine();

            const deltasAfterRun =
                await getPendingDeltas();

            expect(
                deltasAfterRun.length
            ).toBe(0);
        }
    );
});