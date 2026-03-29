import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { useStudentLifeApi } from "@/hooks/useStudentLifeApi";

const illustrative = [
  { label: "Stress (EMA-style)", value: "4/5", pct: 80, color: "bg-red-400", severity: "High" },
  { label: "Mental wellness (illustrative)", value: "42/100", pct: 42, color: "bg-amber-400", severity: "Moderate" },
  { label: "BMI health risk (illustrative)", value: "Low", pct: 20, color: "bg-emerald-400", severity: "Low" },
  { label: "Sleep disorder risk (illustrative)", value: "62%", pct: 62, color: "bg-orange-400", severity: "Moderate" },
];

const sevColor: Record<string, string> = {
  Low: "text-emerald-400 bg-emerald-400/10",
  "Low-Mod": "text-amber-400 bg-amber-400/10",
  Moderate: "text-amber-400 bg-amber-400/10",
  Elevated: "text-orange-400 bg-orange-400/10",
  High: "text-red-400 bg-red-400/10",
};

function apiSeverity(status: string): keyof typeof sevColor {
  if (status === "red") return "High";
  if (status === "yellow") return "Moderate";
  return "Low";
}

export const PredictiveAnalyticsPanel = () => {
  const { data, isLoading, isError, error } = useStudentLifeApi();
  const pred = data?.prediction;
  const ano = data?.anomaly;
  const errMsg = data?.error ?? (isError && error instanceof Error ? error.message : null);

  const liveRows: {
    label: string;
    value: string;
    pct: number;
    color: string;
    severity: keyof typeof sevColor;
  }[] = [];

  if (pred) {
    liveRows.push({
      label: "Next-day activity (transformer)",
      value: `${pred.predicted_activity_minutes} min`,
      pct: Math.min(100, pred.activity_score),
      color:
        pred.status_indicator === "red"
          ? "bg-red-400"
          : pred.status_indicator === "yellow"
            ? "bg-amber-400"
            : "bg-emerald-400",
      severity: apiSeverity(pred.status_indicator),
    });
  }
  if (ano) {
    liveRows.push({
      label: "Behavioral anomaly (autoencoder)",
      value: ano.is_anomaly ? "Flagged" : "Within range",
      pct: Math.min(100, ano.anomaly_score),
      color:
        ano.status_indicator === "red"
          ? "bg-red-400"
          : ano.status_indicator === "yellow"
            ? "bg-amber-400"
            : "bg-emerald-400",
      severity: apiSeverity(ano.status_indicator),
    });
  }

  const alerts: string[] = [];
  if (pred) alerts.push(`Activity: ${pred.interpretation}`);
  if (ano) alerts.push(`Anomaly: ${ano.interpretation}${ano.recommendation ? ` — ${ano.recommendation}` : ""}`);
  if (errMsg) alerts.push(`API: ${errMsg}`);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4 text-primary" />
          Predictive Analytics (ML)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Live rows use the StudentLife FastAPI (<code className="code-font">/predict</code>,{" "}
          <code className="code-font">/anomaly</code>) with example payloads from{" "}
          <code className="code-font">/examples</code>.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading models…
          </div>
        )}

        {liveRows.map((p) => (
          <div key={p.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{p.label}</span>
              <div className="flex items-center gap-2">
                <span className="code-font font-semibold text-foreground">{p.value}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${sevColor[p.severity]}`}>
                  {p.severity}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}

        <p className="text-[10px] uppercase tracking-wider text-muted-foreground pt-2">Illustrative</p>
        {illustrative.map((p) => (
          <div key={p.label} className="space-y-1 opacity-90">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{p.label}</span>
              <div className="flex items-center gap-2">
                <span className="code-font font-semibold text-foreground">{p.value}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${sevColor[p.severity]}`}>
                  {p.severity}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}

        {alerts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Model output
            </div>
            {alerts.map((a) => (
              <p key={a} className="text-xs text-muted-foreground pl-5">
                {a}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
