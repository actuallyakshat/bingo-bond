"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, Mail, UserCircle } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-6" />,
    className: "size-6",
  },

  {
    href: "/dashboard/invites",
    label: "Invites",
    icon: <Mail className="size-6" />,
    className: "size-6",
  },

  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: <UserCircle className="size-6" />,
    className: "size-6",
  },
];

const footerItem = {
  label: "Logout",
  icon: <LogOut className="size-6" />,
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
              <Link href={item.href} className="flex items-center gap-2 ">
                <SidebarMenuButton className="pl-4">
                  {item.icon}
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className="flex w-full items-center gap-2 text-destructive hover:text-destructive/80"
                onClick={() => signOut()}
              >
                {footerItem.icon}
                {footerItem.label}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
