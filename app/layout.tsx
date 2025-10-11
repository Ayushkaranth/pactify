// app/layout.tsx
import { usePathname } from "next/navigation"; // client-safe hook
import { ClientProviders } from "../components/ClientProviders";
import { ShootingStarBackground } from "../components/background-animation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  // Skip ClientProviders for error pages
  const isErrorPage = pathname.startsWith("/404") || pathname.startsWith("/500");

  return (
    <html lang="en">
      <body className="bg-slate-950">
        {isErrorPage ? (
          <>
            <ShootingStarBackground />
            {children}
          </>
        ) : (
          <ClientProviders>
            <ShootingStarBackground />
            {children}
          </ClientProviders>
        )}
      </body>
    </html>
  );
}
