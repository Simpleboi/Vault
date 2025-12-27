export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  lastModified: Date;
  strength?: 'weak' | 'medium' | 'strong';
  isCompromised?: boolean;
}

export interface VaultState {
  isLocked: boolean;
  entries: VaultEntry[];
  searchQuery: string;
  selectedEntry: VaultEntry | null;
}
