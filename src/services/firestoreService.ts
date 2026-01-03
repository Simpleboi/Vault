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

const COLLECTION_NAME = 'passwords';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Get all password entries for a user
export const getPasswordEntries = async (userId: string): Promise<VaultEntry[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        username: data.username,
        password: data.password,
        url: data.url,
        notes: data.notes,
        category: data.category,
        lastModified: convertTimestamp(data.lastModified),
        strength: data.strength,
        isCompromised: data.isCompromised
      } as VaultEntry;
    });
  } catch (error) {
    console.error('Error getting password entries:', error);
    throw error;
  }
};

// Add a new password entry
export const addPasswordEntry = async (
  userId: string,
  entry: Omit<VaultEntry, 'id' | 'lastModified'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      ...entry,
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
  updates: Partial<VaultEntry>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, entryId);
    await updateDoc(docRef, {
      ...updates,
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
