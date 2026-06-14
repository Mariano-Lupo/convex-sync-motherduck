import { applyDelta, type Delta } from "./applyDelta";

export async function applyChanges(
    deltas: Delta[] = []
): Promise<number> {
    console.log("APPLY CHANGES START");

    let appliedChanges = 0;

    for (const delta of deltas) {
        await applyDelta(delta);
        appliedChanges++;
    }

    console.log(
        `APPLIED CHANGES: ${appliedChanges}`
    );

    console.log("APPLY CHANGES COMPLETE");

    return appliedChanges;
}