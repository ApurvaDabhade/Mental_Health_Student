import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, ShieldAlert, HeartPulse, Lightbulb, Phone, Loader2 } from "lucide-react";
import { useStudentLifeApi } from "@/hooks/useStudentLifeApi";

const fallbackAlerts = [
  { icon: ShieldAlert, type: "critical" as const, message: "High stress detected — sustained level ≥ 4 for 3 consecutive days" },
  { icon: AlertTriangle, type: "warning" as const, message: "Poor sleep quality — avg 5.2 hrs/night this week (below 7-hr threshold)" },
];

const recommendations = [
  { icon: HeartPulse, text: "Guided breathing exercise: 4-7-8 technique for 5 minutes before sleep" },
  { icon: Lightbulb, text: "Sleep hygiene: No screen time 1 hour before bed, maintain consistent schedule" },
  { icon: HeartPulse, text: "Physical activity: 30 min moderate exercise (walking, cycling) recommended daily" },
  { icon: Lightbulb, text: "Social interaction: Schedule peer study group to improve social engagement score" },
  { icon: Phone, text: "Emergency contact: University Counseling Center — (555) 123-4567 (24/7 crisis line)" },
];

const typeStyle: Record<string, string> = {
  critical: "border-l-red-400 bg-red-400/5",
  warning: "border-l-amber-400 bg-amber-400/5",
};

const typeIcon: Record<string, string> = {
  critical: "text-red-400",
  warning: "text-amber-400",
};

export const AlertPanel = () => {
  const { data, isLoading } = useStudentLifeApi();
  const pred = data?.prediction;
  const ano = data?.anomaly;

  const apiAlerts: { icon: typeof ShieldAlert; type: "critical" | "warning"; message: string }[] = [];
  if (ano) {
    apiAlerts.push({
      icon: ano.is_anomaly ? ShieldAlert : AlertTriangle,
      type: ano.is_anomaly ? "critical" : "warning",
      message: `${ano.interpretation} (error ${ano.reconstruction_error.toFixed(4)} vs threshold ${ano.threshold.toFixed(4)})`,
    });
  }
  if (pred) {
    apiAlerts.push({
      icon: AlertTriangle,
      type: pred.status_indicator === "red" ? "critical" : "warning",
      message: `Activity forecast: ${pred.interpretation} (${pred.predicted_activity_minutes} min predicted)`,
    });
  }

  const showFallback = apiAlerts.length === 0 && !isLoading && !data?.error;

  return (
    <Card className="border-border bg-card col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="w-4 h-4 text-primary" />
          Alerts & Clinical Recommendations
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top alerts reflect StudentLife API outputs when the dashboard loads; static examples show when the API is unavailable.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading API…
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Active Alerts</h4>
            <div className="space-y-2">
              {apiAlerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border-l-2 ${typeStyle[a.type]}`}>
                  <a.icon className={`w-4 h-4 mt-0.5 shrink-0 ${typeIcon[a.type]}`} />
                  <p className="text-sm text-foreground">{a.message}</p>
                </div>
              ))}
              {showFallback &&
                fallbackAlerts.map((a, i) => (
                  <div key={`fb-${i}`} className={`flex items-start gap-2 p-3 rounded-lg border-l-2 ${typeStyle[a.type]}`}>
                    <a.icon className={`w-4 h-4 mt-0.5 shrink-0 ${typeIcon[a.type]}`} />
                    <p className="text-sm text-foreground">{a.message}</p>
                  </div>
                ))}
              {data?.error && (
                <div className="flex items-start gap-2 p-3 rounded-lg border-l-2 border-l-amber-400 bg-amber-400/5">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                  <p className="text-sm text-foreground">Could not reach API: {data.error}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Recommendations</h4>
            <div className="space-y-2">
              {ano?.recommendation && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border-l-2 border-l-primary">
                  <HeartPulse className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{ano.recommendation}</p>
                </div>
              )}
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border-l-2 border-l-primary">
                  <r.icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
