import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "EmoLens",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}
