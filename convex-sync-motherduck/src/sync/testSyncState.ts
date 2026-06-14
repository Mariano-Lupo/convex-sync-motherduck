import {
    createSyncStateTable,
    saveSyncState,
    getSyncState,
} from "./duckdb";

async function main() {
    createSyncStateTable();

    saveSyncState(
        "notes",
        "running",
        null,
        null,
        0,
        null
    );

    const state = await getSyncState();

    console.log(state);
}

main();