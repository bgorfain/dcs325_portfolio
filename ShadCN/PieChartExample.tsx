"use client";

// pretty much all of the code on here was taken from the ShadCN example pages
// the modifications are the names of the parts of the chart and the colors, and removing some unneeded bits

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import "/src/index.css";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartExampleProps {
  data: Array<{ status: string; numtaken: number; fill: string }>;
  title: string;
}

// modifying the config
const chartConfig = {
  numtaken: {
    label: "",
  },
  taken: {
    label: "Courses Taken",
    color: "#881124",
  },
  remaining: {
    label: "Courses Remaining",
    color: "#E5E5E5",
  },
} satisfies ChartConfig;

export function Component({ data, title }: PieChartExampleProps) {
  const totalnumtaken = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.numtaken, 0);
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="h-[200px] w-[200px]">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full"
          layout="vertical"
        >
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel={false}
                  nameKey="status"
                  labelKey="numtaken"
                />
              }
            />
            <Pie
              data={data}
              dataKey="numtaken"
              nameKey="status"
              innerRadius={70}
              outerRadius={90}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {
                            data.find((item) => item.status === "taken")
                              ?.numtaken
                          }
                          /{totalnumtaken.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Courses Taken
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export { Component as PieChartExample };
