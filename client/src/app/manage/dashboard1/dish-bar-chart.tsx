"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";

// Dùng biến màu đã khai báo trong globals.css
const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  successOrders: {
    label: "Đơn thanh toán",
  },
} satisfies ChartConfig;

export function DishBarChart({
  chartData,
}: {
  chartData: Pick<
    DashboardIndicatorResType["data"]["dishIndicator"][0],
    "name" | "successOrders"
  >[];
}) {
  // Gắn màu cho từng món ăn dựa trên index
  const chartDataWithColors = useMemo(
    () =>
      chartData.map((data, index) => ({
        ...data,
        fill: colors[index % colors.length], // nếu nhiều hơn 5 món thì quay vòng màu
      })),
    [chartData]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataWithColors}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            barCategoryGap={10} // khoảng cách giữa các bar
          >
            <YAxis
              dataKey="name"
              type="category"
              axisLine={true}
              tickLine={true}
              tickMargin={5}
              width={230}
              tickFormatter={(value) => {
                // return value;

                return chartConfig[value as keyof typeof chartConfig]?.label;
              }}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="end"
                  fill="currentColor"
                  fontSize={11.5}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {payload.value}
                </text>
              )}
            />

            <XAxis
              dataKey="successOrders"
              type="number"
              axisLine={false}
              tickLine={false}
              hide
            />

            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="successOrders"
              name="Đơn thanh toán"
              radius={5}
              barSize={20}
            >
              {chartDataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm" />
    </Card>
  );
}
