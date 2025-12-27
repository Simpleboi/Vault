import { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PasswordGenerator from './PasswordGenerator';
import type { VaultEntry } from '@/types/vault';
import { calculatePasswordStrength } from '@/utils/passwordGenerator';

interface EntryModalProps {
  entry: VaultEntry | null;
  onSave: (entry: Partial<VaultEntry>) => void;
  onClose: () => void;
}

export default function EntryModal({ entry, onSave, onClose }: EntryModalProps) {
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    username: entry?.username || '',
    password: entry?.password || '',
    url: entry?.url || '',
    category: entry?.category || '',
    notes: entry?.notes || ''
  });

  const [showGenerator, setShowGenerator] = useState(false);

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      strength: passwordStrength.label
    });
    onClose();
  };

  const handleGeneratedPassword = (password: string) => {
    setFormData({ ...formData, password });
    setShowGenerator(false);
  };

  const getStrengthColor = (label: string) => {
    switch (label) {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="w-full max-w-2xl glass-panel rounded-t-3xl sm:rounded-3xl animate-in slide-in-from-bottom-8 duration-500 ease-out max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass-panel border-b border-white/10 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              {entry ? 'Edit Entry' : 'New Entry'}
            </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white/80 font-semibold">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., GitHub, Gmail"
              required
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
            />
          </div>

          {/* URL */}
          <div>
            <Label htmlFor="url" className="text-white/80 font-semibold">
              Website URL
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
            />
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-white/80 font-semibold">
              Username / Email *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="your@email.com"
              required
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 mono"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password" className="text-white/80 font-semibold">
                Password *
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowGenerator(!showGenerator)}
                className="text-[#00d4ff] hover:text-[#00bdeb] hover:bg-white/10"
              >
                <Sparkles className="w-4 h-4 mr-2" strokeWidth={2} />
                Generate
              </Button>
            </div>
            <Input
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter a strong password"
              required
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 mono"
            />
            {formData.password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.label === 'strong'
                        ? 'bg-[#51cf66] w-full'
                        : passwordStrength.label === 'medium'
                        ? 'bg-[#ffd43b] w-2/3'
                        : 'bg-[#ff6b6b] w-1/3'
                    }`}
                  />
                </div>
                <span className={`text-sm font-semibold ${getStrengthColor(passwordStrength.label)}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            
            {showGenerator && (
              <div className="mt-4">
                <PasswordGenerator onSelect={handleGeneratedPassword} />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-white/80 font-semibold">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Work, Personal, Social"
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-white/80 font-semibold">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information..."
              rows={3}
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold active:scale-95 transition-all glow-cyan"
            >
              <Save className="w-5 h-5 mr-2" strokeWidth={2} />
              Save Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
