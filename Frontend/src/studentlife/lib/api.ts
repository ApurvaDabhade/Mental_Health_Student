export type HealthResponse = {
  status: string;
  models_loaded: string[];
  version?: string;
};

export type ExamplesResponse = {
  predict_request: Record<string, unknown>;
  anomaly_request_normal: Record<string, unknown>;
  anomaly_request_concerning?: Record<string, unknown>;
  feature_guide?: Record<string, unknown>;
};

export type PredictionResponse = {
  participant_id: string;
  predicted_activity_minutes: number;
  activity_score: number;
  status_indicator: string;
  interpretation: string;
  confidence?: number | null;
};

export type AnomalyResponse = {
  is_anomaly: boolean;
  reconstruction_error: number;
  threshold: number;
  anomaly_score: number;
  status_indicator: string;
  interpretation: string;
  recommendation?: string | null;
};

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}
