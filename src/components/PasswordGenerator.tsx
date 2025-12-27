import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { generatePassword, calculatePasswordStrength, type PasswordOptions } from '@/utils/passwordGenerator';

interface PasswordGeneratorProps {
  onSelect?: (password: string) => void;
}

export default function PasswordGenerator({ onSelect }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const [password, setPassword] = useState(generatePassword(options));
  const strength = calculatePasswordStrength(password);

  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(password);
      toast.success('Password inserted');
    }
  };

  const getStrengthColor = (label: string) => {
    switch (label) {
      case 'strong':
        return 'bg-[#51cf66]';
      case 'medium':
        return 'bg-[#ffd43b]';
      case 'weak':
        return 'bg-[#ff6b6b]';
      default:
        return 'bg-white/20';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Generated Password Display */}
      <div>
        <Label className="text-white/80 font-semibold mb-2 block">Generated Password</Label>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 input-recessed">
            <code className="text-white mono text-lg break-all">{password}</code>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="hover:bg-white/10 hover:text-[#00d4ff]"
          >
            <Copy className="w-5 h-5" strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerate}
            className="hover:bg-white/10 hover:text-[#00d4ff]"
          >
            <RefreshCw className="w-5 h-5" strokeWidth={2} />
          </Button>
        </div>

        {/* Strength Indicator */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor(strength.label)}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${strength.label === 'strong' ? 'text-[#51cf66]' : strength.label === 'medium' ? 'text-[#ffd43b]' : 'text-[#ff6b6b]'}`}>
            {strength.label}
          </span>
        </div>
      </div>

      {/* Length Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label className="text-white/80 font-semibold">Length</Label>
          <span className="text-[#00d4ff] font-bold mono">{options.length}</span>
        </div>
        <Slider
          value={[options.length]}
          onValueChange={([value]) => {
            setOptions({ ...options, length: value });
            setPassword(generatePassword({ ...options, length: value }));
          }}
          min={8}
          max={64}
          step={1}
          className="cursor-pointer"
        />
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="uppercase" className="text-white/80 font-semibold cursor-pointer">
            Uppercase (A-Z)
          </Label>
          <Switch
            id="uppercase"
            checked={options.uppercase}
            onCheckedChange={(checked) => {
              const newOptions = { ...options, uppercase: checked };
              setOptions(newOptions);
              setPassword(generatePassword(newOptions));
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="lowercase" className="text-white/80 font-semibold cursor-pointer">
            Lowercase (a-z)
          </Label>
          <Switch
            id="lowercase"
            checked={options.lowercase}
            onCheckedChange={(checked) => {
              const newOptions = { ...options, lowercase: checked };
              setOptions(newOptions);
              setPassword(generatePassword(newOptions));
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="numbers" className="text-white/80 font-semibold cursor-pointer">
            Numbers (0-9)
          </Label>
          <Switch
            id="numbers"
            checked={options.numbers}
            onCheckedChange={(checked) => {
              const newOptions = { ...options, numbers: checked };
              setOptions(newOptions);
              setPassword(generatePassword(newOptions));
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="symbols" className="text-white/80 font-semibold cursor-pointer">
            Symbols (!@#$...)
          </Label>
          <Switch
            id="symbols"
            checked={options.symbols}
            onCheckedChange={(checked) => {
              const newOptions = { ...options, symbols: checked };
              setOptions(newOptions);
              setPassword(generatePassword(newOptions));
            }}
          />
        </div>
      </div>

      {/* Use Button */}
      {onSelect && (
        <Button
          type="button"
          onClick={handleSelect}
          className="w-full h-11 bg-[#00d4ff] hover:bg-[#00bdeb] text-[#0a0e14] font-bold active:scale-95 transition-all"
        >
          Use This Password
        </Button>
      )}
    </div>
  );
}
