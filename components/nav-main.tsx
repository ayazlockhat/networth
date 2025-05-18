"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconPlus, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { toast } from "sonner";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const userId = "user-123";

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch("/api/plaid/create_link_token");
        const json = await res.json();
        setLinkToken(json.linkToken);
      } catch (err) {
        console.error("Failed to fetch link token:", err);
        toast.error("Failed to initialize Plaid connection");
      }
    }
    getToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess: async (public_token, metadata) => {
      try {
        const resp = await fetch("/api/plaid/exchange_public_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token, client_user_id: userId }),
        });
        const { access_token } = await resp.json();
        toast.success("Bank account linked successfully!");
      } catch (err) {
        console.error("Exchange failed:", err);
        toast.error("Failed to link bank account");
      }
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={() => open()}
              disabled={!ready || !linkToken}
              tooltip="Add Account"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear justify-center"
            >
              <IconPlus />
              <span>Add Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  data-state={isActive ? "active" : undefined}
                  className={cn(
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
