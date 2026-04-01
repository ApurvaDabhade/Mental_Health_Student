import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchJson,
  type AnomalyResponse,
  type ExamplesResponse,
  type HealthResponse,
  type PredictionResponse,
} from "@sl/lib/api";
import { StressReportStudentContext } from "../../context/StressReportStudentContext.jsx";

export type StudentLifeDashboard = {
  health: HealthResponse | null;
  examples: ExamplesResponse | null;
  prediction: PredictionResponse | null;
  anomaly: AnomalyResponse | null;
  error: string | null;
  participantId: string | null;
};

async function loadDashboard(participantId: string | null): Promise<StudentLifeDashboard> {
  let health: HealthResponse | null = null;
  let examples: ExamplesResponse | null = null;
  let prediction: PredictionResponse | null = null;
  let anomaly: AnomalyResponse | null = null;
  let error: string | null = null;

  try {
    health = await fetchJson<HealthResponse>("/health");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    return { health, examples, prediction, anomaly, error, participantId: participantId };
  }

  try {
    examples = await fetchJson<ExamplesResponse>("/examples");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    return { health, examples, prediction, anomaly, error, participantId: participantId };
  }

  const pid =
    participantId ||
    (typeof examples.predict_request?.participant_id === "string"
      ? examples.predict_request.participant_id
      : "demo_user");

  try {
    const predictBody = {
      ...examples.predict_request,
      participant_id: pid,
    };
    const [pred, ano] = await Promise.all([
      fetchJson<PredictionResponse>("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictBody),
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

  return { health, examples, prediction, anomaly, error, participantId: pid };
}

export function useStudentLifeApi() {
  const { studentId } = useContext(StressReportStudentContext);
  const participantId = studentId || null;

  return useQuery({
    queryKey: ["studentlife-dashboard", participantId ?? "anonymous"],
    queryFn: () => loadDashboard(participantId),
    staleTime: 60_000,
    retry: 1,
  });
}
