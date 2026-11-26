// IndexedDB key-value store with automatic localStorage migration
const DB_NAME = "mraynar_portfolio_db";
const DB_VERSION = 1;
const STORE_NAME = "kv_store";
const SYNC_CHANNEL = "mraynar_portfolio_sync";
const SYNC_TS_KEY = "portfolio_sync_ts";

let dbPromise = null;

function openDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        resolve(null);
      };
      request.onblocked = () => {
        dbPromise = null;
        resolve(null);
      };
    } catch {
      dbPromise = null;
      resolve(null);
    }
  });

  return dbPromise;
}

function idbGet(db, key) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

function idbSet(db, key, value) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed"));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB write aborted"));
    } catch (err) {
      reject(err);
    }
  });
}

// Read persisted value, migrating any legacy localStorage record transparently
export async function getLocalItem(key) {
  const db = await openDb();
  if (db) {
    try {
      const existing = await idbGet(db, key);
      if (existing !== undefined) {
        return existing;
      }
    } catch {
      // Fall through to legacy localStorage check
    }
  }

  // Migrate existing data from legacy localStorage to prevent data loss
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (db) {
        try {
          await idbSet(db, key, parsed);
          localStorage.removeItem(key);
        } catch {
          // Keep legacy copy if migration write fails
        }
      }
      return parsed;
    }
  } catch {
    // Ignore corrupted legacy JSON
  }

  return null;
}

// Persist value durably in IndexedDB and throw on genuine storage failure
export async function setLocalItem(key, value) {
  const db = await openDb();
  if (db) {
    await idbSet(db, key, value);
    // Remove legacy localStorage copy to free 5MB origin quota
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore cleanup errors
    }
    return true;
  }

  // Fallback to localStorage only when IndexedDB is unavailable
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    if (err && err.name === "QuotaExceededError") {
      throw new Error(
        "Penyimpanan lokal browser penuh. Gunakan gambar lebih kecil atau aktifkan Supabase.",
        { cause: err }
      );
    }
    throw err;
  }
}

// Remove key from IndexedDB and legacy localStorage
export async function removeLocalItem(key) {
  const db = await openDb();
  if (db) {
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore cleanup errors
  }
}

// Notify current tab and other open tabs that persisted data changed
export function broadcastDataSync() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio_data_updated"));

  try {
    localStorage.setItem(SYNC_TS_KEY, String(Date.now()));
  } catch {
    // Ignore if storage is restricted
  }

  if (typeof BroadcastChannel !== "undefined") {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type: "updated", ts: Date.now() });
      channel.close();
    } catch {
      // Ignore BroadcastChannel restriction
    }
  }
}

// Subscribe to data updates across same-tab events and other tabs
export function subscribeDataSync(onUpdate) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e) => {
    if (!e || e.key === SYNC_TS_KEY || e.key === null) {
      onUpdate();
    }
  };

  window.addEventListener("portfolio_data_updated", onUpdate);
  window.addEventListener("storage", handleStorage);

  let channel = null;
  if (typeof BroadcastChannel !== "undefined") {
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = () => onUpdate();
    } catch {
      channel = null;
    }
  }

  return () => {
    window.removeEventListener("portfolio_data_updated", onUpdate);
    window.removeEventListener("storage", handleStorage);
    if (channel) {
      try {
        channel.close();
      } catch {
        // Ignore cleanup errors
      }
    }
  };
}
