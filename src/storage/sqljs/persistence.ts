const DB_STORE_NAME = 'sqljs_databases';
const DB_VERSION = 1;

function openIndexedDB(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME);
      }
    };
  });
}

export async function saveToIndexedDB(dbName: string, data: Uint8Array): Promise<void> {
  try {
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data, 'database');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please free up space.');
    }
    throw error;
  }
}

export async function loadFromIndexedDB(dbName: string): Promise<Uint8Array | null> {
  try {
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([DB_STORE_NAME], 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get('database');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result instanceof Uint8Array ? result : null);
      };
    });
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
    return null;
  }
}
