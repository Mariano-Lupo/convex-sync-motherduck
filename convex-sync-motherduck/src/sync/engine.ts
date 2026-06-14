import {
    createSyncStateTable,
    saveSyncState,
    getSyncStateForTable,
} from "./duckdb";

import { importSnapshot } from "./importSnapshot";

export async function runEngine() {
    console.log("ENGINE START");

    createSyncStateTable();

    const existingState =
        await getSyncStateForTable("notes");

    if (existingState?.phase === "done") {
        console.log(
            "SNAPSHOT ALREADY COMPLETE, SKIPPING"
        );

        return;
    }

    try {
        saveSyncState(
            "notes",
            "running",
            null,
            null,
            0,
            null
        );

        const rowsImported =
            await importSnapshot();

        saveSyncState(
            "notes",
            "done",
            null,
            null,
            rowsImported,
            null
        );

        console.log("ENGINE COMPLETE");
    } catch (error) {
        console.log("CATCH BLOCK EXECUTED");

        const message =
            error instanceof Error
                ? error.message
                : "Unknown error";

        saveSyncState(
            "notes",
            "error",
            null,
            null,
            0,
            message
        );

        console.log("ERROR STATE SAVED");

        console.error(error);
    }
}