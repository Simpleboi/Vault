import { useVault } from '@/hooks/useVault';
import LockScreen from '@/pages/LockScreen';
import VaultView from '@/pages/VaultView';
import { Toaster } from '@/components/ui/sonner';

function Home() {
  const {
    isLocked,
    entries,
    searchQuery,
    unlock,
    lock,
    addEntry,
    updateEntry,
    setSearchQuery
  } = useVault();

  if (isLocked) {
    return (
      <>
        <LockScreen onUnlock={unlock} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <VaultView
        entries={entries}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddEntry={addEntry}
        onUpdateEntry={updateEntry}
        onLock={lock}
      />
      <Toaster position="top-right" />
    </>
  );
}

export default Home
