import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Moon, Footprints, Flame, Droplets, Timer, Zap, Thermometer, Wind, Gauge } from "lucide-react";

const metrics = [
  { icon: Heart, label: "Heart Rate (Avg)", value: "78 bpm", status: "normal", ref: "60–100 bpm" },
  { icon: Heart, label: "Heart Rate (Resting)", value: "64 bpm", status: "normal", ref: "60–80 bpm" },
  { icon: Activity, label: "SpO₂ Level", value: "96%", status: "normal", ref: "95–100%" },
  { icon: Gauge, label: "Blood Pressure (Sys)", value: "128 mmHg", status: "warning", ref: "< 120 mmHg" },
  { icon: Gauge, label: "Blood Pressure (Dia)", value: "84 mmHg", status: "warning", ref: "< 80 mmHg" },
  { icon: Thermometer, label: "Body Temperature", value: "98.4°F", status: "normal", ref: "97.8–99.1°F" },
  { icon: Wind, label: "Respiratory Rate", value: "17 br/min", status: "normal", ref: "12–20 br/min" },
  { icon: Moon, label: "Sleep Duration", value: "6.2 hrs", status: "warning", ref: "7–9 hrs" },
  { icon: Moon, label: "Sleep Cycle (REM)", value: "1.4 hrs", status: "warning", ref: "1.5–2 hrs" },
  { icon: Moon, label: "Sleep Cycle (Deep)", value: "0.9 hrs", status: "high", ref: "1–2 hrs" },
  { icon: Activity, label: "HRV (SDNN)", value: "38 ms", status: "warning", ref: "> 50 ms" },
  { icon: Activity, label: "Activity Score", value: "62/100", status: "warning", ref: "> 70" },
  { icon: Footprints, label: "Step Count", value: "4,820", status: "warning", ref: "> 7,000" },
  { icon: Timer, label: "Sedentary Time", value: "9.4 hrs", status: "high", ref: "< 8 hrs" },
  { icon: Zap, label: "Fatigue Score", value: "6.1/10", status: "warning", ref: "< 4" },
  { icon: Flame, label: "Calorie Expenditure", value: "1,840 kcal", status: "normal", ref: "~2,000" },
  { icon: Droplets, label: "Hydration", value: "1.2 L", status: "high", ref: "> 2.0 L" },
];

const statusColor: Record<string, string> = {
  normal: "text-emerald-400",
  warning: "text-amber-400",
  high: "text-red-400",
};

const statusDot: Record<string, string> = {
  normal: "bg-emerald-400",
  warning: "bg-amber-400",
  high: "bg-red-400",
};

export const PhysiologicalPanel = () => (
  <Card className="border-border bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Heart className="w-4 h-4 text-primary" />
        Physiological Monitoring
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]}`} />
              <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">{m.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`code-font text-sm font-semibold ${statusColor[m.status]}`}>{m.value}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">Ref: {m.ref}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
