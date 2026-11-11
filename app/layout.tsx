import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ee-uci.online"),
  title: "EE-UCI — Entrenamiento de Enfermería en UCI",
  description: "Escuela virtual de enfermería en cuidados intensivos.",
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://ee-uci.online",
    siteName: "EE-UCI",
    title: "EE-UCI — Entrenamiento de Enfermería en UCI",
    description: "Escuela virtual de enfermería en cuidados intensivos.",
    images: [{ url: "/logo.jpeg", alt: "EE-UCI" }],
  },
  twitter: {
    card: "summary",
    title: "EE-UCI — Entrenamiento de Enfermería en UCI",
    description: "Escuela virtual de enfermería en cuidados intensivos.",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}
