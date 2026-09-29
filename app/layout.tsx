import type {Metadata} from 'next';
import {DM_Sans, Fira_Code, Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({subsets: ['latin'], variable: '--font-jakarta', display: 'swap'});
const dmSans = DM_Sans({subsets: ['latin'], variable: '--font-dm-sans', display: 'swap'});
const firaCode = Fira_Code({subsets: ['latin'], variable: '--font-fira-code', display: 'swap'});

export const metadata: Metadata = {
  title: 'Ask Your Body',
  description: 'Explore how your body works through AI-guided interactive 3D anatomy.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
