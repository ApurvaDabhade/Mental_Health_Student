import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const stressData = [
  { day: "Mon", stress: 3, mood: 6 },
  { day: "Tue", stress: 4, mood: 5 },
  { day: "Wed", stress: 5, mood: 4 },
  { day: "Thu", stress: 4, mood: 5 },
  { day: "Fri", stress: 7, mood: 3 },
  { day: "Sat", stress: 3, mood: 7 },
  { day: "Sun", stress: 2, mood: 8 },
];

const sleepData = [
  { day: "Mon", hours: 5.5 },
  { day: "Tue", hours: 6.2 },
  { day: "Wed", hours: 4.8 },
  { day: "Thu", hours: 7.1 },
  { day: "Fri", hours: 5.0 },
  { day: "Sat", hours: 8.2 },
  { day: "Sun", hours: 7.5 },
];

const screenData = [
  { day: "Mon", hrs: 5.2 },
  { day: "Tue", hrs: 6.8 },
  { day: "Wed", hrs: 7.1 },
  { day: "Thu", hrs: 5.9 },
  { day: "Fri", hrs: 8.3 },
  { day: "Sat", hrs: 4.1 },
  { day: "Sun", hrs: 3.8 },
];

const activityData = [
  { day: "Mon", score: 45 },
  { day: "Tue", score: 52 },
  { day: "Wed", score: 38 },
  { day: "Thu", score: 61 },
  { day: "Fri", score: 29 },
  { day: "Sat", score: 72 },
  { day: "Sun", score: 68 },
];

const chartStyle = {
  fontSize: 10,
  fill: "hsl(215 12% 55%)",
};

export const VisualizationPanel = () => (
  <Card className="border-border bg-card col-span-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <BarChart3 className="w-4 h-4 text-primary" />
        Clinical Visualization Dashboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-6">
        <MiniChart title="Weekly Stress & Mood Trend">
          <LineChart data={stressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="day" tick={chartStyle} />
            <YAxis tick={chartStyle} domain={[0, 10]} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="stress" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Stress" />
            <Line type="monotone" dataKey="mood" stroke="hsl(174 72% 50%)" strokeWidth={2} dot={{ r: 3 }} name="Mood" />
          </LineChart>
        </MiniChart>

        <MiniChart title="Sleep Duration (hrs)">
          <BarChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="day" tick={chartStyle} />
            <YAxis tick={chartStyle} domain={[0, 10]} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="hours" fill="hsl(260 60% 60%)" radius={[4, 4, 0, 0]} name="Sleep (hrs)" />
          </BarChart>
        </MiniChart>

        <MiniChart title="Screen Time (hrs/day)">
          <AreaChart data={screenData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="day" tick={chartStyle} />
            <YAxis tick={chartStyle} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="hrs" stroke="hsl(38 92% 60%)" fill="hsl(38 92% 60% / 0.15)" name="Screen Time" />
          </AreaChart>
        </MiniChart>

        <MiniChart title="Daily Activity Score">
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="day" tick={chartStyle} />
            <YAxis tick={chartStyle} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="score" stroke="hsl(142 60% 50%)" strokeWidth={2} dot={{ r: 3 }} name="Activity" />
          </LineChart>
        </MiniChart>
      </div>
    </CardContent>
  </Card>
);

const MiniChart = ({ title, children }: { title: string; children: React.ReactElement }) => (
  <div>
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h4>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);
