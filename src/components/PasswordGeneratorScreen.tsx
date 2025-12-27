import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordGenerator from './PasswordGenerator';

interface PasswordGeneratorScreenProps {
  onClose: () => void;
}

export default function PasswordGeneratorScreen({ onClose }: PasswordGeneratorScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="glass-panel border-b border-white/10 p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-white">Password Generator</h2>
              <p className="text-sm text-white/60">Create strong, unique passwords</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <PasswordGenerator />
        </div>
      </div>
    </div>
  );
}
