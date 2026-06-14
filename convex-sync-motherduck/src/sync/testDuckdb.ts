import {
    createNotesTable,
    insertNote,
    getAllNotes,
} from "./duckdb";

async function main() {
    createNotesTable();

    insertNote({
        id: "1",
        title: "My first synced note",
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    const notes = await getAllNotes();

    console.log("NOTES IN DUCKDB:");
    console.log(notes);
}

main();