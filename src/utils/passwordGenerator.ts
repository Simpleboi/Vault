export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  let password = '';

  if (options.uppercase) charset += UPPERCASE;
  if (options.lowercase) charset += LOWERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  if (charset.length === 0) charset = LOWERCASE + NUMBERS;

  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: 'weak' | 'medium' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 12) score += 20;
  else if (password.length >= 8) score += 10;
  else feedback.push('Password should be at least 12 characters');

  if (/[a-z]/.test(password)) score += 20;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 20;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  else feedback.push('Add symbols');

  const uniqueChars = new Set(password).size;
  if (uniqueChars / password.length > 0.7) score += 10;

  let label: 'weak' | 'medium' | 'strong';
  if (score >= 80) label = 'strong';
  else if (score >= 50) label = 'medium';
  else label = 'weak';

  return { score, label, feedback };
}
