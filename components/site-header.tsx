"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconMoon, IconSun, IconBrandGithub } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/dashboard", title: "Dashboard" },
  { path: "/accounts", title: "Accounts" },
  { path: "/test", title: "Test" },
  { path: "/settings", title: "Settings" },
];

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const currentPage =
    navItems.find((item) => item.path === pathname)?.title || "Dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentPage}</h1>
        <div className="ml-auto flex items-center gap-1">
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <IconSun className="size-5" />
              ) : (
                <IconMoon className="size-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/ayazlockhat"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              <IconBrandGithub className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
