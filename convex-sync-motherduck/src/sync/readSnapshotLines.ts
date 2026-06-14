import { readFileSync } from "fs";

export function readSnapshotLines(
    tableName: string
): string[] {
    return readFileSync(
        `export/${tableName}/documents.jsonl`,
        "utf-8"
    )
        .split("\n")
        .filter(
            (line) => line.trim() !== ""
        );
}