import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Lock, Plus } from 'lucide-react';
import type { VaultEntry } from '@/types/vault';

interface CommandPaletteProps {
  entries: VaultEntry[];
  onSelectEntry: (entry: VaultEntry) => void;
  onAddNew: () => void;
}

export default function CommandPalette({ entries, onSelectEntry, onAddNew }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search passwords or actions..." className="text-white" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions" className="text-white/60">
          <CommandItem
            onSelect={() => {
              onAddNew();
              setOpen(false);
            }}
            className="text-white hover:bg-white/10"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
            <span>Add New Password</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Passwords" className="text-white/60">
          {entries.map((entry) => (
            <CommandItem
              key={entry.id}
              onSelect={() => {
                onSelectEntry(entry);
                setOpen(false);
              }}
              className="text-white hover:bg-white/10"
            >
              <Lock className="mr-2 h-4 w-4" strokeWidth={2} />
              <div className="flex-1 flex items-center justify-between">
                <span>{entry.title}</span>
                <span className="text-sm text-white/40">{entry.username}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
