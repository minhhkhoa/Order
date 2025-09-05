"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parse } from "date-fns";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueLineChart() {
  // fake 10 item
  const chartData = [
    { date: "01/01/2024", revenue: 1000 },
    { date: "02/01/2024", revenue: 2000 },
    { date: "03/01/2024", revenue: 1500 },
    { date: "04/01/2024", revenue: 3000 },
    { date: "05/01/2024", revenue: 2500 },
    { date: "06/01/2024", revenue: 4000 },
    { date: "07/01/2024", revenue: 3500 },
    { date: "08/01/2024", revenue: 5000 },
    { date: "09/01/2024", revenue: 4500 },
    { date: "10/01/2024", revenue: 6000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (chartData.length < 8) {
                  return value;
                }
                if (chartData.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date());
                  return format(date, "dd");
                }
                return "";
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="revenue"
              type="linear"
              stroke={chartConfig.revenue.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
