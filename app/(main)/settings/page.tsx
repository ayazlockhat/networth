"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const router = useRouter();

  const handleUnlink = async () => {
    if (!confirm("Are you sure you want to disconnect your Plaid account?")) {
      return;
    }

    try {
      const res = await fetch("/api/plaid/unlink", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Bank account disconnected");
      router.refresh(); // re-fetch data / rerender page
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to disconnect account");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      {/* Left column */}
      <div className="flex flex-col gap-6 w-full lg:w-1/3">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Name: Ayaz Lockhat</div>
            <div>Email: ayazzlockhat@gmail.com</div>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              Account{" "}
              <span className="ml-2 px-2 py-1 text-xs bg-gray-700 rounded">
                Pro
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <button
              onClick={handleUnlink}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Bank
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Manage Subscription
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6 w-full lg:w-2/3">
        {/* Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Requests will refresh in 17 days</div>
          </CardContent>
        </Card>

        {/* Active Sessions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Desktop App Session - Created about 2 months ago</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
