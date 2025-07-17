'use client';

import {ConnectButton} from '@rainbow-me/rainbowkit';
import {FaGithub} from 'react-icons/fa';

export default function Header() {
  return (
      <header
          className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <a
              href="https://github.com/tonyrav3n/0xnyrvn-ts-tsender-ui-cu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
              aria-label="GitHub Repository"
          >
            <FaGithub size={28}/>
          </a>
          <div className="flex flex-col leading-tight">
          <span
              className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <span className="text-gray-400 dark:text-gray-500">T</span>Sender
          </span>
            <span className="text-xs text-gray-400 font-medium mt-0.5">
            WEB3 TOKEN TRANSFER TOOL
          </span>
          </div>
        </div>
        <div>
          <ConnectButton/>
        </div>
      </header>
  );
}
