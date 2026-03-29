import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Unlock, Moon, MapPin, MessageSquare, BarChart3, Clock, WifiOff } from "lucide-react";

const behaviors = [
  { icon: Smartphone, label: "Screen Time", value: "6.8 hrs", trend: "↑", trendColor: "text-red-400" },
  { icon: Unlock, label: "Phone Unlocks", value: "87", trend: "↑", trendColor: "text-red-400" },
  { icon: Moon, label: "Night Device Usage", value: "2.1 hrs", trend: "↑", trendColor: "text-amber-400" },
  { icon: MapPin, label: "Mobility Score", value: "32/100", trend: "↓", trendColor: "text-red-400" },
  { icon: MapPin, label: "Unique Locations", value: "3", trend: "↓", trendColor: "text-amber-400" },
  { icon: MessageSquare, label: "Communication Activity", value: "12 msgs", trend: "↓", trendColor: "text-amber-400" },
  { icon: BarChart3, label: "Routine Consistency", value: "41%", trend: "↓", trendColor: "text-red-400" },
  { icon: Clock, label: "Inactivity Periods", value: "4.2 hrs", trend: "↑", trendColor: "text-amber-400" },
  { icon: WifiOff, label: "Isolation Indicator", value: "Moderate", trend: "—", trendColor: "text-amber-400" },
];

export const BehavioralPanel = () => (
  <Card className="border-border bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Smartphone className="w-4 h-4 text-primary" />
        Behavioral Phenotyping
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        {behaviors.map((b) => (
          <div key={b.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2">
              <b.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">{b.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="code-font text-sm font-semibold text-foreground">{b.value}</span>
              <span className={`text-xs font-bold ${b.trendColor}`}>{b.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
