'use client';

import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import { type ReactNode } from 'react';

const DynamicProviders = dynamic(() => import('./ProvidersClient'), {
  ssr: false,
  loading: () => (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading Web3...</p>
      </div>
    </div>
  ),
});

export function Providers(props: { children: ReactNode }) {
  return <DynamicProviders>{props.children}</DynamicProviders>;
}
