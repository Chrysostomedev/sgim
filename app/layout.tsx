import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGIM — Système de Gestion des Incidents Maritimes",
  description:
    "MRCC Abidjan / MRSC San Pedro — Coordination opérations recherche et sauvetage en mer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
