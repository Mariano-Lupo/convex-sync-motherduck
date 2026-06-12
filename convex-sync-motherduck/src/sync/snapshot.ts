export function runSnapshot(notes: any[]) {
    console.log("SNAPSHOT START");

    const destination = notes.map((note) => ({

        id: note._id,
        title: note.title,
        completed: note.completed,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
    }));

    console.log("SNAPSHOT COMPLETE");
    console.log("ROWS:", destination.length);

    return destination;

}