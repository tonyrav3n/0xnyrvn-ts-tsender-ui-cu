'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, mainnet, sepolia } from 'wagmi/chains';

const isDevelopment = process.env.NODE_ENV === 'development';

export default getDefaultConfig({
  appName: 'TSender',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: isDevelopment ? [anvil] : [mainnet, sepolia],
  ssr: false,
});
