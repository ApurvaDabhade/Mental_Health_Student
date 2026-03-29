import { AnimatedSection } from "./AnimatedSection";

const endpoints = [
  { method: "POST", path: "/api/predict/stress", desc: "Predict stress level (1–5)", response: '{ "stress_level": 3, "confidence": 0.87 }' },
  { method: "POST", path: "/api/predict/activity", desc: "Predict activity score", response: '{ "activity_score": 0.72, "label": "moderate" }' },
  { method: "POST", path: "/api/predict/anomaly", desc: "Detect behavioral anomalies", response: '{ "anomaly_score": 0.94, "is_anomaly": true }' },
  { method: "GET", path: "/api/health", desc: "Service health check", response: '{ "status": "healthy", "model_version": "1.2.0" }' },
];

const methodColor: Record<string, string> = {
  GET: "text-success",
  POST: "text-warning",
};

export const APISection = () => (
  <section id="api" className="py-32 relative">
    <div className="container mx-auto px-6">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="text-primary code-font text-sm font-semibold tracking-wider uppercase">API Layer</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            FastAPI <span className="gradient-text">Endpoints</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Production-ready REST API with Swagger documentation for real-time predictions.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-3xl mx-auto space-y-4">
        {endpoints.map((ep, i) => (
          <AnimatedSection key={ep.path} delay={i * 100}>
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
                <span className={`code-font font-bold text-sm ${methodColor[ep.method]}`}>{ep.method}</span>
                <span className="code-font text-sm text-foreground">{ep.path}</span>
                <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{ep.desc}</span>
              </div>
              <div className="px-6 py-3 bg-background/40">
                <pre className="code-font text-xs text-muted-foreground overflow-x-auto">{ep.response}</pre>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);
