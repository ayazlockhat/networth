"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

type PlaidAccount = {
  account_id: string;
  balances: {
    available: number | null;
    current: number;
    limit: number | null;
  };
  mask: string;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string;
  institution_id: string;
};

type Account = {
  name: string;
  subtype: string;
  balance: number;
  institutionLogo?: string;
};

type Category = {
  name: string;
  total: number;
  change: number;
  percentChange: number;
  accounts: Account[];
};

const ACCOUNT_TYPE_MAP: Record<string, string> = {
  depository: "Cash",
  credit: "Credit Cards",
  loan: "Loans",
  investment: "Investments",
  brokerage: "Investments",
  other: "Other",
};

function groupAccountsByType(accounts: PlaidAccount[]): Category[] {
  const categories: Record<string, Category> = {};

  accounts.forEach((account) => {
    const type = ACCOUNT_TYPE_MAP[account.type] || account.type;
    const balance = account.balances.current || 0;

    if (!categories[type]) {
      categories[type] = {
        name: type,
        total: 0,
        change: 0,
        percentChange: 0,
        accounts: [],
      };
    }

    categories[type].total += balance;
    categories[type].accounts.push({
      name: account.official_name || account.name,
      subtype: account.subtype,
      balance: balance,
    });
  });

  return Object.values(categories);
}

export function AccountsTable() {
  const [accounts, setAccounts] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/plaid/get_accounts");
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        const groupedAccounts = groupAccountsByType(data.accounts);
        setAccounts(groupedAccounts);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts");
        toast.error("Failed to load accounts", {
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No accounts found</p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-5xl space-y-4 "
    >
      {accounts.map((cat, i) => {
        const isPositive = cat.change >= 0;
        const ArrowIcon = isPositive ? TrendingUp : TrendingDown;
        const changeColor = isPositive ? "text-green-500" : "text-red-500";

        return (
          <AccordionItem key={cat.name} value={`item-${i}`}>
            <Card className="@container/card border-none">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      {cat.change !== 0 && (
                        <>
                          <ArrowIcon className={`h-4 w-4 ${changeColor}`} />
                          <span className={`${changeColor} font-medium`}>
                            {`${isPositive ? "+" : "-"}$${Math.abs(
                              cat.change
                            ).toLocaleString()} (${Math.abs(
                              cat.percentChange
                            )}%)`}
                          </span>
                          <span className="text-muted-foreground">
                            1 month change
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-semibold">
                      ${cat.total.toLocaleString()}
                    </CardTitle>
                    <AccordionTrigger className="p-2 rounded hover:bg-muted border-none shadow-none focus:outline-none" />
                  </div>
                </div>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-2">
                  {cat.accounts.map((acct) => (
                    <Card key={acct.name} className="@container/card w-full">
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {acct.institutionLogo ? (
                              <AvatarImage src={acct.institutionLogo} />
                            ) : (
                              <AvatarFallback>
                                {acct.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col">
                            <CardTitle className="text-lg">
                              {acct.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                              {acct.subtype.charAt(0).toUpperCase() +
                                acct.subtype.slice(1)}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Right side: Balance */}
                        <CardTitle className="text-xl font-semibold">
                          ${acct.balance.toLocaleString()}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
