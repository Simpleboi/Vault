import { useVault } from '@/hooks/useVault';
import LockScreen from '@/pages/LockScreen';
import VaultView from '@/pages/VaultView';
import { Toaster } from '@/components/ui/sonner';

function Home() {
  const {
    isLocked,
    entries,
    allEntries,
    searchQuery,
    selectedCategory,
    unlock,
    lock,
    addEntry,
    updateEntry,
    setSearchQuery,
    setSelectedCategory
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
        allEntries={allEntries}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onAddEntry={addEntry}
        onUpdateEntry={updateEntry}
        onLock={lock}
      />
      <Toaster position="top-right" />
    </>
  );
}

export default Home
