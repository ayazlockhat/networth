// app/api/plaid/get_accounts/route.ts
import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { tokenStore } from "@/lib/token-store";
import { CountryCode } from "plaid";

export async function GET() {
  const access_token = tokenStore["user-123"];
  if (!access_token) {
    return NextResponse.json({ error: "no access token" }, { status: 400 });
  }

  const { data: itemData } = await plaidClient.itemGet({ access_token });
  const institution_id = itemData.item.institution_id;
  if (!institution_id) {
    return NextResponse.json(
      { error: "no institution_id on item" },
      { status: 400 }
    );
  }

  const { data: instData } = await plaidClient.institutionsGetById({
    institution_id,
    country_codes: [CountryCode.Ca, CountryCode.Us],
    options: { include_optional_metadata: true },
  });

  const inst = instData.institution;

  const logoBase64 = inst.logo ?? null;
  const logoUrl = logoBase64 ? `data:image/png;base64,${logoBase64}` : null;
  const institution = {
    institution_id: inst.institution_id,
    name: inst.name,
    logo: logoUrl,
    country_code: inst.country_codes[0] || null,
  };

  const { data: acctData } = await plaidClient.accountsGet({ access_token });
  const accounts = acctData.accounts.map((acct) => ({
    ...acct,

    institutionLogo: logoUrl,
  }));

  return NextResponse.json({ institution, accounts });
}
