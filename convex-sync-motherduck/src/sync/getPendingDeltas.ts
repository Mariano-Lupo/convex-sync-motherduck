import { readFileSync } from "fs";
import { type Delta } from "./applyDelta";
import { getSyncStateForTable } from "./duckdb";

export async function getPendingDeltas(tableName = "notes"): Promise<Delta[]> {
    const fileContents = readFileSync(
        "export/notes/deltas.json",
        "utf-8"
    );

    const deltas =
        JSON.parse(fileContents) as Delta[];

    const state =
        await getSyncStateForTable(tableName);

    const cursor =
        Number(state?.last_cursor ?? 0);

    return deltas.slice(cursor);
}