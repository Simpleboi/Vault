import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { VaultEntry } from '@/types/vault';

interface VaultEntryCardProps {
  entry: VaultEntry;
  onEdit: (entry: VaultEntry) => void;
}

export default function VaultEntryCard({ entry, onEdit }: VaultEntryCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [blurTimer, setBlurTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showPassword) {
      const timer = setTimeout(() => {
        setShowPassword(false);
      }, 10000);
      setBlurTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [showPassword]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`, {
      description: 'Will auto-clear in 60 seconds'
    });

    // Auto-clear clipboard after 60 seconds
    setTimeout(async () => {
      await navigator.clipboard.writeText('');
    }, 60000);
  };

  const getStrengthColor = (strength?: string) => {
    switch (strength) {
      case 'strong':
        return 'text-[#51cf66]';
      case 'medium':
        return 'text-[#ffd43b]';
      case 'weak':
        return 'text-[#ff6b6b]';
      default:
        return 'text-white/40';
    }
  };

  return (
    <div
      className="glass-panel glass-panel-hover rounded-xl p-4 cursor-pointer group"
      onClick={() => onEdit(entry)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & URL */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white truncate">
              {entry.title}
            </h3>
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#00d4ff] hover:text-[#00bdeb] transition-colors"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2} />
              </a>
            )}
          </div>

          {/* Username */}
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm text-white/60 truncate mono">{entry.username}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(entry.username, 'Username');
              }}
              className="h-7 w-7 p-0 hover:bg-white/10 hover:text-[#00d4ff]"
            >
              <Copy className="w-4 h-4" strokeWidth={2} />
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center gap-2">
            <code className="text-sm text-white/80 mono">
              {showPassword ? entry.password : '••••••••••••'}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword(!showPassword);
              }}
              className="h-7 w-7 p-0 hover:bg-white/10 hover:text-[#00d4ff]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" strokeWidth={2} />
              ) : (
                <Eye className="w-4 h-4" strokeWidth={2} />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(entry.password, 'Password');
              }}
              className="h-7 w-7 p-0 hover:bg-white/10 hover:text-[#00d4ff]"
            >
              <Copy className="w-4 h-4" strokeWidth={2} />
            </Button>
          </div>

          {/* Category & Strength */}
          <div className="flex items-center gap-3 mt-3">
            {entry.category && (
              <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                {entry.category}
              </span>
            )}
            {entry.strength && (
              <span className={`text-xs font-semibold ${getStrengthColor(entry.strength)}`}>
                {entry.strength}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
