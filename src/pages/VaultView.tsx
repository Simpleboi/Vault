import { useState } from 'react';
import { Plus, Lock, Settings, Shield, Zap, LogOut, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaultSearch from '@/components/VaultSearch';
import VaultEntryCard from '@/components/VaultEntryCard';
import EntryModal from '@/components/EntryModal';
import CommandPalette from '@/components/CommandPalette';
import SecurityDashboard from '@/components/SecurityDashboard';
import CategoryFilter from '@/components/CategoryFilter';
import type { VaultEntry } from '@/types/vault';

interface VaultViewProps {
  entries: VaultEntry[];
  allEntries: VaultEntry[];
  searchQuery: string;
  selectedCategory: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onAddEntry: (entry: Omit<VaultEntry, 'id' | 'lastModified'>) => void;
  onUpdateEntry: (id: string, updates: Partial<VaultEntry>) => void;
  onLock: () => void;
}

export default function VaultView({
  entries,
  allEntries,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onAddEntry,
  onUpdateEntry,
  onLock
}: VaultViewProps) {
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false);

  const handleSave = (data: Partial<VaultEntry>) => {
    if (editingEntry) {
      onUpdateEntry(editingEntry.id, data);
    } else {
      onAddEntry(data as Omit<VaultEntry, 'id' | 'lastModified'>);
    }
    setEditingEntry(null);
    setIsAddingNew(false);
  };

  const weakPasswords = entries.filter(e => e.strength === 'weak').length;
  const reusedPasswords = new Set(entries.map(e => e.password)).size !== entries.length;

  return (
    <div className="min-h-screen noise-texture">
      {/* Header */}
      <header className="glass-panel border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="glass-panel rounded-lg p-2 glow-cyan">
                <Shield className="w-6 h-6 text-[#00d4ff]" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-black text-white">Vault</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 glass-panel rounded-lg text-sm text-white/60">
                <Command className="w-4 h-4" strokeWidth={2} />
                <span className="font-semibold">K</span>
                <span>Quick search</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10 text-white"
              >
                <Settings className="w-5 h-5" strokeWidth={2} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLock}
                className="hover:bg-white/10 text-white"
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Stats */}
        <div className="mb-8 space-y-4">
          <VaultSearch value={searchQuery} onChange={onSearchChange} />

          {/* Category Filter */}
          <CategoryFilter
            categories={Array.from(new Set(allEntries.map(e => e.category).filter(Boolean))) as string[]}
            selectedCategory={selectedCategory}
            onSelectCategory={onCategoryChange}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00d4ff]/20 rounded-lg">
                  <Lock className="w-5 h-5 text-[#00d4ff]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{entries.length}</p>
                  <p className="text-sm text-white/60">Total Passwords</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setShowSecurityDashboard(true)}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ff6b6b]/20 rounded-lg">
                  <Shield className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{weakPasswords}</p>
                  <p className="text-sm text-white/60">Weak Passwords</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ffd43b]/20 rounded-lg">
                  <Zap className="w-5 h-5 text-[#ffd43b]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">
                    {reusedPasswords ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-white/60">Reused Passwords</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <Lock className="w-16 h-16 text-white/20 mx-auto mb-4" strokeWidth={2} />
              <h3 className="text-xl font-bold text-white mb-2">No passwords found</h3>
              <p className="text-white/60 mb-6">
                {searchQuery ? 'Try a different search term' : 'Add your first password to get started'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold glow-cyan"
                >
                  <Plus className="w-5 h-5 mr-2" strokeWidth={2} />
                  Add Password
                </Button>
              )}
            </div>
          ) : (
            entries.map((entry) => (
              <VaultEntryCard
                key={entry.id}
                entry={entry}
                onEdit={setEditingEntry}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddingNew(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] shadow-2xl glow-cyan-strong hover:scale-110 active:scale-95 transition-all"
      >
        <Plus className="w-8 h-8" strokeWidth={2.5} />
      </Button>

      {/* Entry Modal */}
      {(editingEntry || isAddingNew) && (
        <EntryModal
          entry={editingEntry}
          onSave={handleSave}
          onClose={() => {
            setEditingEntry(null);
            setIsAddingNew(false);
          }}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        entries={entries}
        onSelectEntry={setEditingEntry}
        onAddNew={() => setIsAddingNew(true)}
      />

      {/* Security Dashboard */}
      {showSecurityDashboard && (
        <SecurityDashboard
          entries={entries}
          onFixEntry={setEditingEntry}
          onClose={() => setShowSecurityDashboard(false)}
        />
      )}
    </div>
  );
}
