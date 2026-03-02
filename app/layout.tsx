import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Screener | Smart Recruitment",
  description: "Next-gen AI recruitment platform for job seekers and recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="liquid-scene" aria-hidden="true">
          <span className="liquid-orb orb-a" />
          <span className="liquid-orb orb-b" />
          <span className="liquid-orb orb-c" />
          <div className="liquid-sheen" />
        </div>
        <main className="app-main">{children}</main>
        <div className="glow-mesh" />
      </body>
    </html>
  );
}
