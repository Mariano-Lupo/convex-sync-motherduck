import { runEngine } from "./engine";
import { getSyncState } from "./duckdb";

async function main() {
    await runEngine();

    const state = await getSyncState();

    console.log(state);
}

main();