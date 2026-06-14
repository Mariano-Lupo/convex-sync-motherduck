import { readFileSync } from "fs";
import {
    createNotesTable,
    clearNotesTable,
    insertNote,
    getAllNotes,
} from "./duckdb";

export async function importSnapshot() {
    console.log("SNAPSHOT IMPORT START");

    createNotesTable();
    clearNotesTable();

    const fileContents = readFileSync(
        "export/notes/documents.jsonl",
        "utf-8"
    );

    const lines = fileContents
        .split("\n")
        .filter((line: string) => line.trim() !== "");

    for (const line of lines) {
        const note = JSON.parse(line);

        insertNote({
            id: note._id,
            title: note.title,
            completed: note.completed,
            createdAt: Number(note.createdAt),
            updatedAt: Number(note.updatedAt),
        });
    }

    const importedNotes = await getAllNotes();

    console.log("SNAPSHOT IMPORT COMPLETE");
    console.log("ROWS:", importedNotes.length);

    return importedNotes.length;
}