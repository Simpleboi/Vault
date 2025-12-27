import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface VaultSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VaultSearch({ value, onChange }: VaultSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search passwords..."
        className="pl-12 h-12 bg-white/5 border-white/10 input-recessed text-white placeholder:text-white/40 focus:border-[#00d4ff] focus:ring-[#00d4ff]"
      />
    </div>
  );
}
