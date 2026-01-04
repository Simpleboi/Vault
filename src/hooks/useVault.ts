import { useState, useEffect, useCallback, useRef } from 'react';
import type { VaultEntry } from '@/types/vault';
import { onAuthChange, signOut as firebaseSignOut } from '@/services/authService';
import {
  getPasswordEntries,
  addPasswordEntry,
  updatePasswordEntry,
  deletePasswordEntry
} from '@/services/firestoreService';
import { toast } from 'sonner';

// Auto-lock after 5 minutes of inactivity
const AUTO_LOCK_TIME = 5 * 60 * 1000;

export function useVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs for timer management to avoid re-render cascades
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lockingRef = useRef(false);

  // Listen for auth state changes (logout only)
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        // User logged out
        setUserId(null);
        setIsLocked(true);
        setEntries([]);
        setEncryptionKey(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Lock vault
  const lock = useCallback(async () => {
    // Prevent multiple simultaneous lock calls
    if (lockingRef.current) return;
    lockingRef.current = true;

    try {
      // Clear any pending idle timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      await firebaseSignOut();
      setIsLocked(true);
      setSearchQuery('');
      setSelectedCategory(null);
      setEntries([]);
      setUserId(null);
      setEncryptionKey(null); // Clear encryption key from memory
      toast.success('Vault locked');
    } catch (error: any) {
      toast.error('Failed to lock vault');
      console.error('Error locking vault:', error);
    } finally {
      lockingRef.current = false;
    }
  }, []);

  // Function to unlock vault with encryption key
  const unlockVault = useCallback(async (uid: string, key: CryptoKey) => {
    setUserId(uid);
    setEncryptionKey(key);
    setIsLocked(false);

    // Load encrypted entries
    setIsLoading(true);
    try {
      const fetchedEntries = await getPasswordEntries(uid, key);
      setEntries(fetchedEntries);
    } catch (error: any) {
      toast.error('Failed to load passwords');
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    // Clear existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Set new timer
    idleTimerRef.current = setTimeout(() => {
      lock();
    }, AUTO_LOCK_TIME);
  }, [lock]);

  useEffect(() => {
    if (!isLocked) {
      resetIdleTimer();

      // Reset timer on user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        window.addEventListener(event, resetIdleTimer);
      });

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetIdleTimer);
        });
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
          idleTimerRef.current = null;
        }
      };
    }
  }, [isLocked, resetIdleTimer]);

  // Add new entry
  const addEntry = async (entry: Omit<VaultEntry, 'id' | 'lastModified'>) => {
    if (!userId || !encryptionKey) {
      toast.error('You must be logged in to add entries');
      return;
    }

    setIsLoading(true);
    try {
      const newEntryId = await addPasswordEntry(userId, entry, encryptionKey);
      const newEntry: VaultEntry = {
        ...entry,
        id: newEntryId,
        lastModified: new Date()
      };
      setEntries(prev => [newEntry, ...prev]);
      toast.success('Password added');
    } catch (error: any) {
      toast.error('Failed to add password');
      console.error('Error adding entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update entry
  const updateEntry = async (id: string, updates: Partial<VaultEntry>) => {
    if (!encryptionKey) {
      toast.error('Encryption key not available');
      return;
    }

    setIsLoading(true);
    try {
      await updatePasswordEntry(id, updates, encryptionKey);
      setEntries(prev =>
        prev.map(entry =>
          entry.id === id
            ? { ...entry, ...updates, lastModified: new Date() }
            : entry
        )
      );
      toast.success('Password updated');
    } catch (error: any) {
      toast.error('Failed to update password');
      console.error('Error updating entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    setIsLoading(true);
    try {
      await deletePasswordEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success('Password deleted');
    } catch (error: any) {
      toast.error('Failed to delete password');
      console.error('Error deleting entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    // Filter by category
    if (selectedCategory && entry.category !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query) ||
      entry.url?.toLowerCase().includes(query) ||
      entry.category?.toLowerCase().includes(query)
    );
  });

  return {
    isLocked,
    entries: filteredEntries,
    allEntries: entries,
    searchQuery,
    selectedCategory,
    isLoading,
    lock,
    unlockVault,
    addEntry,
    updateEntry,
    deleteEntry,
    setSearchQuery,
    setSelectedCategory
  };
}
