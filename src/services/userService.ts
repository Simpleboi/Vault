import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateSalt, saltToHex, hexToSalt } from './encryptionService';

const USERS_COLLECTION = 'users';

interface UserData {
  salt: string; // Stored as hex string
  createdAt: Date;
}

/**
 * Get user's salt from Firestore
 * If user doesn't exist, returns null
 */
export const getUserSalt = async (userId: string): Promise<Uint8Array | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data() as UserData;
    return hexToSalt(data.salt);
  } catch (error) {
    console.error('Error getting user salt:', error);
    throw error;
  }
};

/**
 * Create user document with a new salt
 * Called when a new user signs up
 */
export const createUserWithSalt = async (userId: string): Promise<Uint8Array> => {
  try {
    const salt = generateSalt();
    const saltHex = saltToHex(salt);

    await setDoc(doc(db, USERS_COLLECTION, userId), {
      salt: saltHex,
      createdAt: new Date()
    });

    return salt;
  } catch (error) {
    console.error('Error creating user with salt:', error);
    throw error;
  }
};

/**
 * Get or create user salt
 * If user exists, returns their salt
 * If user is new, creates a new salt and stores it
 */
export const getOrCreateUserSalt = async (userId: string): Promise<Uint8Array> => {
  const existingSalt = await getUserSalt(userId);

  if (existingSalt) {
    return existingSalt;
  }

  return createUserWithSalt(userId);
};
