import { Providers } from "./providers";

export const metadata = {
  title: "Links.io",
  icons: {
    icon: "/shortner.webp",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
