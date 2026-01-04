import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { VaultEntry } from '@/types/vault';
import { encrypt, decrypt } from './encryptionService';

const COLLECTION_NAME = 'passwords';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Encrypt sensitive fields of an entry
const encryptEntry = async (
  entry: Omit<VaultEntry, 'id' | 'lastModified'>,
  encryptionKey: CryptoKey
) => {
  const encryptedPassword = await encrypt(entry.password, encryptionKey);
  const encryptedUsername = await encrypt(entry.username, encryptionKey);
  const encryptedNotes = entry.notes ? await encrypt(entry.notes, encryptionKey) : null;

  const encryptedData: any = {
    title: entry.title, // Title is not encrypted for searchability
    username: encryptedUsername.encrypted,
    usernameIV: encryptedUsername.iv,
    password: encryptedPassword.encrypted,
    passwordIV: encryptedPassword.iv,
    notes: encryptedNotes?.encrypted || null,
    notesIV: encryptedNotes?.iv || null,
  };

  // Only include optional fields if they have defined values (Firestore doesn't accept undefined)
  if (entry.url !== undefined) encryptedData.url = entry.url;
  if (entry.category !== undefined) encryptedData.category = entry.category;
  if (entry.strength !== undefined) encryptedData.strength = entry.strength;
  if (entry.isCompromised !== undefined) encryptedData.isCompromised = entry.isCompromised;

  return encryptedData;
};

// Decrypt sensitive fields of an entry
const decryptEntry = async (
  data: any,
  encryptionKey: CryptoKey
): Promise<Omit<VaultEntry, 'id' | 'lastModified'>> => {
  const username = await decrypt(data.username, data.usernameIV, encryptionKey);
  const password = await decrypt(data.password, data.passwordIV, encryptionKey);
  const notes = data.notes ? await decrypt(data.notes, data.notesIV, encryptionKey) : undefined;

  return {
    title: data.title,
    username,
    password,
    notes,
    url: data.url,
    category: data.category,
    strength: data.strength,
    isCompromised: data.isCompromised
  };
};

// Get all password entries for a user
export const getPasswordEntries = async (
  userId: string,
  encryptionKey: CryptoKey
): Promise<VaultEntry[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const entries = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const decryptedData = await decryptEntry(data, encryptionKey);

        return {
          id: docSnapshot.id,
          ...decryptedData,
          lastModified: convertTimestamp(data.lastModified)
        } as VaultEntry;
      })
    );

    return entries;
  } catch (error) {
    console.error('Error getting password entries:', error);
    throw error;
  }
};

// Add a new password entry
export const addPasswordEntry = async (
  userId: string,
  entry: Omit<VaultEntry, 'id' | 'lastModified'>,
  encryptionKey: CryptoKey
): Promise<string> => {
  try {
    const encryptedData = await encryptEntry(entry, encryptionKey);

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      ...encryptedData,
      lastModified: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding password entry:', error);
    throw error;
  }
};

// Update an existing password entry
export const updatePasswordEntry = async (
  entryId: string,
  updates: Partial<VaultEntry>,
  encryptionKey: CryptoKey
): Promise<void> => {
  try {
    // Encrypt only the fields that are being updated and are sensitive
    const encryptedUpdates: any = { ...updates };

    if (updates.password) {
      const encryptedPassword = await encrypt(updates.password, encryptionKey);
      encryptedUpdates.password = encryptedPassword.encrypted;
      encryptedUpdates.passwordIV = encryptedPassword.iv;
    }

    if (updates.username) {
      const encryptedUsername = await encrypt(updates.username, encryptionKey);
      encryptedUpdates.username = encryptedUsername.encrypted;
      encryptedUpdates.usernameIV = encryptedUsername.iv;
    }

    if (updates.notes !== undefined) {
      if (updates.notes) {
        const encryptedNotes = await encrypt(updates.notes, encryptionKey);
        encryptedUpdates.notes = encryptedNotes.encrypted;
        encryptedUpdates.notesIV = encryptedNotes.iv;
      } else {
        encryptedUpdates.notes = null;
        encryptedUpdates.notesIV = null;
      }
    }

    // Remove the lastModified field if it exists in updates
    delete encryptedUpdates.lastModified;

    const docRef = doc(db, COLLECTION_NAME, entryId);
    await updateDoc(docRef, {
      ...encryptedUpdates,
      lastModified: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating password entry:', error);
    throw error;
  }
};

// Delete a password entry
export const deletePasswordEntry = async (entryId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, entryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting password entry:', error);
    throw error;
  }
};
