import { openDB } from "idb";

const DB_NAME = "myAppDB";
const STORE_NAME = "keys";

async function getDB() {
  // Open DB with version 1
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // This will only run if DB is new
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  // Ensure store exists even if DB already existed
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    // bump version to 2 to create store
    await db.close();
    const newDb = await openDB(DB_NAME, db.version + 1, {
      upgrade(upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
          upgradeDb.createObjectStore(STORE_NAME);
        }
      },
    });
    return newDb;
  }

  return db;
}
export async function putKey(keyName: string, key: CryptoKey) {
  const db = await getDB();
  await db.put(STORE_NAME, key, keyName);
}

export async function getKey(keyName: string): Promise<CryptoKey | null> {
  const db = await getDB();
  return db.get(STORE_NAME, keyName);
}