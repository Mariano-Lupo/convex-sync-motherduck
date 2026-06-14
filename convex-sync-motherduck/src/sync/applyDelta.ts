import {
    insertNote,
    updateNote,
    deleteNote,
} from "./duckdb";

export type DeltaOperation =
    | "insert"
    | "update"
    | "delete";

export type Delta = {
    operation: DeltaOperation;
    id: string;
    title?: string;
    completed?: boolean;
    createdAt?: number;
    updatedAt?: number;
};

export async function applyDelta(
    delta: Delta
) {
    console.log(
        `APPLY DELTA: ${delta.operation}`
    );

    switch (delta.operation) {
        case "insert":
            insertNote({
                id: delta.id,
                title: delta.title ?? "",
                completed:
                    delta.completed ?? false,
                createdAt:
                    delta.createdAt ?? Date.now(),
                updatedAt:
                    delta.updatedAt ?? Date.now(),
            });
            break;

        case "update":
            updateNote({
                id: delta.id,
                title: delta.title ?? "",
                completed:
                    delta.completed ?? false,
                updatedAt:
                    delta.updatedAt ?? Date.now(),
            });
            break;

        case "delete":
            deleteNote(delta.id);
            break;
    }

    return delta.id;
}