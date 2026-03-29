import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const assessments = [
  { label: "Daily Mood Rating", value: 6, max: 10, color: "bg-amber-400" },
  { label: "Anxiety Scale", value: 4, max: 10, color: "bg-orange-400" },
  { label: "Stress Score", value: 7, max: 10, color: "bg-red-400" },
  { label: "Depression Indicator", value: 3, max: 10, color: "bg-amber-400" },
  { label: "Burnout Risk", value: 6, max: 10, color: "bg-orange-400" },
  { label: "Sleep Quality", value: 5, max: 10, color: "bg-amber-400" },
  { label: "Social Interaction Level", value: 3, max: 10, color: "bg-red-400" },
  { label: "Emotional State", value: 5, max: 10, color: "bg-amber-400" },
];

const getSeverity = (val: number) => {
  if (val <= 3) return { label: "Low", cls: "text-emerald-400" };
  if (val <= 6) return { label: "Moderate", cls: "text-amber-400" };
  return { label: "High", cls: "text-red-400" };
};

export const MentalHealthPanel = () => (
  <Card className="border-border bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Brain className="w-4 h-4 text-primary" />
        Mental Health Assessment
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {assessments.map((a) => {
        const sev = getSeverity(a.value);
        return (
          <div key={a.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{a.label}</span>
              <span className={`code-font font-semibold ${sev.cls}`}>
                {a.value}/{a.max} · {sev.label}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${a.color} transition-all`}
                style={{ width: `${(a.value / a.max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
);
