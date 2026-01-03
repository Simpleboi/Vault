import { useState, FormEvent } from 'react';
import { Lock, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LockScreenProps {
  onUnlock: (email: string, password: string) => Promise<boolean>;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onUnlock(email, password);

      if (!success) {
        setError('Invalid email or password');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unlock vault');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
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
            Sign in to unlock your vault
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
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
              disabled={isLoading || !email || !password}
              className="w-full h-14 bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold text-base active:scale-95 transition-all glow-cyan"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Info hint */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Create an account in Firebase Console to get started
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-300">
          <p className="text-xs text-white/30">
            Protected by Firebase Authentication & Firestore
          </p>
        </div>
      </div>
    </div>
  );
}
