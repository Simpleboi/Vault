import { useState, useEffect, useCallback } from 'react';
import type { VaultEntry } from '@/types/vault';
import { onAuthChange, signOut as firebaseSignOut } from '@/services/authService';
import {
  getPasswordEntries,
  addPasswordEntry,
  updatePasswordEntry,
  deletePasswordEntry
} from '@/services/firestoreService';
import { toast } from 'sonner';

export function useVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-lock after 5 minutes of inactivity
  const AUTO_LOCK_TIME = 5 * 60 * 1000;

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUserId(user.uid);
        setIsLocked(false);
        loadEntries(user.uid);
      } else {
        setUserId(null);
        setIsLocked(true);
        setEntries([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load entries from Firestore
  const loadEntries = async (uid: string) => {
    setIsLoading(true);
    try {
      const fetchedEntries = await getPasswordEntries(uid);
      setEntries(fetchedEntries);
    } catch (error: any) {
      toast.error('Failed to load passwords');
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetIdleTimer = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer);

    if (!isLocked) {
      const timer = setTimeout(() => {
        setIsLocked(true);
      }, AUTO_LOCK_TIME);
      setIdleTimer(timer);
    }
  }, [isLocked, idleTimer]);

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
        if (idleTimer) clearTimeout(idleTimer);
      };
    }
  }, [isLocked, resetIdleTimer]);

  // Lock vault
  const lock = async () => {
    try {
      await firebaseSignOut();
      setIsLocked(true);
      setSearchQuery('');
      setSelectedCategory(null);
      setEntries([]);
      setUserId(null);
      if (idleTimer) clearTimeout(idleTimer);
      toast.success('Vault locked');
    } catch (error: any) {
      toast.error('Failed to lock vault');
      console.error('Error locking vault:', error);
    }
  };

  // Add new entry
  const addEntry = async (entry: Omit<VaultEntry, 'id' | 'lastModified'>) => {
    if (!userId) {
      toast.error('You must be logged in to add entries');
      return;
    }

    setIsLoading(true);
    try {
      const newEntryId = await addPasswordEntry(userId, entry);
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
    setIsLoading(true);
    try {
      await updatePasswordEntry(id, updates);
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
    addEntry,
    updateEntry,
    deleteEntry,
    setSearchQuery,
    setSelectedCategory
  };
}
