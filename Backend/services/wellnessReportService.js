/** Derive BMI and category */
export function computeBmi(heightCm, weightKg) {
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!h || !w) return { bmi: null, category: "Unknown" };
  const bmi = w / (h * h);
  if (!Number.isFinite(bmi)) return { bmi: null, category: "Unknown" };
  const rounded = Math.round(bmi * 10) / 10;
  let category = "Normal";
  if (rounded < 18.5) category = "Underweight";
  else if (rounded < 25) category = "Normal";
  else if (rounded < 30) category = "Overweight";
  else category = "Obese";
  return { bmi: rounded, category };
}

function latestByModule(assessments, module) {
  const list = (assessments || []).filter((a) => a.module === module);
  if (!list.length) return null;
  return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
}

/** Build recommendation list from profile + latest assessments */
export function buildRecommendations(profile, assessments = []) {
  const rec = [];
  if (!profile) return rec;

  const sleep = profile.sleepHours;
  if (sleep != null && sleep < 6) {
    rec.push("Your sleep duration is low. Aim for 7–8 hours and a consistent bedtime.");
  }
  const screen = profile.screenTimeHours;
  if (screen != null && screen > 8) {
    rec.push("High screen time detected. Reduce device use before bedtime.");
  }
  const water = profile.waterIntakeLiters;
  if (water != null && water < 2) {
    rec.push("Increase hydration (target ~2 L/day) to support focus and energy.");
  }
  const stress = profile.stressLevel;
  const burnout = profile.burnoutLevel;
  if (stress != null && burnout != null && stress > 7 && burnout > 6) {
    rec.push("High stress and burnout signals. Consider counselling or peer support.");
  }
  const steps = profile.dailySteps ?? profile.walkingSteps;
  if (steps != null && steps < 5000) {
    rec.push("Try walking at least 5,000 steps daily for mood and cardiovascular health.");
  }

  const phq = latestByModule(assessments, "PHQ9");
  if (phq && phq.totalScore >= 15) {
    rec.push("PHQ-9 suggests significant symptoms. Consider speaking with a mental health professional.");
  }
  const gad = latestByModule(assessments, "GAD7");
  if (gad && gad.totalScore >= 10) {
    rec.push("GAD-7 indicates elevated anxiety. Breathing exercises and structured worry time may help.");
  }

  if (rec.length === 0) {
    rec.push("Keep up your routines. Re-check assessments periodically to track trends.");
  }
  return rec.slice(0, 8);
}

/** Aggregate stress report payload for API */
export function buildStressReportPayload(profile, assessments) {
  const { bmi, category: bmiCategory } = computeBmi(profile?.heightCm, profile?.weightKg);

  const stress = profile?.stressLevel ?? null;
  const anxiety = profile?.anxietyLevel ?? null;
  const sleepQ = profile?.sleepQuality ?? null;
  const burnout = profile?.burnoutLevel ?? null;

  const phq = latestByModule(assessments, "PHQ9");
  const gad = latestByModule(assessments, "GAD7");

  const depressionRisk =
    phq == null ? null : phq.totalScore <= 4 ? "Low" : phq.totalScore <= 9 ? "Mild" : phq.totalScore <= 14 ? "Moderate" : "High";

  const recommendations = buildRecommendations(profile, assessments);

  const p =
    profile &&
    (typeof profile.toObject === "function" ? profile.toObject() : { ...profile });
  return {
    profile: p
      ? {
          ...p,
          bmi: bmi ?? p.bmi,
          bmiCategory: bmiCategory || p.bmiCategory,
        }
      : null,
    bmi,
    bmiCategory,
    summary: {
      stress: stress ?? null,
      anxiety: anxiety ?? null,
      sleepQuality: sleepQ ?? null,
      burnout: burnout ?? null,
      mood: profile?.moodRating ?? null,
    },
    assessments: assessments.map((a) => ({
      module: a.module,
      totalScore: a.totalScore,
      severity: a.severity,
      createdAt: a.createdAt,
    })),
    phq9: phq ? { score: phq.totalScore, severity: phq.severity } : null,
    gad7: gad ? { score: gad.totalScore, severity: gad.severity } : null,
    depressionRisk,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}
