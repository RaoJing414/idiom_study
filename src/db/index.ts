import { openDB, type IDBPDatabase } from 'idb';
import type { Progress } from '../types';

const DB_NAME = 'idiom_study_db';
const STORE_NAME = 'progress';

let dbPromise: Promise<IDBPDatabase> | null = null;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'idiomId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getProgress(id: number): Promise<Progress | undefined> {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function updateProgress(progress: Progress) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put(progress);
  await tx.done;
}

export async function getAllProgress(): Promise<Progress[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
