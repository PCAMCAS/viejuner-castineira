import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppFloatingButton } from "./_components/whatsapp-floating-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viejuner Castiñeira",
  description:
    "Catálogo privado de miniaturas antiguas de Warhammer con sistema de reservas temporales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Hola, quiero información sobre las miniaturas.";
  const normalizedWhatsappNumber = whatsappNumber
    ? whatsappNumber.replace(/\D/g, "")
    : "";
  const whatsappLink = normalizedWhatsappNumber
    ? `https://wa.me/${normalizedWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}

        {whatsappLink ? (
          <WhatsAppFloatingButton whatsappLink={whatsappLink} />
        ) : null}
      </body>
    </html>
  );
}
