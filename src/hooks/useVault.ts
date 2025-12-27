import { useState, useEffect, useCallback } from 'react';
import type { VaultEntry } from '@/types/vault';

// Mock initial data
const MOCK_ENTRIES: VaultEntry[] = [
  {
    id: '1',
    title: 'GitHub',
    username: 'john.doe@email.com',
    password: 'Gh$tR0ng!Pass2024',
    url: 'https://github.com',
    category: 'Development',
    lastModified: new Date('2024-01-15'),
    strength: 'strong'
  },
  {
    id: '2',
    title: 'Gmail',
    username: 'john.doe@gmail.com',
    password: 'password123',
    url: 'https://gmail.com',
    category: 'Email',
    lastModified: new Date('2024-01-10'),
    strength: 'weak'
  },
  {
    id: '3',
    title: 'Netflix',
    username: 'john.doe@email.com',
    password: 'NetflixSecure!99',
    url: 'https://netflix.com',
    category: 'Entertainment',
    lastModified: new Date('2024-01-20'),
    strength: 'strong'
  },
  {
    id: '4',
    title: 'LinkedIn',
    username: 'john.doe',
    password: 'LinkedIn2023!',
    url: 'https://linkedin.com',
    category: 'Professional',
    lastModified: new Date('2024-01-12'),
    strength: 'medium'
  },
  {
    id: '5',
    title: 'Amazon',
    username: 'john.doe@email.com',
    password: 'password123',
    url: 'https://amazon.com',
    category: 'Shopping',
    lastModified: new Date('2024-01-18'),
    strength: 'weak'
  }
];

export function useVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-lock after 5 minutes of inactivity
  const AUTO_LOCK_TIME = 5 * 60 * 1000;

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

  const unlock = (masterPassword: string) => {
    // Mock authentication
    if (masterPassword === 'demo' || masterPassword.length > 0) {
      setIsLocked(false);
      setEntries(MOCK_ENTRIES);
      return true;
    }
    return false;
  };

  const lock = () => {
    setIsLocked(true);
    setSearchQuery('');
    if (idleTimer) clearTimeout(idleTimer);
  };

  const addEntry = (entry: Omit<VaultEntry, 'id' | 'lastModified'>) => {
    const newEntry: VaultEntry = {
      ...entry,
      id: Date.now().toString(),
      lastModified: new Date()
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<VaultEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, ...updates, lastModified: new Date() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const filteredEntries = entries.filter(entry => {
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
    searchQuery,
    unlock,
    lock,
    addEntry,
    updateEntry,
    deleteEntry,
    setSearchQuery
  };
}
