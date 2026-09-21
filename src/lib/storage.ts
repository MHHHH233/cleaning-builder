import localforage from "localforage";
import { BuilderState } from "@/types/builder";

// Initialize localForage store for zero-server IndexedDB storage
const stateStore = typeof window !== "undefined"
  ? localforage.createInstance({
      name: "CleaningBusinessLaunchKit",
      storeName: "site_state",
    })
  : null;

const imageStore = typeof window !== "undefined"
  ? localforage.createInstance({
      name: "CleaningBusinessLaunchKit",
      storeName: "user_images",
    })
  : null;

const STATE_KEY = "active_site_config";

/**
 * Save site-config.json state into IndexedDB
 */
export async function saveSiteStateToIndexedDB(state: BuilderState): Promise<void> {
  if (!stateStore) return;
  try {
    await stateStore.setItem(STATE_KEY, state);
  } catch (err) {
    console.warn("Failed to save state to localForage:", err);
  }
}

/**
 * Load site-config.json state from IndexedDB
 */
export async function loadSiteStateFromIndexedDB(): Promise<BuilderState | null> {
  if (!stateStore) return null;
  try {
    const saved = await stateStore.getItem<BuilderState>(STATE_KEY);
    return saved || null;
  } catch (err) {
    console.warn("Failed to load state from localForage:", err);
    return null;
  }
}

export interface StoredImageRecord {
  id: string;
  filename: string;
  blob: Blob;
  mimeType: string;
  previewUrl: string;
  createdAt: number;
}

/**
 * Store user uploaded image Blob in IndexedDB and return preview URL
 */
export async function storeUserImageBlob(
  id: string,
  file: File | Blob,
  filename?: string
): Promise<{ previewUrl: string; imageId: string }> {
  const previewUrl = URL.createObjectURL(file);
  const name = filename || (file instanceof File ? file.name : `img_${id}.jpg`);

  if (imageStore) {
    try {
      const record: StoredImageRecord = {
        id,
        filename: name,
        blob: file,
        mimeType: file.type || "image/jpeg",
        previewUrl,
        createdAt: Date.now(),
      };
      await imageStore.setItem(id, record);
    } catch (e) {
      console.warn("Error storing blob in localForage:", e);
    }
  }

  return { previewUrl, imageId: id };
}

/**
 * Retrieve all user uploaded image Blobs for JSZip export into public/images/
 */
export async function getAllStoredImageBlobs(): Promise<StoredImageRecord[]> {
  if (!imageStore) return [];
  const records: StoredImageRecord[] = [];
  try {
    await imageStore.iterate<StoredImageRecord, void>((value) => {
      if (value && value.blob) {
        records.push(value);
      }
    });
  } catch (e) {
    console.warn("Error reading image blobs from localForage:", e);
  }
  return records;
}
