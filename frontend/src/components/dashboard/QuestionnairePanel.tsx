import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";

const questionnaires = [
  { name: "Daily Stress", status: "completed", score: "7/10", time: "08:30 AM" },
  { name: "Mood Assessment", status: "completed", score: "5/10", time: "08:32 AM" },
  { name: "Sleep Quality", status: "completed", score: "4/10", time: "08:28 AM" },
  { name: "Anxiety (GAD-7)", status: "completed", score: "12/21", time: "08:35 AM" },
  { name: "Academic Workload", status: "pending", score: "—", time: "Due 6 PM" },
  { name: "Social Interaction", status: "completed", score: "3/10", time: "08:40 AM" },
  { name: "Lifestyle & Habits", status: "overdue", score: "—", time: "Due yesterday" },
  { name: "Physical Activity", status: "pending", score: "—", time: "Due 9 PM" },
  { name: "Eating Habits", status: "completed", score: "6/10", time: "08:45 AM" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; cls: string; label: string }> = {
  completed: { icon: CheckCircle, cls: "text-emerald-400", label: "Done" },
  pending: { icon: Clock, cls: "text-amber-400", label: "Pending" },
  overdue: { icon: AlertCircle, cls: "text-red-400", label: "Overdue" },
};

export const QuestionnairePanel = () => (
  <Card className="border-border bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <ClipboardList className="w-4 h-4 text-primary" />
        Questionnaires & Surveys
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        {questionnaires.map((q) => {
          const s = statusConfig[q.status];
          return (
            <div key={q.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <s.icon className={`w-3.5 h-3.5 ${s.cls}`} />
                <span className="text-sm text-foreground">{q.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="code-font text-sm font-semibold text-foreground">{q.score}</span>
                <span className="text-xs text-muted-foreground">{q.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
