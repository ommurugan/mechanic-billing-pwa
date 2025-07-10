
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}

export const CustomBarChart = ({ data, dataKey, xAxisKey, color = "#3B82F6", height = 300 }: BarChartProps) => {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ChartContainer>
  );
};

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}

export const CustomLineChart = ({ data, dataKey, xAxisKey, color = "#3B82F6", height = 300 }: LineChartProps) => {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
};

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
}

export const CustomPieChart = ({ data, dataKey, nameKey, height = 300 }: PieChartProps) => {
  const chartConfig = data.reduce((config, item, index) => {
    config[item[nameKey]] = {
      label: item[nameKey],
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    };
    return config;
  }, {} as any);

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`} 
            />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
};
