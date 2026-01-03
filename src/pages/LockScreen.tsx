import { useState, FormEvent } from 'react';
import { Lock, Shield, Mail, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn, signUp } from '@/services/authService';
import { getOrCreateUserSalt } from '@/services/userService';
import { deriveKey } from '@/services/encryptionService';
import { toast } from 'sonner';

type AuthMode = 'signin' | 'signup';

interface LockScreenProps {
  onAuthenticated: (encryptionKey: CryptoKey) => void;
}

export default function LockScreen({ onAuthenticated }: LockScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      let user;

      if (mode === 'signin') {
        user = await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        user = await signUp(email, password);
        toast.success('Account created successfully!');
      }

      // Get or create salt for the user
      const salt = await getOrCreateUserSalt(user.uid);

      // Derive encryption key from password and salt
      const encryptionKey = await deriveKey(password, salt);

      // Pass encryption key to parent (will be stored in useVault)
      onAuthenticated(encryptionKey);

      // Clear password from memory
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const errorMessage = err.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`;
      setError(errorMessage);
      toast.error(errorMessage);
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setPassword('');
    setConfirmPassword('');
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
            {mode === 'signin' ? 'Sign in to unlock your vault' : 'Create your secure vault'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 glass-panel rounded-lg">
            <button
              type="button"
              onClick={() => mode === 'signup' && switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
                mode === 'signin'
                  ? 'bg-[#00d4ff] text-[#0a0e14]'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <LogIn className="w-4 h-4" strokeWidth={2} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => mode === 'signin' && switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
                mode === 'signup'
                  ? 'bg-[#00d4ff] text-[#0a0e14]'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <UserPlus className="w-4 h-4" strokeWidth={2} />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="pl-12 h-12 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
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
                  className="pl-12 h-12 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/30 focus:border-[#00d4ff] focus:ring-[#00d4ff] focus:ring-2"
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-[#ff6b6b] animate-in fade-in slide-in-from-top-1 duration-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password || (mode === 'signup' && !confirmPassword)}
              className="w-full h-12 bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold text-base active:scale-95 transition-all glow-cyan"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Info hint */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              {mode === 'signin'
                ? "Don't have an account? Click Sign Up above"
                : 'Your passwords are encrypted with AES-256-GCM'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-300">
          <p className="text-xs text-white/30">
            Client-side encryption • Zero-knowledge architecture
          </p>
        </div>
      </div>
    </div>
  );
}
