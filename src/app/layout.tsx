import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { FilterProvider } from "@/context/FilterContext";
import { cn } from "@/lib/utils";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEONAUT STUDIO // IMAJEN",
  description: "Autonomous AI Art Discovery Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={cn(outfit.className, "bg-white text-primary antialiased selection:bg-primary selection:text-white overflow-x-hidden")}>
        <Script id="sw-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) { console.log('SW: Status(Elite)'); },
                  function(err) { console.log('SW: Status(Error)', err); }
                );
              });
            }
          `}
        </Script>
        <FilterProvider>
          <div className="relative min-h-screen">
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out">
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
            </div>
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}
