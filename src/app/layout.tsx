import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zyroz Agency | Premium Digital Marketing Agency",
  description: "AI driven digital marketing agency offering SEO, website development, ads, automation, and lead generation.",
  icons: {
    icon: "/DigiPulse_logo.jpeg",
    apple: "/DigiPulse_logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <body className="min-h-screen font-sans selection:bg-[#8C4199] selection:text-white">
        <div className="flex flex-col min-h-screen relative overflow-x-hidden">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
