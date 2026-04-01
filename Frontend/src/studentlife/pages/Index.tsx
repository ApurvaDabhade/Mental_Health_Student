import { SidebarProvider, SidebarTrigger } from "@sl/components/ui/sidebar";
import { AppSidebar } from "@sl/components/AppSidebar";
import { PatientProfilePanel } from "@sl/components/dashboard/PatientProfilePanel";
import { PhysiologicalPanel } from "@sl/components/dashboard/PhysiologicalPanel";
import { MentalHealthPanel } from "@sl/components/dashboard/MentalHealthPanel";
import { BehavioralPanel } from "@sl/components/dashboard/BehavioralPanel";
import { QuestionnairePanel } from "@sl/components/dashboard/QuestionnairePanel";
import { PredictiveAnalyticsPanel } from "@sl/components/dashboard/PredictiveAnalyticsPanel";
import { VisualizationPanel } from "@sl/components/dashboard/VisualizationPanel";
import { AlertPanel } from "@sl/components/dashboard/AlertPanel";
import { Brain, Activity, Loader2 } from "lucide-react";
import { useStudentLifeApi } from "@sl/hooks/useStudentLifeApi";

const Index = () => {
  const { data, isLoading } = useStudentLifeApi();
  const health = data?.health;
  const pred = data?.prediction;
  const ano = data?.anomaly;

  const apiOk = health?.status === "ok" && health.models_loaded.length > 0;
  const activityLabel =
    pred != null ? `${Math.round(pred.predicted_activity_minutes)} min` : isLoading ? "…" : "—";
  const anomalyLabel =
    ano != null ? (ano.is_anomaly ? "Anomaly" : "Normal") : isLoading ? "…" : "—";
  const anomalyStatus: "normal" | "warning" | "high" =
    ano == null ? "normal" : ano.is_anomaly ? "high" : ano.status_indicator === "yellow" ? "warning" : "normal";

  return (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 gap-3">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground">Manas Veda</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">Clinical Monitoring</span>
          {data?.participantId ? (
            <span
              className="text-xs text-muted-foreground hidden md:inline font-mono max-w-[140px] truncate"
              title={data.participantId}
            >
              · {data.participantId}
            </span>
          ) : null}
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" title={health ? health.models_loaded.join(", ") : ""}>
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${apiOk ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              )}
              <span className="hidden sm:inline">{apiOk ? "API" : "API (degraded)"}</span>
            </div>
            <span className="code-font hidden md:inline">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

            {/* Overview */}
            <section id="overview">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h1 className="text-lg font-bold text-foreground">Digital Health Dashboard</h1>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <QuickStat label="Predicted activity" value={activityLabel} status={pred?.status_indicator === "red" ? "high" : pred?.status_indicator === "yellow" ? "warning" : "normal"} />
                <QuickStat label="SpO₂" value="96%" status="normal" />
                <QuickStat label="Heart Rate" value="78 bpm" status="normal" />
                <QuickStat label="Anomaly check" value={anomalyLabel} status={anomalyStatus} />
              </div>
            </section>

            {/* Patient + Vitals */}
            <section id="patient">
              <SectionLabel text="Patient Profile" />
              <PatientProfilePanel />
            </section>

            <section id="vitals">
              <SectionLabel text="Vitals & Biomedical Sensors" />
              <PhysiologicalPanel />
            </section>

            {/* Mental + Behavioral */}
            <section id="mental">
              <SectionLabel text="Mental Health Assessment" />
              <MentalHealthPanel />
            </section>

            <section id="behavior">
              <SectionLabel text="Behavioral Phenotyping" />
              <BehavioralPanel />
            </section>

            {/* Surveys */}
            <section id="surveys">
              <SectionLabel text="Questionnaires & Surveys" />
              <QuestionnairePanel />
            </section>

            {/* Predictions */}
            <section id="predictions">
              <SectionLabel text="Predictive Analytics" />
              <PredictiveAnalyticsPanel />
            </section>

            {/* Charts */}
            <section id="charts">
              <SectionLabel text="Visualizations" />
              <VisualizationPanel />
            </section>

            {/* Alerts */}
            <section id="alerts">
              <SectionLabel text="Alerts & Recommendations" />
              <AlertPanel />
            </section>
          </div>

          <footer className="border-t border-border py-4 mt-8">
            <p className="text-center text-xs text-muted-foreground">
              Manas Veda · Digital Health Monitoring · Biomedical Instrumentation © {new Date().getFullYear()}
            </p>
          </footer>
        </main>
      </div>
    </div>
  </SidebarProvider>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{text}</h2>
);

const QuickStat = ({ label, value, status }: { label: string; value: string; status: string }) => {
  const color: Record<string, string> = {
    normal: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    warning: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    high: "text-red-400 border-red-400/20 bg-red-400/5",
  };
  return (
    <div className={`rounded-lg border p-3 ${color[status]}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-lg font-bold code-font mt-0.5">{value}</div>
    </div>
  );
};

export default Index;
