"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AddBondButton from "./AddFormButton";
import { usePathname } from "next/navigation";

export default function Header({ headerTitle }: { headerTitle: string }) {
  const pathname = usePathname();
  return (
    <header className="flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="font-medium text-sm">{headerTitle}</h1>
      </div>
      {pathname == "/dashboard" && <AddBondButton />}
    </header>
  );
}
