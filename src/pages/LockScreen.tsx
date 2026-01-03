import { useState, FormEvent } from 'react';
import { Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LockScreenProps {
  onUnlock: (password: string) => boolean;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onUnlock(password);
    
    if (!success) {
      setError('Invalid master password');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center noise-texture p-4">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <div className="absolute inset-0 glow-cyan-strong rounded-full blur-xl"></div>
            <div className="relative glass-panel rounded-full p-6">
              <Shield className="w-16 h-16 text-[#00d4ff]" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            Vault
          </h1>
          <p className="text-sm text-white/60">
            Enter your master password to unlock
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
                  placeholder="Enter master password"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-[#ff6b6b] animate-in fade-in slide-in-from-top-1 duration-300">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-14 bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold text-base active:scale-95 transition-all glow-cyan"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Unlocking...
                </span>
              ) : (
                'Unlock Vault'
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Demo: Enter any password to unlock
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-300">
          <p className="text-xs text-white/30">
            Protected by end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}
