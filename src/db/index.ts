import { openDB } from 'idb';

const DB_NAME = 'idiom_study_db';
const STORE_NAME = 'progress';

export interface Progress {
  idiomId: number;
  status: 'new' | 'learning' | 'mastered';
  lastReviewed: number;
  reviewCount: number;
}

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'idiomId' });
      }
    },
  });
}

export async function getProgress(id: number): Promise<Progress | undefined> {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function updateProgress(progress: Progress) {
  const db = await initDB();
  return db.put(STORE_NAME, progress);
}

export async function getAllProgress(): Promise<Progress[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
