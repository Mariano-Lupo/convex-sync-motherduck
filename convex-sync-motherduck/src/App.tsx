import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";


export default function App() {
  const notes = useQuery(api.messages.listNotes);

  const addNote = useMutation(api.messages.addNote);
  const deleteNote = useMutation(api.messages.deleteNote);
  const updateNote = useMutation(api.messages.updateNote);
  const toggleCompleted = useMutation(api.messages.toggleCompleted);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!notes) return;
    console.log("notes loaded:", notes.length);
  }, [notes]);

  if (!notes) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Notes App</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a note..."
      />

      <button
        onClick={async () => {
          await addNote({ title: text });
          setText("");
        }}
      >
        Add Note
      </button>

      <hr />

      {notes.map((note) => (
        <div key={note._id} style={{ marginBottom: 10 }}>
          {editingId === note._id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <button
                onClick={async () => {
                  await updateNote({
                    id: note._id,
                    title: editText,
                  });
                  setEditingId(null);
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div>
                {note.completed ? "✅" : "⬜"} {note.title}
              </div>

              <small style={{ color: "gray" }}>
                Created: {new Date(note.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(note.updatedAt).toLocaleString()}
              </small>

              <button
                onClick={() => {
                  setEditingId(note._id);
                  setEditText(note.title);
                }}
              >
                Edit
              </button>

              <button onClick={() => deleteNote({ id: note._id })}>
                Delete
              </button>

              <button
                onClick={() =>
                  toggleCompleted({
                    id: note._id,
                  })
                }
              >
                Complete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}