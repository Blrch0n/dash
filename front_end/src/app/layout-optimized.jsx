import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Lazy load the AuthProvider to reduce initial bundle size
const AuthProvider = dynamic(
  () =>
    import("../contexts/AuthContextOptimized").then((mod) => ({
      default: mod.AuthProviderOptimized,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Dashboard App",
  description: "A secure dashboard with authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/api/auth/session"
          as="fetch"
          crossOrigin="anonymous"
        />
        {/* Memory optimization meta tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
