import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin-Recruitment-Jagonet",
  description: "Admin Panel JAGONET Recruitment",
  icons: {
    icon: "/logo.jpg", // favicon berbeda
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
