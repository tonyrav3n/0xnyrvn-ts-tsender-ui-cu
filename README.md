# TSender UI (Airdrop Web3 App)

A beautiful, modern, and secure Web3 airdrop interface for sending ERC20 tokens to multiple recipients in a single transaction. Built with Next.js, React, TypeScript, RainbowKit, Wagmi, and MetaMask support.

## Features

- **Multi-recipient ERC20 airdrop**: Send tokens to many addresses at once.
- **MetaMask & WalletConnect**: Connect your wallet securely with RainbowKit.
- **ERC20 Approval Handling**: Automatic approval flow for safe airdrops.
- **Transaction Details**: See token info, total amount, and recipient count before sending.
- **Input Validation**: Prevents mistakes and guides the user.
- **LocalStorage Persistence**: Form data is saved between reloads.
- **Responsive & Modern UI**: Clean, black & white design with smooth UX.
- **Error Handling**: Friendly alerts and feedback for all actions.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [RainbowKit](https://www.rainbowkit.com/) & [Wagmi](https://wagmi.sh/) (wallet connection)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)

## Usage

1. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

## How It Works

- **Connect your wallet** (MetaMask, WalletConnect, etc.)
- **Enter the ERC20 token address**
- **Paste recipient addresses** (comma or newline separated)
- **Enter amounts** (comma or newline separated, matching recipient count)
- **Review transaction details**
- **Click "Send Token"**
- The app will handle approval and airdrop in one flow, with clear feedback and error handling.

## Customization

- Edit `src/constants.ts` to add supported chains or update ABIs.
- UI components are in `src/components/` and are easy to style with Tailwind.

## Security

- All transactions are signed by your wallet; private keys are never exposed.
- Input validation and error handling help prevent mistakes.

## License

MIT

---

*Built with ❤️ by 0xnyrvn.*
