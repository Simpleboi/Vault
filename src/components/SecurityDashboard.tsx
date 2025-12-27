import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VaultEntry } from '@/types/vault';

interface SecurityDashboardProps {
  entries: VaultEntry[];
  onFixEntry: (entry: VaultEntry) => void;
  onClose: () => void;
}

export default function SecurityDashboard({ entries, onFixEntry, onClose }: SecurityDashboardProps) {
  const weakPasswords = entries.filter(e => e.strength === 'weak');
  const mediumPasswords = entries.filter(e => e.strength === 'medium');
  const strongPasswords = entries.filter(e => e.strength === 'strong');
  
  // Check for reused passwords
  const passwordCount = new Map<string, VaultEntry[]>();
  entries.forEach(entry => {
    const existing = passwordCount.get(entry.password) || [];
    passwordCount.set(entry.password, [...existing, entry]);
  });
  
  const reusedPasswords = Array.from(passwordCount.entries())
    .filter(([_, entries]) => entries.length > 1)
    .flatMap(([_, entries]) => entries);

  const securityScore = Math.round(
    ((strongPasswords.length / Math.max(entries.length, 1)) * 50) +
    ((entries.length - reusedPasswords.length) / Math.max(entries.length, 1)) * 50
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="sticky top-0 glass-panel border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#00d4ff]/20 rounded-xl">
                <Shield className="w-8 h-8 text-[#00d4ff]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Security Health</h2>
                <p className="text-sm text-white/60">Review and improve your vault security</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Score */}
          <div className="glass-panel rounded-2xl p-8 grid-pattern">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full glass-panel mb-4 relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={securityScore >= 70 ? '#51cf66' : securityScore >= 40 ? '#ffd43b' : '#ff6b6b'}
                    strokeWidth="8"
                    strokeDasharray={`${securityScore * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-white">{securityScore}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {securityScore >= 70 ? 'Good Security' : securityScore >= 40 ? 'Fair Security' : 'Needs Improvement'}
              </h3>
              <p className="text-white/60">
                Your vault security score
              </p>
            </div>
          </div>

          {/* Issues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Weak Passwords */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2} />
                <h4 className="font-bold text-white">Weak Passwords</h4>
              </div>
              <p className="text-3xl font-black text-[#ff6b6b] mb-1">{weakPasswords.length}</p>
              <p className="text-sm text-white/60">Need strengthening</p>
            </div>

            {/* Reused Passwords */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#ffd43b]" strokeWidth={2} />
                <h4 className="font-bold text-white">Reused</h4>
              </div>
              <p className="text-3xl font-black text-[#ffd43b] mb-1">{reusedPasswords.length}</p>
              <p className="text-sm text-white/60">Passwords used multiple times</p>
            </div>

            {/* Strong Passwords */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-[#51cf66]" strokeWidth={2} />
                <h4 className="font-bold text-white">Strong</h4>
              </div>
              <p className="text-3xl font-black text-[#51cf66] mb-1">{strongPasswords.length}</p>
              <p className="text-sm text-white/60">Well protected</p>
            </div>
          </div>

          {/* Weak Passwords List */}
          {weakPasswords.length > 0 && (
            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2} />
                Weak Passwords to Fix
              </h3>
              <div className="space-y-2">
                {weakPasswords.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{entry.title}</p>
                      <p className="text-sm text-white/60">{entry.username}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        onFixEntry(entry);
                        onClose();
                      }}
                      className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
                    >
                      Fix
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reused Passwords List */}
          {reusedPasswords.length > 0 && (
            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ffd43b]" strokeWidth={2} />
                Reused Passwords
              </h3>
              <div className="space-y-2">
                {reusedPasswords.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{entry.title}</p>
                      <p className="text-sm text-white/60">{entry.username}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        onFixEntry(entry);
                        onClose();
                      }}
                      className="bg-[#ffd43b] hover:bg-[#ffc107] text-[#0a0e14]"
                    >
                      Fix
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
