import { Providers } from "./providers";
import Header from "@/Components/Header";
import ErrorBoundary from "@/Components/ErrorBoundary";

export const metadata = {
  title: "Share8",
  icons: {
    icon: "/shortner.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Custom global css config */}
        <link rel="stylesheet" href="/styles/global.css" />
      </head>
      <body>
        <Header />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
