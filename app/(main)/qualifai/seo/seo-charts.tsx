// components/seo-charts.tsx
"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface SEOChartProps {
  data: any;
  type: "bar" | "pie" | "line" | "radar";
  title?: string;
  height?: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function SEOBarChart({ data, title, height = 300 }: SEOChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Issues" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SEOPieChart({ data, title, height = 300 }: SEOChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SEOLineChart({ data, title, height = 300 }: SEOChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="pages" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SEORadarChart({ data, title, height = 300 }: SEOChartProps) {
  const chartData = Object.entries(data).map(([category, value]) => ({
    subject: category,
    A: value,
    fullMark: Math.max(...Object.values(data).map((v) => Number(v))) * 1.2,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Score Progress Component
export function ScoreProgress({ score }: { score: number }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">SEO Score</span>
        <span className="text-sm font-medium">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            score >= 80
              ? "bg-green-600"
              : score >= 60
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

// Issues Distribution Chart
export function IssuesDistributionChart({
  technicalData,
}: {
  technicalData: any;
}) {
  const data = [
    { name: "Title Tags", issues: technicalData.titleTags.totalIssues },
    { name: "Meta Desc", issues: technicalData.metaDescriptions.totalIssues },
    { name: "Headings", issues: technicalData.headings.totalIssues },
    { name: "Links", issues: technicalData.links.totalIssues },
    { name: "Images", issues: technicalData.images.totalIssues },
    { name: "Status Codes", issues: technicalData.statusCodes.totalIssues },
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Issues Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="issues" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Score Trend Chart (for historical data)
export function ScoreTrendChart({ historicalData }: { historicalData: any[] }) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">SEO Score Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
