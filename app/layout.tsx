import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { SubscriptionProvider } from "@/components/subscription-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Warehouse Management Platform",
  description: "Cloud-based warehouse management system",
  generator: "v0.dev",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider defaultTheme="purple" storageKey="warehouse-ui-theme"> */}
          <NotificationProvider>
            <AuthProvider>
              <SubscriptionProvider>
                {children}
                <Toaster />
              </SubscriptionProvider>
            </AuthProvider>
          </NotificationProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
