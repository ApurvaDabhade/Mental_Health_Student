import { useQuery } from "@tanstack/react-query";
import {
  fetchJson,
  type AnomalyResponse,
  type ExamplesResponse,
  type HealthResponse,
  type PredictionResponse,
} from "@/lib/api";

export type StudentLifeDashboard = {
  health: HealthResponse | null;
  examples: ExamplesResponse | null;
  prediction: PredictionResponse | null;
  anomaly: AnomalyResponse | null;
  error: string | null;
};

async function loadDashboard(): Promise<StudentLifeDashboard> {
  let health: HealthResponse | null = null;
  let examples: ExamplesResponse | null = null;
  let prediction: PredictionResponse | null = null;
  let anomaly: AnomalyResponse | null = null;
  let error: string | null = null;

  try {
    health = await fetchJson<HealthResponse>("/health");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    return { health, examples, prediction, anomaly, error };
  }

  try {
    examples = await fetchJson<ExamplesResponse>("/examples");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    return { health, examples, prediction, anomaly, error };
  }

  try {
    const [pred, ano] = await Promise.all([
      fetchJson<PredictionResponse>("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examples.predict_request),
      }),
      fetchJson<AnomalyResponse>("/anomaly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examples.anomaly_request_normal),
      }),
    ]);
    prediction = pred;
    anomaly = ano;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return { health, examples, prediction, anomaly, error };
}

export function useStudentLifeApi() {
  return useQuery({
    queryKey: ["studentlife-dashboard"],
    queryFn: loadDashboard,
    staleTime: 60_000,
    retry: 1,
  });
}
