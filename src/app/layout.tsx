import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
export const metadata: Metadata = {
  title: "TSender",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
