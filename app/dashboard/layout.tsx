import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import SidebarComponent from "./_components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="grid h-full min-h-screen w-screen md:grid-cols-[auto_1fr]">
        <SidebarComponent />
        <SidebarInset className="flex flex-col">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
