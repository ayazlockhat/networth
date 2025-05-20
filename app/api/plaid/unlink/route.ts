// app/api/plaid/unlink/route.ts
import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { tokenStore } from "@/lib/token-store";

export async function POST() {
  const access_token = tokenStore["user-123"];
  if (!access_token) {
    return NextResponse.json({ error: "no access token" }, { status: 400 });
  }

  try {

    await plaidClient.itemRemove({ access_token });

    delete tokenStore["user-123"];

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error unlinking Plaid item:", err);
    return NextResponse.json(
      { error: err.message || "unlink failed" },
      { status: 500 }
    );
  }
}
