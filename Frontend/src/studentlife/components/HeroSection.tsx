import { AnimatedSection } from "./AnimatedSection";
import { Brain, Activity, Smartphone, BarChart3, Github, FileText } from "lucide-react";

const stats = [
  { value: "48", label: "Students Tracked" },
  { value: "10", label: "Weeks of Data" },
  { value: "12+", label: "ML Models" },
  { value: "8", label: "Sensor Streams" },
];

export const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
    </div>

    <div className="relative z-10 container mx-auto px-6 text-center">
      <AnimatedSection>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
          <Brain className="w-4 h-4 text-primary" />
          <span>Digital Mental Health & Behavioral Phenotyping</span>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
          <span className="gradient-text">Manas Veda</span>
          <br />
          <span className="text-foreground">Phenotyping</span>
        </h1>
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          An end-to-end ML system that passively predicts student stress levels
          from smartphone sensor data — no surveys needed.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={300}>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { icon: Smartphone, label: "Passive Sensing" },
            { icon: Brain, label: "Deep Learning" },
            { icon: Activity, label: "Anomaly Detection" },
            { icon: BarChart3, label: "MLflow Tracking" },
          ].map((tag) => (
            <span key={tag.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
              <tag.icon className="w-4 h-4 text-primary" />
              {tag.label}
            </span>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={400}>
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <a href="#architecture" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary">
            Explore Architecture
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-lg glass font-semibold hover:bg-secondary transition-colors inline-flex items-center gap-2">
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
          <a href="#" className="px-8 py-3 rounded-lg glass font-semibold hover:bg-secondary transition-colors inline-flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Read Paper
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 glow-card">
              <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);
