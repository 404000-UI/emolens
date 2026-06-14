import type { Metadata } from "next";
import "./styles/global.css";
import Navigation from "./components/navigation";

export const metadata: Metadata = {
  title: "EmoLens",
  description: "EmoLens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="UTF-8">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
