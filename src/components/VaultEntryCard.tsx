import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, ExternalLink, Briefcase, Code, GraduationCap, Mail, ShoppingCart, Film, User, Heart, Home, CreditCard, Globe, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { VaultEntry } from '@/types/vault';

interface VaultEntryCardProps {
  entry: VaultEntry;
  onEdit: (entry: VaultEntry) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Work': Briefcase,
  'Code': Code,
  'Coding': Code,
  'Personal': User,
  'School': GraduationCap,
  'Email': Mail,
  'Shopping': ShoppingCart,
  'Entertainment': Film,
  'Social': Heart,
  'Finance': CreditCard,
  'Banking': CreditCard,
  'Home': Home,
  'Travel': Globe,
  'Other': Folder,
  'Others': Folder,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Work': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Code': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Coding': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Personal': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'School': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Email': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Shopping': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Entertainment': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Social': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'Finance': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Banking': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Home': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Travel': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Other': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'Others': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

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
              <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1.5 ${
                CATEGORY_COLORS[entry.category] || 'bg-white/5 text-white/40 border-white/10'
              }`}>
                {CATEGORY_ICONS[entry.category] &&
                  (() => {
                    const Icon = CATEGORY_ICONS[entry.category];
                    return <Icon className="w-3.5 h-3.5" strokeWidth={2} />;
                  })()
                }
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
