import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+34 601 07 93 73";
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
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hablar por WhatsApp"
            className="fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1EBE5D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
              <path d="M19.05 4.94A9.91 9.91 0 0 0 12 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.33 5L2 22l5.2-1.3A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.95-7.06zm-7.05 15.36a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.09.77.83-3.01-.2-.31A8.27 8.27 0 0 1 3.7 12c0-4.57 3.72-8.3 8.3-8.3 2.22 0 4.3.86 5.86 2.43A8.24 8.24 0 0 1 20.3 12c0 4.58-3.72 8.3-8.3 8.3zm4.55-6.23c-.25-.12-1.47-.73-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.1-.52.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.02 2.6.12.17 1.76 2.7 4.27 3.79.6.26 1.08.42 1.45.53.61.2 1.17.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
            </svg>
          </a>
        ) : null}
      </body>
    </html>
  );
}
