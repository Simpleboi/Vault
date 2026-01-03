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
    category: 'Coding',
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
    category: 'Work',
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
  },
  {
    id: '6',
    title: 'Canvas LMS',
    username: 'student.johndoe',
    password: 'School!Pass2024',
    url: 'https://canvas.instructure.com',
    category: 'School',
    lastModified: new Date('2024-01-22'),
    strength: 'strong'
  },
  {
    id: '7',
    title: 'Google Drive (School)',
    username: 'john.doe@university.edu',
    password: 'MyDrive123',
    url: 'https://drive.google.com',
    category: 'School',
    lastModified: new Date('2024-01-19'),
    strength: 'medium'
  },
  {
    id: '8',
    title: 'Slack (Work)',
    username: 'john.doe@company.com',
    password: 'SlackSecure!2024',
    url: 'https://company.slack.com',
    category: 'Work',
    lastModified: new Date('2024-01-21'),
    strength: 'strong'
  },
  {
    id: '9',
    title: 'GitLab',
    username: 'johndoe',
    password: 'GitLab$2024Pass',
    url: 'https://gitlab.com',
    category: 'Coding',
    lastModified: new Date('2024-01-17'),
    strength: 'strong'
  },
  {
    id: '10',
    title: 'Stack Overflow',
    username: 'john_doe_dev',
    password: 'stackoverflow123',
    url: 'https://stackoverflow.com',
    category: 'Coding',
    lastModified: new Date('2024-01-14'),
    strength: 'weak'
  },
  {
    id: '11',
    title: 'Jira (Work)',
    username: 'john.doe@company.com',
    password: 'JiraWork2024!',
    url: 'https://company.atlassian.net',
    category: 'Work',
    lastModified: new Date('2024-01-16'),
    strength: 'strong'
  },
  {
    id: '12',
    title: 'Zoom (School)',
    username: 'john.doe@university.edu',
    password: 'ZoomClass2024',
    url: 'https://zoom.us',
    category: 'School',
    lastModified: new Date('2024-01-13'),
    strength: 'medium'
  }
];

export function useVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    if (masterPassword === 'something') {
      setIsLocked(false);
      setEntries(MOCK_ENTRIES);
      return true;
    }
    return false;
  };

  const lock = () => {
    setIsLocked(true);
    setSearchQuery('');
    setSelectedCategory(null);
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
    unlock,
    lock,
    addEntry,
    updateEntry,
    deleteEntry,
    setSearchQuery,
    setSelectedCategory
  };
}
