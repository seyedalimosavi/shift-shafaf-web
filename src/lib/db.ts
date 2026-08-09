/** IndexedDB storage for day notes and the roster image blob. */

export interface DayNote {
  dateKey: string;
  noteText: string;
  updatedAt: number;
}

const DB_NAME = "shiftkar-db";
const DB_VERSION = 1;
const NOTES_STORE = "day_notes";
const FILES_STORE = "files";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          db.createObjectStore(NOTES_STORE, { keyPath: "dateKey" });
        }
        if (!db.objectStoreNames.contains(FILES_STORE)) {
          db.createObjectStore(FILES_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
      }),
  );
}

export async function getAllNotes(): Promise<DayNote[]> {
  try {
    const rows = await tx<DayNote[]>(NOTES_STORE, "readonly", (s) => s.getAll());
    return rows.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  } catch {
    return [];
  }
}

export async function getNote(dateKey: string): Promise<DayNote | undefined> {
  try {
    return await tx<DayNote | undefined>(NOTES_STORE, "readonly", (s) => s.get(dateKey));
  } catch {
    return undefined;
  }
}

/** Saving trimmed-empty text deletes the note, as in the source. */
export async function saveNote(dateKey: string, noteText: string): Promise<void> {
  const trimmed = noteText.trim();
  if (!trimmed) {
    await deleteNote(dateKey);
    return;
  }
  await tx<IDBValidKey>(NOTES_STORE, "readwrite", (s) =>
    s.put({ dateKey, noteText: trimmed, updatedAt: Date.now() } satisfies DayNote),
  );
}

export async function deleteNote(dateKey: string): Promise<void> {
  try {
    await tx<undefined>(NOTES_STORE, "readwrite", (s) => s.delete(dateKey));
  } catch {
    /* ignore */
  }
}

export async function putFile(key: string, blob: Blob): Promise<void> {
  await tx<IDBValidKey>(FILES_STORE, "readwrite", (s) => s.put(blob, key));
}

export async function getFile(key: string): Promise<Blob | undefined> {
  try {
    return await tx<Blob | undefined>(FILES_STORE, "readonly", (s) => s.get(key));
  } catch {
    return undefined;
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    await tx<undefined>(FILES_STORE, "readwrite", (s) => s.delete(key));
  } catch {
    /* ignore */
  }
}
