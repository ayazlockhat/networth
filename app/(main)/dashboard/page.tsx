"use client";

import { useEffect } from "react";
import { checkAuth } from "@/components/auth";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { AccountsTable } from "@/components/accounts-table";
import data from "./data.json";
export default function DashboardPage() {
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-2 p-6 @container/main">
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        {/* <DataTable data={data} /> */}
        <div className="px-4 lg:px-6">
          <AccountsTable />
        </div>
      </div>
    </div>
  );
}
