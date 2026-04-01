const REPORT_PREFIX = "manasVeda_studentStressReport_v1_";

function keyForUser(userId) {
  if (!userId) return null;
  return `${REPORT_PREFIX}${userId}`;
}

export function loadStressReport(userId) {
  if (!userId) {
    return {
      assessmentHistory: [],
      latestAssessment: null,
      updatedAt: null,
    };
  }
  const k = keyForUser(userId);
  try {
    const raw = localStorage.getItem(k);
    if (raw) {
      return JSON.parse(raw);
    }
    // One-time migration from legacy global key
    const legacy = localStorage.getItem("latestAssessmentResult");
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const migrated = {
        assessmentHistory: [parsed],
        latestAssessment: parsed,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(k, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return {
    assessmentHistory: [],
    latestAssessment: null,
    updatedAt: null,
  };
}

export function saveLatestAssessment(userId, payload) {
  if (!userId) return;
  const prev = loadStressReport(userId);
  const entry = {
    ...payload,
    savedAt: new Date().toISOString(),
  };
  const assessmentHistory = [...(prev.assessmentHistory || []), entry].slice(-24);
  const next = {
    assessmentHistory,
    latestAssessment: entry,
    updatedAt: entry.savedAt,
  };
  try {
    localStorage.setItem(keyForUser(userId), JSON.stringify(next));
  } catch {
    /* quota */
  }
}

/** Map latest assessment total to a simple 0–100 index for the report UI (not clinical). */
export function stressIndexFromAssessment(latest) {
  if (!latest || latest.total_score == null) return null;
  const max =
    latest.maxScore != null
      ? Number(latest.maxScore)
      : latest.assessmentType === "GAD7"
        ? 21
        : latest.assessmentType === "PHQ9"
          ? 27
          : 27;
  const t = Number(latest.total_score);
  if (Number.isNaN(t) || !max) return null;
  return Math.min(100, Math.round((t / max) * 100));
}
