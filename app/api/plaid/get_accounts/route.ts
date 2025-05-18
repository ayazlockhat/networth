// /app/api/plaid/get_accounts/route.ts
import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { tokenStore } from "@/lib/token-store";

export async function GET(request: Request) {
  // Here we hard-code user-123; in a real app, pull from your session/context
  const access_token = tokenStore["user-123"];
  if (!access_token) {
    return NextResponse.json({ error: "no access token" }, { status: 400 });
  }

  const { data } = await plaidClient.accountsGet({ access_token });
  // data.accounts is an array of Plaid Account objects, each with .name, .subtype, .balances.available, etc.
  return NextResponse.json({ accounts: data.accounts });
}
