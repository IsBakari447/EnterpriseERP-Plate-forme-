import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EnterpriseERP Cloud',
  description: 'Gerez votre entreprise, partout, en toute simplicite.',
  icons: {
    icon: '/enterpriseerp-icon.png',
    shortcut: '/enterpriseerp-icon.png',
    apple: '/enterpriseerp-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}