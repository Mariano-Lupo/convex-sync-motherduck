import duckdb from "duckdb";

const dbPath = process.env.DUCKDB_PATH ?? "sync.duckdb";
const db = new duckdb.Database(dbPath);

export function createConnection() {
    return db.connect();
}

export function createNotesTable() {
    const conn = createConnection();

    conn.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT,
      completed BOOLEAN,
      createdAt BIGINT,
      updatedAt BIGINT
    )
  `);

    conn.close();
}


export function getAllNotes(): Promise<any[]> {
    const conn = createConnection();

    return new Promise((resolve, reject) => {
        conn.all(
            `
      SELECT *
      FROM notes
      `,
            (err, rows) => {
                conn.close();

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);
            }
        );
    });
}


export function insertNote(note: {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
}) {
    const conn = createConnection();

    conn.run(`
    INSERT OR REPLACE INTO notes
    VALUES (
      '${note.id}',
      '${note.title}',
      ${note.completed},
      ${note.createdAt},
      ${note.updatedAt}
    )
  `);

    conn.close();
}


export function clearNotesTable() {
    const conn = createConnection();

    conn.run(`DELETE FROM notes`);

    conn.close();
}


export function createSyncStateTable() {
    const conn = createConnection();

    conn.run(`
    CREATE TABLE IF NOT EXISTS sync_state (
      table_name TEXT PRIMARY KEY,
      phase TEXT,
      last_cursor TEXT,
      snapshot_ts TEXT,
      rows_applied BIGINT,
      last_error TEXT,
      updated_at BIGINT
    )
  `);

    conn.close();
}


export function saveSyncState(
    tableName: string,
    phase: string,
    cursor: string | null,
    snapshotTs: string | null,
    rowsApplied: number,
    lastError: string | null
) {
    const conn = createConnection();

    const safeError =
        lastError
            ? lastError.split("'").join("''")
            : null;

    const sql = `
      INSERT OR REPLACE INTO sync_state
      VALUES (
        '${tableName}',
        '${phase}',
        ${cursor ? `'${cursor}'` : 'NULL'},
        ${snapshotTs ? `'${snapshotTs}'` : 'NULL'},
        ${rowsApplied},
        ${safeError ? `'${safeError}'` : 'NULL'},
        ${Date.now()}
      )
    `;

    console.log("SQL:");
    console.log(sql);

    conn.run(sql);

    conn.close();
}


export function getSyncState(): Promise<any[]> {
    const conn = createConnection();

    return new Promise((resolve, reject) => {
        conn.all(
            `
      SELECT *
      FROM sync_state
      `,
            (err, rows) => {
                conn.close();

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);
            }
        );
    });
}


export async function getSyncStateForTable(
    tableName: string
): Promise<any | null> {
    const conn = createConnection();

    return new Promise((resolve, reject) => {
        conn.all(
            `
      SELECT *
      FROM sync_state
      WHERE table_name = '${tableName}'
      `,
            (err, rows) => {
                conn.close();

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows[0] ?? null);
            }
        );
    });
}


export function deleteNote(id: string) {
    const conn = createConnection();

    conn.run(`
    DELETE FROM notes
    WHERE id = '${id}'
  `);

    conn.close();
}


export function updateNote(note: {
    id: string;
    title: string;
    completed: boolean;
    updatedAt: number;
}) {
    const conn = createConnection();

    conn.run(`
        UPDATE notes
        SET
            title = '${note.title}',
            completed = ${note.completed},
            updatedAt = ${note.updatedAt}
        WHERE id = '${note.id}'
    `);

    conn.close();
}