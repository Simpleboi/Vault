import { useVault } from '@/hooks/useVault';
import LockScreen from '@/pages/LockScreen';
import VaultView from '@/pages/VaultView';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/services/authService';

function Home() {
  const {
    isLocked,
    entries,
    allEntries,
    searchQuery,
    selectedCategory,
    lock,
    unlockVault,
    addEntry,
    updateEntry,
    setSearchQuery,
    setSelectedCategory
  } = useVault();

  // Handle successful authentication with encryption key
  const handleAuthenticated = async (encryptionKey: CryptoKey) => {
    const user = getCurrentUser();
    if (user) {
      await unlockVault(user.uid, encryptionKey);
    }
  };

  if (isLocked) {
    return (
      <>
        <LockScreen onAuthenticated={handleAuthenticated} />
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
