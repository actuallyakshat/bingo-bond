"use client";
import { LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useGlobalStore } from "@/context/GlobalContext";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    className: "size-5",
  },
  {
    href: "#",
    label: "Profile",
    icon: UserCircle,
    className: "size-5",
  },
];

const footerItem = {
  label: "Logout",
  icon: LogOut,
  className: "h-4 w-4 text-destructive",
};

export default function SidebarComponent() {
  const { signOut } = useClerk();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Bingo Bond</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-0">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 py-2 px-3"
                >
                  <item.icon className={item.className} />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className="flex w-full items-center gap-2"
                onClick={() => signOut()}
              >
                <footerItem.icon className={footerItem.className} />
                {footerItem.label}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
