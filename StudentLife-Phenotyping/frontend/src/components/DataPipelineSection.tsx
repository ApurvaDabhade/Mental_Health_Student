import { AnimatedSection } from "./AnimatedSection";
import {
  Activity, Wifi, Moon, MapPin, Smartphone,
  Unlock, Volume2, Move
} from "lucide-react";

const sensors = [
  { icon: Move, label: "Accelerometer", desc: "Movement & activity patterns" },
  { icon: Volume2, label: "Audio Activity", desc: "Ambient sound classification" },
  { icon: Smartphone, label: "Screen Usage", desc: "On/off duration tracking" },
  { icon: Unlock, label: "Phone Lock", desc: "Unlock frequency & timing" },
  { icon: Wifi, label: "WiFi", desc: "Connection patterns & locations" },
  { icon: Moon, label: "Sleep", desc: "Duration & quality estimation" },
  { icon: MapPin, label: "Location", desc: "Unique places & movement radius" },
  { icon: Activity, label: "Time Patterns", desc: "Behavioral routines over time" },
];

const features = [
  "Total screen time per day",
  "Number of phone unlocks",
  "Sleep duration estimation",
  "Active movement time",
  "Unique locations visited",
  "Morning/Night activity levels",
  "Weekend vs weekday patterns",
  "Social interaction proximity",
];

export const DataPipelineSection = () => (
  <section id="pipeline" className="py-32 relative">
    <div className="container mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="text-primary code-font text-sm font-semibold tracking-wider uppercase">Data Pipeline</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            From Raw <span className="gradient-text">Sensors</span> to Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            8 passive sensor streams, cleaned, aligned, and engineered into meaningful behavioral features.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Sensor Grid */}
        <AnimatedSection delay={100}>
          <h3 className="text-lg font-semibold mb-6 text-foreground">Sensor Streams</h3>
          <div className="grid grid-cols-2 gap-3">
            {sensors.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 hover:border-primary/30 transition-colors group">
                <s.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Feature Engineering */}
        <AnimatedSection delay={200}>
          <h3 className="text-lg font-semibold mb-6 text-foreground">Engineered Features</h3>
          <div className="glass rounded-xl p-6">
            <div className="code-font text-sm space-y-2">
              <div className="text-muted-foreground mb-4"># Feature extraction pipeline</div>
              {features.map((f, i) => (
                <div key={f} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <span className="text-primary font-bold w-6 text-right">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 glass rounded-xl p-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">EMA Labels (Ground Truth)</h4>
            <div className="flex flex-wrap gap-2">
              {["Stress Level", "Mood", "Sleep Quality", "Social Interaction"].map((l) => (
                <span key={l} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent-foreground text-xs font-medium border border-accent/20">
                  {l}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Ecological Momentary Assessment — short self-reported surveys merged with sensor data.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);
