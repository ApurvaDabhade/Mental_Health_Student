import { AnimatedSection } from "./AnimatedSection";
import { Box, Database, FlaskConical, Server, FileCode, TestTube } from "lucide-react";

const techGroups = [
  {
    title: "ML & Data",
    items: ["Python", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "PyTorch", "TensorFlow", "Pandas", "NumPy"],
  },
  {
    title: "Deep Learning",
    items: ["LSTM", "Transformer", "Autoencoder", "MLP", "Attention Mechanisms"],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Docker Compose", "FastAPI", "MLflow", "Uvicorn"],
  },
  {
    title: "Analysis",
    items: ["Matplotlib", "Seaborn", "Plotly", "Jupyter", "SciPy"],
  },
];

const dockerFiles = [
  { icon: Box, name: "Dockerfile", desc: "API service" },
  { icon: FlaskConical, name: "Dockerfile.train", desc: "Training pipeline" },
  { icon: Database, name: "Dockerfile.mlflow", desc: "Experiment tracker" },
  { icon: Server, name: "docker-compose.yml", desc: "Full orchestration" },
];

export const TechStackSection = () => (
  <section id="tech" className="py-32 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.05)_0%,_transparent_70%)]" />
    <div className="relative container mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="text-primary code-font text-sm font-semibold tracking-wider uppercase">Technology</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            Built <span className="gradient-text">With</span>
          </h2>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {techGroups.map((group, i) => (
          <AnimatedSection key={group.title} delay={i * 100}>
            <div className="glass rounded-xl p-6 h-full">
              <h3 className="font-semibold text-foreground mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={200}>
        <h3 className="text-lg font-semibold text-foreground text-center mb-8">Docker Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {dockerFiles.map((d) => (
            <div key={d.name} className="glass rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
              <d.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="code-font text-xs font-semibold text-foreground">{d.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{d.desc}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);
