import { Badge } from '@/components/ui/badge';
import { Briefcase, Code, GraduationCap, Mail, ShoppingCart, Film, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Work': Briefcase,
  'Coding': Code,
  'School': GraduationCap,
  'Email': Mail,
  'Shopping': ShoppingCart,
  'Entertainment': Film,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Work': 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30',
  'Coding': 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-purple-500/30',
  'School': 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30',
  'Email': 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30',
  'Shopping': 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border-pink-500/30',
  'Entertainment': 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30',
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-white/60 font-semibold">Categories:</span>

      {/* All button */}
      <Badge
        variant="outline"
        className={`cursor-pointer transition-all ${
          selectedCategory === null
            ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30'
            : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </Badge>

      {/* Category badges */}
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        const colorClass = CATEGORY_COLORS[category] || 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10';
        const isSelected = selectedCategory === category;

        return (
          <Badge
            key={category}
            variant="outline"
            className={`cursor-pointer transition-all flex items-center gap-1.5 ${
              isSelected ? colorClass : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'
            }`}
            onClick={() => onSelectCategory(isSelected ? null : category)}
          >
            {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
            {category}
            {isSelected && <X className="w-3 h-3 ml-0.5" strokeWidth={2.5} />}
          </Badge>
        );
      })}
    </div>
  );
}
