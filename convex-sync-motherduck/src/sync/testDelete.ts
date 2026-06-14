import {
    getAllNotes,
    deleteNote,
} from "./duckdb";

async function main() {
    console.log("BEFORE:");

    console.log(await getAllNotes());

    deleteNote("1");

    console.log("AFTER:");

    console.log(await getAllNotes());
}

main();