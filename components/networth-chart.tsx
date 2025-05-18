"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "Nov 11", netWorth: 0 },
  { date: "Nov 13", netWorth: 1000 },
  { date: "Nov 15", netWorth: 2500 },
  { date: "Nov 17", netWorth: 5000 },
  { date: "Nov 19", netWorth: 6000 },
  { date: "Nov 21", netWorth: 7000 },
  { date: "Nov 23", netWorth: 7100 },
  { date: "Nov 25", netWorth: 7500 },
  { date: "Nov 27", netWorth: 7300 },
  { date: "Nov 29", netWorth: 6900 },
  { date: "Dec 01", netWorth: 8245 },
  { date: "Dec 03", netWorth: 9000 },
  { date: "Dec 05", netWorth: 10200 },
  { date: "Dec 07", netWorth: 10400 },
  { date: "Dec 09", netWorth: 16000 },
  { date: "Dec 11", netWorth: 20000 },
];

const chartConfig = {
  netWorth: {
    label: "Net worth",
    color: "green",
  },
} satisfies ChartConfig;

export function NetWorthChart() {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <CardTitle>Net worth</CardTitle>
          <p className="text-2xl font-bold">$686,547.97</p>
          <p className="mt-1 flex items-center text-sm text-green-500">
            <TrendingUp className="h-4 w-4 mr-1" />
            $23,292.75 (3.5%)
            <span className="ml-2 text-muted-foreground">1 month change</span>
          </p>
        </div>
        {/* Right side: two selectors */}
        <div className="flex space-x-2">
          {/* <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Net worth performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Net worth performance</SelectItem>
              <SelectItem value="breakdown">Account breakdown</SelectItem>
            </SelectContent>
          </Select> */}
          <Select>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          className="aspect-auto h-[400px] w-full"
          config={chartConfig}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="netWorth"
              type="linear"
              fill="#22c55e"
              fillOpacity={0.4}
              stroke="#4ade80"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
