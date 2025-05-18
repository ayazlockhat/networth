import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { tokenStore } from "@/lib/token-store";

export async function POST(request: Request) {
  const { public_token, client_user_id } = await request.json();

  // Exchange for an access_token
  const { data } = await plaidClient.itemPublicTokenExchange({
    public_token,
  });

  const uid = client_user_id ?? "user-123";
  tokenStore[uid] = data.access_token;

  return NextResponse.json({ access_token: data.access_token });
}
