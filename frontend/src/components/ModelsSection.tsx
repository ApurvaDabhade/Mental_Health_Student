import { AnimatedSection } from "./AnimatedSection";
import { Trophy, TrendingUp, AlertTriangle } from "lucide-react";

interface ModelCardProps {
  name: string;
  type: string;
  isBest?: boolean;
}

const ModelCard = ({ name, type, isBest }: ModelCardProps) => (
  <div className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
    isBest
      ? "bg-primary/15 border border-primary/30 text-primary"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }`}>
    <div className="flex items-center justify-between">
      <span>{name}</span>
      {isBest && <Trophy className="w-3.5 h-3.5" />}
    </div>
    <span className="text-xs text-muted-foreground">{type}</span>
  </div>
);

const predictions = [
  {
    icon: TrendingUp,
    title: "Stress Prediction",
    scale: "1–5 Scale",
    best: "Soft Voting Ensemble",
    desc: "Combines the best traditional and deep learning models via soft voting for robust stress classification.",
    levels: [
      { val: 1, label: "Great", color: "bg-success" },
      { val: 2, label: "Good", color: "bg-success/70" },
      { val: 3, label: "Mild", color: "bg-warning/70" },
      { val: 4, label: "Stressed", color: "bg-warning" },
      { val: 5, label: "High", color: "bg-destructive" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Activity Prediction",
    scale: "Activity Score",
    best: "Transformer",
    desc: "Self-attention mechanism captures temporal dependencies in movement and behavior sequences.",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    scale: "Anomaly Score",
    best: "LSTM Autoencoder",
    desc: "Learns normal behavior patterns and flags deviations like sudden isolation, drastic routine changes, or irregular sleep.",
  },
];

const models = {
  traditional: [
    { name: "Ridge Regression", type: "Linear" },
    { name: "Logistic Regression", type: "Linear" },
    { name: "Random Forest", type: "Ensemble" },
    { name: "Extra Trees", type: "Ensemble" },
    { name: "XGBoost", type: "Boosting", isBest: false },
    { name: "LightGBM", type: "Boosting" },
    { name: "CatBoost", type: "Boosting" },
    { name: "SVM", type: "Kernel" },
  ],
  deep: [
    { name: "LSTM", type: "Recurrent" },
    { name: "Transformer", type: "Attention", isBest: true },
    { name: "Autoencoder", type: "Generative", isBest: true },
    { name: "MLP", type: "Feedforward" },
  ],
};

export const ModelsSection = () => (
  <section id="models" className="py-32 relative">
    <div className="container mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="text-primary code-font text-sm font-semibold tracking-wider uppercase">Machine Learning</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            <span className="gradient-text">12+ Models</span> Compared
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From classical ML to deep learning — trained, evaluated, and ensembled for maximum performance.
          </p>
        </div>
      </AnimatedSection>

      {/* Prediction Tasks */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {predictions.map((p, i) => (
          <AnimatedSection key={p.title} delay={i * 100}>
            <div className="glass rounded-2xl p-6 h-full glow-card">
              <p.icon className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">{p.title}</h3>
              <span className="code-font text-xs text-primary">{p.scale}</span>
              <p className="text-sm text-muted-foreground mt-3 mb-4">{p.desc}</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{p.best}</span>
              </div>
              {p.levels && (
                <div className="mt-4 space-y-1.5">
                  {p.levels.map((l) => (
                    <div key={l.val} className="flex items-center gap-3 text-xs">
                      <div className={`w-2 h-2 rounded-full ${l.color}`} />
                      <span className="text-muted-foreground w-4">{l.val}</span>
                      <span className="text-foreground">{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Model Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <AnimatedSection delay={100}>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Traditional Models</h3>
          <div className="grid grid-cols-2 gap-2">
            {models.traditional.map((m) => (
              <ModelCard key={m.name} {...m} />
            ))}
          </div>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Deep Learning Models</h3>
          <div className="grid grid-cols-2 gap-2">
            {models.deep.map((m) => (
              <ModelCard key={m.name} {...m} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);
