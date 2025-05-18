// /app/api/plaid/create_link_token/route.ts
import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function GET() {
  const { data } = await plaidClient.linkTokenCreate({
    user: { client_user_id: "user-123" },
    client_name: "Networth Dashboard",
    products: [Products.Assets],
    country_codes: [CountryCode.Ca],
    language: "en",
  });
  return NextResponse.json({ linkToken: data.link_token });
}
