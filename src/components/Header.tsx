import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-800">
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/tonyrav3n/0xynyrvn-ts-tsender-ui-cu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity duration-200"
          aria-label="GitHub Repository"
        >
          <FaGithub size={28} />
        </a>
        <span className="text-xl font-bold tracking-tight">TSender</span>
      </div>
      <div>
        <ConnectButton />
      </div>
    </header>
  );
}
