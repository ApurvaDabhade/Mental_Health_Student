import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight } from "lucide-react";

const steps = [
  { num: "01", title: "Collect", desc: "Raw sensor data from 48 student smartphones over 10 weeks", color: "text-primary" },
  { num: "02", title: "Clean & Align", desc: "Remove noise, fix timestamps, normalize to hourly intervals", color: "text-primary" },
  { num: "03", title: "Engineer Features", desc: "Transform raw signals into behavioral metrics", color: "text-primary" },
  { num: "04", title: "Merge EMA Labels", desc: "Combine features with self-reported stress surveys", color: "text-accent" },
  { num: "05", title: "Train Models", desc: "12+ ML models including ensemble, LSTM, Transformer", color: "text-accent" },
  { num: "06", title: "Evaluate", desc: "Compare performance, select best models per task", color: "text-accent" },
  { num: "07", title: "Serve via API", desc: "FastAPI endpoints for real-time predictions", color: "text-success" },
  { num: "08", title: "Track & Deploy", desc: "MLflow experiments + Dockerized pipelines", color: "text-success" },
];

export const ArchitectureSection = () => (
  <section id="architecture" className="py-32 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--accent)/0.05)_0%,_transparent_70%)]" />
    <div className="relative container mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="text-primary code-font text-sm font-semibold tracking-wider uppercase">System Design</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            End-to-End <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete production ML pipeline — from raw data collection to deployed predictions.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <AnimatedSection key={step.num} delay={i * 80}>
            <div className="flex items-start gap-6 mb-2">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center code-font font-bold text-sm ${step.color}`}>
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
              <div className="pt-2 pb-4">
                <h3 className={`font-bold text-lg ${step.color}`}>{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
