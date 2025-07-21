import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Movie Collection",
  description: "Website for movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-100`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
