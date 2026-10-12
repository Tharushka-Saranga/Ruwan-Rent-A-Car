// IndexedDB utility for persistent caching of scroll animation zip & frames
const DB_NAME = 'RuwanCarRentalsDB';
const DB_VERSION = 1;
const STORE_NAME = 'animation_assets';
const ZIP_KEY = 'ezgif_scroll_zip';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveZipToIndexedDB(file: Blob, fileName: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ blob: file, name: fileName, timestamp: Date.now() }, ZIP_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save zip in IndexedDB:', err);
  }
}

export async function getZipFromIndexedDB(): Promise<{ blob: Blob; name: string } | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(ZIP_KEY);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve({ blob: req.result.blob, name: req.result.name || 'ezgif-1e2ea1fba47432e6-jpg.zip' });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearZipFromIndexedDB(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(ZIP_KEY);
  } catch (err) {
    console.warn('Failed to clear zip from IndexedDB:', err);
  }
}
