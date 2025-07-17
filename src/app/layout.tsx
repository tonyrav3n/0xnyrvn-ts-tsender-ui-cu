import Header from '@/components/Header';
import type {Metadata} from 'next';
import {ReactNode} from 'react';
import './globals.css';
import {Providers} from './providers';
import {Toaster} from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'TSender',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body>
      <Providers>
        <Header/>
        <Toaster position="top-center"/>
        {props.children}
      </Providers>
      </body>
      </html>
  );
}
