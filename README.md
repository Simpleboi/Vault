# Vault

A secure, zero-knowledge password manager built with modern web technologies. Vault encrypts your passwords client-side before they ever leave your device, ensuring that only you can access your sensitive data.

## Features

- **Client-Side Encryption**: All passwords are encrypted on your device using AES-GCM (256-bit) before being stored in the cloud
- **Zero-Knowledge Architecture**: Your master password never leaves your device - not even we can access your passwords
- **Auto-Lock Security**: Automatically locks after 5 minutes of inactivity
- **Password Strength Analysis**: Visual indicators for password strength
- **Category Organization**: Organize passwords with color-coded categories and icons
- **Secure Clipboard**: Auto-clears clipboard after 60 seconds when copying passwords
- **Notes Support**: Add encrypted notes to any password entry
- **Modern UI**: Glassmorphic design with smooth animations

## Security Architecture

### Encryption
- **Algorithm**: AES-GCM 256-bit encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Unique Salts**: Each user has a unique cryptographic salt
- **Random IVs**: Each encrypted field uses a random initialization vector

### Data Flow
1. User authenticates with Firebase Auth
2. User's unique salt is retrieved from Firestore
3. Master password + salt → PBKDF2 → encryption key (stored in memory only)
4. Encryption key unlocks vault and decrypts password entries
5. Auto-locks after 5 minutes of inactivity (clears key from memory)

### What's Encrypted
- Passwords
- Usernames
- Notes

### What's Not Encrypted (for functionality)
- Entry titles (for searchability)
- Categories (for filtering)
- URLs

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Firebase (Authentication + Firestore)
- **Encryption**: Web Crypto API
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vault
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Available Categories

Vault comes with pre-configured categories, each with unique colors and icons:

- **Work** - Blue with Briefcase icon
- **Code/Coding** - Purple with Code icon
- **Personal** - Cyan with User icon
- **School** - Green with GraduationCap icon
- **Email** - Yellow with Mail icon
- **Shopping** - Pink with ShoppingCart icon
- **Entertainment** - Red with Film icon
- **Gaming** - Violet with Gamepad icon
- **Social** - Rose with Heart icon
- **Finance/Banking** - Emerald with CreditCard icon
- **Home** - Orange with Home icon
- **Travel** - Indigo with Globe icon
- **Other** - Slate with Folder icon

## Project Structure

```
vault/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── VaultEntryCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── LockScreen.tsx
│   │   └── VaultView.tsx
│   ├── services/         # Core services
│   │   ├── encryptionService.ts
│   │   ├── firestoreService.ts
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── hooks/            # Custom React hooks
│   │   └── useVault.ts
│   ├── types/            # TypeScript types
│   │   └── vault.ts
│   └── lib/              # Utilities
│       └── firebase.ts
├── public/               # Static assets
└── ...
```

## Security Best Practices

- **Master Password**: Choose a strong, unique master password - it's the only way to access your vault
- **Device Security**: Keep your device secure as the encryption key is held in memory while unlocked
- **HTTPS Only**: Always access Vault over HTTPS in production
- **Regular Updates**: Keep dependencies updated for security patches

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

While Vault implements industry-standard encryption practices, it is provided as-is without warranty. Always maintain backups of critical passwords and use at your own risk.