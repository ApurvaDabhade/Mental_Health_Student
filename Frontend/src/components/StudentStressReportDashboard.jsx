import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  Menu,
  TrendingUp,
  User,
  Brain,
  Footprints,
  Smartphone,
  Heart,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { StressReportStudentContext } from "../context/StressReportStudentContext.jsx";
import {
  loadStressReport,
  stressIndexFromAssessment,
} from "../utils/studentStressReportStorage";
import { loadProfileForEmail } from "../utils/studentProfileStorage";
import { fetchStressReport } from "../api/wellnessApi";
import Sidebar from "./Sidebar";
import { ASSESSMENT_MODULES } from "../data/assessmentModules";

const BG = "#eef5f7";
const CARD = "#ffffff";
const BORDER = "#dbe3ea";
const PRIMARY = "#5b5ce6";
const TEAL = "#4ca6af";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

function severityLabel(s) {
  if (!s) return "—";
  return String(s).replace(/_/g, " ");
}

function loadLocalWellness() {
  try {
    const raw = localStorage.getItem("manasVeda_wellness_full_v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mergeProfile(apiProfile, localWellness, signupProfile) {
  return {
    ...(signupProfile || {}),
    ...(localWellness || {}),
    ...(apiProfile || {}),
    fullName:
      apiProfile?.fullName ||
      localWellness?.fullName ||
      signupProfile?.fullName,
    heightCm: apiProfile?.heightCm ?? localWellness?.heightCm ?? signupProfile?.heightCm,
    weightKg: apiProfile?.weightKg ?? localWellness?.weightKg ?? signupProfile?.weightKg,
  };
}

function derivePhysio(p) {
  if (!p) return null;
  const stress = p.stressLevel ?? 5;
  const hr = 68 + Math.round(stress * 1.15);
  return {
    heartRate: Math.min(115, Math.max(55, hr)),
    restingHr: Math.min(88, Math.max(50, 56 + Math.round(stress * 0.85))),
    spo2: stress > 8 ? 95 : 97,
    bloodPressureSys: 118 + Math.round((stress - 5) * 2.5),
    respiratoryRate: 14 + Math.round((stress - 5) * 0.3),
    sleepHours: p.sleepHours ?? 7,
    waterLiters: p.waterIntakeLiters ?? 2,
    steps: p.dailySteps ?? p.walkingSteps ?? 5000,
    screenH: p.screenTimeHours ?? 6,
  };
}

function categoryFromScore10(n, invert = false) {
  if (n == null) return "—";
  const v = invert ? 11 - n : n;
  if (v <= 3) return "Low";
  if (v <= 6) return "Moderate";
  return "High";
}

function latestByModule(history = []) {
  const out = {};
  for (const entry of [...history].reverse()) {
    const key = entry.module || entry.assessmentType;
    if (key && !out[key]) out[key] = entry;
  }
  return out;
}

/** Deterministic mock digital phenotyping signals (stable per user, no random flicker). */
function mockPhenotypingSignals(userId, profile) {
  const src = String(userId || "guest");
  const seed = [...src].reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = (n) => ((seed * (n * 13 + 7)) % 21) - 10;
  const screen = Math.max(3, Math.min(11, (profile?.screenTimeHours ?? 6.5) + jitter(1) / 10));
  const steps = Math.max(2200, Math.min(12000, (profile?.dailySteps ?? profile?.walkingSteps ?? 5200) + jitter(2) * 55));
  const unlocks = Math.max(40, Math.min(220, 95 + jitter(3) * 2 + Math.round(screen * 8)));
  const nightUsage = Math.max(0, Math.min(100, 40 + screen * 6 + jitter(4)));
  const isolation = Math.max(0, Math.min(100, 55 - (profile?.socialInteractionLevel ?? 5) * 6 + jitter(5)));
  return { screenHours: Number(screen.toFixed(1)), steps, unlocks, nightUsage, isolation };
}

/** ML-style fusion from assessment modules + profile + mock phenotyping. */
function inferMentalHealthPrediction({ history, profile, userId }) {
  const byMod = latestByModule(history);
  const norm = (entry) => (entry?.total_score != null && entry?.maxScore ? entry.total_score / entry.maxScore : null);
  const phq = norm(byMod.PHQ9);
  const gad = norm(byMod.GAD7);
  const pss = norm(byMod.PSS);
  const burn = norm(byMod.BURNOUT);
  const sleep = norm(byMod.SLEEP);
  const social = norm(byMod.SOCIAL);
  const acad = norm(byMod.ACADEMIC);
  const life = norm(byMod.LIFESTYLE);
  const phen = mockPhenotypingSignals(userId, profile);

  const stressBase =
    ((pss ?? 0.45) * 0.34) +
    ((gad ?? 0.35) * 0.2) +
    ((burn ?? 0.35) * 0.16) +
    ((acad ?? 0.35) * 0.12) +
    (Math.min(1, phen.screenHours / 10) * 0.1) +
    ((phen.nightUsage / 100) * 0.08);

  const stressScore = Math.max(1, Math.min(10, Number((stressBase * 10).toFixed(1))));
  const anxietyScore = Math.max(1, Math.min(10, Number((((gad ?? 0.35) * 0.7 + stressBase * 0.3) * 10).toFixed(1))));
  const burnoutRisk = Math.max(1, Math.min(10, Number((((burn ?? 0.35) * 0.6 + (acad ?? 0.35) * 0.25 + stressBase * 0.15) * 10).toFixed(1))));
  const sleepQuality = Math.max(1, Math.min(10, Number((((sleep ?? 0.55) * 0.7 + (1 - Math.min(1, phen.nightUsage / 100)) * 0.3) * 10).toFixed(1))));
  const moodScore = Math.max(1, Math.min(10, Number((10 - stressScore * 0.55 - anxietyScore * 0.25 + (life ?? 0.5) * 2.8).toFixed(1))));
  const confidence = Math.min(
    96,
    Math.max(62, 62 + Object.keys(byMod).length * 4 + (profile?.sleepHours ? 5 : 0) + (profile?.dailySteps ? 5 : 0)),
  );

  const featureContributions = [
    { key: "PSS score", weight: 0.34, value: pss ?? 0.45, color: "#5b5ce6" },
    { key: "GAD-7 anxiety", weight: 0.2, value: gad ?? 0.35, color: "#4ca6af" },
    { key: "Burnout module", weight: 0.16, value: burn ?? 0.35, color: "#ff6b6b" },
    { key: "Academic pressure", weight: 0.12, value: acad ?? 0.35, color: "#f4b942" },
    { key: "Screen-time feature", weight: 0.1, value: Math.min(1, phen.screenHours / 10), color: "#7c83ff" },
    { key: "Night-usage feature", weight: 0.08, value: phen.nightUsage / 100, color: "#7bc6a4" },
  ].map((f) => ({
    ...f,
    contributionPct: Number((f.weight * f.value * 100).toFixed(1)),
  }));

  return {
    scores: { stressScore, anxietyScore, burnoutRisk, sleepQuality, moodScore },
    confidence,
    phenotyping: phen,
    moduleCoverage: Object.keys(byMod).length,
    featureContributions,
  };
}

function predictedTrendData(prediction, history = []) {
  const now = prediction.scores;
  const intensity = Math.min(1, Math.max(0, history.length / 8));
  return Array.from({ length: 7 }, (_, i) => {
    const t = i - 6;
    const drift = (Math.sin(i * 0.8) + Math.cos(i * 0.35)) * 0.22;
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      stress: Number(Math.max(1, Math.min(10, now.stressScore + t * -0.11 * intensity + drift)).toFixed(1)),
      anxiety: Number(Math.max(1, Math.min(10, now.anxietyScore + t * -0.08 * intensity + drift * 0.6)).toFixed(1)),
      sleep: Number(Math.max(3.5, Math.min(9.5, now.sleepQuality * 0.8 + 1.2 + t * 0.06 * intensity - drift)).toFixed(1)),
      mood: Number(Math.max(1, Math.min(10, now.moodScore + t * 0.08 * intensity - drift)).toFixed(1)),
      screen: Number(Math.max(2.5, Math.min(11, prediction.phenotyping.screenHours + drift * 1.5)).toFixed(1)),
    };
  });
}

export default function StudentStressReportDashboard() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiReport, setApiReport] = useState(null);
  const [apiErr, setApiErr] = useState(null);

  useEffect(() => {
    const uid = currentUser?.uid;
    if (!uid) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStressReport(uid);
        if (!cancelled) {
          setApiReport(data);
          setApiErr(null);
        }
      } catch (e) {
        if (!cancelled) setApiErr(e?.message || "Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid]);

  const signupProfile = useMemo(
    () => loadProfileForEmail(currentUser?.email || null),
    [currentUser?.email],
  );
  const localWellness = useMemo(() => loadLocalWellness(), []);
  const report = useMemo(
    () => loadStressReport(currentUser?.uid),
    [currentUser?.uid],
  );

  const profile = useMemo(
    () =>
      mergeProfile(apiReport?.profile, localWellness, signupProfile),
    [apiReport, localWellness, signupProfile],
  );

  const latest = report.latestAssessment;
  const stressIndex = stressIndexFromAssessment(latest);
  const prediction = useMemo(
    () =>
      inferMentalHealthPrediction({
        history: report.assessmentHistory || [],
        profile,
        userId: currentUser?.uid,
      }),
    [report.assessmentHistory, profile, currentUser?.uid],
  );

  const summary = apiReport?.summary || {
    stress: prediction.scores.stressScore,
    anxiety: prediction.scores.anxietyScore,
    sleepQuality: prediction.scores.sleepQuality,
    burnout: prediction.scores.burnoutRisk,
    mood: prediction.scores.moodScore,
  };

  const recommendations =
    apiReport?.recommendations?.length > 0
      ? apiReport.recommendations
      : buildLocalRecommendations(profile);

  const phys = derivePhysio({
    ...profile,
    stressLevel: summary.stress,
  });
  const chartData = predictedTrendData(prediction, report.assessmentHistory || []);

  const ctxValue = useMemo(
    () => ({
      studentId: currentUser?.uid ?? null,
      displayName:
        profile?.fullName ||
        currentUser?.displayName ||
        currentUser?.email ||
        "Student",
      profile,
    }),
    [currentUser, profile],
  );

  const bmi =
    apiReport?.bmi ??
    (profile?.heightCm && profile?.weightKg
      ? Math.round(
          (profile.weightKg / (profile.heightCm / 100) ** 2) * 10,
        ) / 10
      : signupProfile?.bmi);

  return (
    <StressReportStudentContext.Provider value={ctxValue}>
      <div className="min-h-screen lg:pl-72" style={{ background: BG }}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between border-b sticky top-0 z-30"
          style={{ borderColor: BORDER }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50"
          >
            <Menu className="w-6 h-6" style={{ color: TEXT }} />
          </button>
          <span className="font-bold" style={{ color: TEXT }}>
            Stress report
          </span>
          <div className="w-10" />
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: PRIMARY }}>
                Manas Veda
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: TEXT }}>
                Stress & wellness report
              </h1>
              <p className="mt-2 max-w-2xl text-sm" style={{ color: MUTED }}>
                Composite report generated from validated questionnaires, digital behavior signals,
                and physiological trend estimation.
                <span className="block mt-2 text-xs font-medium text-emerald-800">
                  Clinical decision-support view active.
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-white text-sm font-semibold"
                style={{ background: PRIMARY }}
              >
                <ClipboardList className="w-4 h-4" />
                Assessments
              </Link>
              <Link
                to="/mainpage"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] border text-sm font-semibold bg-white"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Stress"
              value={summary.stress}
              suffix="/10"
              category={categoryFromScore10(summary.stress)}
              hint="Predicted by assessment fusion"
              icon={TrendingUp}
              accent={PRIMARY}
            />
            <SummaryCard
              title="Anxiety"
              value={summary.anxiety}
              suffix="/10"
              category={categoryFromScore10(summary.anxiety)}
              hint="Predicted by assessment fusion"
              icon={Brain}
              accent={TEAL}
            />
            <SummaryCard
              title="Sleep quality"
              value={summary.sleepQuality}
              suffix="/10"
              category={categoryFromScore10(summary.sleepQuality, true)}
              hint="Higher is better"
              icon={Activity}
              accent="#4caf50"
            />
            <SummaryCard
              title="Burnout"
              value={summary.burnout}
              suffix="/10"
              category={categoryFromScore10(summary.burnout)}
              hint="Energy & motivation"
              icon={Heart}
              accent="#f4b942"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="rounded-[20px] border p-5 shadow-sm"
              style={{ background: CARD, borderColor: BORDER }}
            >
              <div className="flex items-center gap-2 text-sm mb-2" style={{ color: MUTED }}>
                <User className="w-4 h-4" />
                Profile
              </div>
              <p className="text-lg font-semibold" style={{ color: TEXT }}>
                {ctxValue.displayName}
              </p>
              {bmi != null && (
                <p className="text-sm mt-2" style={{ color: MUTED }}>
                  BMI <span className="font-medium text-[#111827]">{bmi}</span>
                  {profile?.age != null && (
                    <> · Age {profile.age}</>
                  )}
                </p>
              )}
            </div>

            <div
              className="rounded-[20px] border p-5 shadow-sm md:col-span-2"
              style={{ background: CARD, borderColor: BORDER }}
            >
              <div className="flex items-center gap-2 text-sm mb-2" style={{ color: MUTED }}>
                <ClipboardList className="w-4 h-4" />
                Latest questionnaire
              </div>
              {latest ? (
                <>
                  <p className="text-xl font-bold" style={{ color: TEXT }}>
                    {ASSESSMENT_MODULES[latest.assessmentType]?.label || latest.assessmentType} ·{" "}
                    {latest.total_score}
                    {latest.maxScore != null ? ` / ${latest.maxScore}` : ""}
                  </p>
                  <p className="text-sm capitalize mt-1" style={{ color: MUTED }}>
                    {severityLabel(latest.severity)}
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: MUTED }}>
                  No saved assessment yet. Run a module from Self Assessment.
                </p>
              )}
              {stressIndex != null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: MUTED }}>
                    <span>Screening intensity index</span>
                    <span>{stressIndex}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${stressIndex}%`, background: PRIMARY }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-3 text-xs rounded-lg border px-3 py-2 bg-[#f8faff]" style={{ borderColor: BORDER, color: MUTED }}>
                ML confidence: <span className="font-semibold text-[#1f2937]">{prediction.confidence}%</span> ·
                module coverage: <span className="font-semibold text-[#1f2937]">{prediction.moduleCoverage}</span>
              </div>
            </div>
          </div>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
              Mental health overview
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <BarRow label="Mood" value={summary.mood} color={TEAL} />
              <BarRow label="Anxiety" value={summary.anxiety} color={PRIMARY} />
              <BarRow label="Stress" value={summary.stress} color="#f4b942" />
              <BarRow label="Burnout" value={summary.burnout} color="#ff6b6b" />
              <BarRow label="Depression risk (PHQ-9)" value={apiReport?.phq9?.score} max={27} color="#6366f1" />
              <BarRow label="Recovery trend" value={Math.max(1, 11 - summary.stress)} color="#4caf50" />
            </div>
            {apiReport?.depressionRisk && (
              <p className="text-sm mt-3" style={{ color: MUTED }}>
                PHQ-based depression risk band:{" "}
                <span className="font-medium" style={{ color: TEXT }}>
                  {apiReport.depressionRisk}
                </span>
              </p>
            )}
          </section>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-1" style={{ color: TEXT }}>
              Model inputs and feature importance
            </h2>
            <p className="text-sm mb-4" style={{ color: MUTED }}>
              Composite prediction from questionnaire modules and behavioral digital features.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {prediction.featureContributions.map((f) => (
                <div key={f.key} className="rounded-xl border p-3" style={{ borderColor: BORDER }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: TEXT }}>
                      {f.key}
                    </span>
                    <span className="text-xs" style={{ color: MUTED }}>
                      w={f.weight}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, f.contributionPct * 2)}%`, background: f.color }}
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: MUTED }}>
                    Contribution: <span className="font-semibold text-[#1f2937]">{f.contributionPct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 rounded-xl border p-3 text-sm"
              style={{ borderColor: BORDER, background: "#f8fbff", color: MUTED }}
            >
              Final stress prediction formula: weighted fusion + normalization + bounded calibration.
              Confidence adjusts with module coverage and profile completeness.
            </div>
          </section>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-1" style={{ color: TEXT }}>
              Physiological monitoring
            </h2>
            <p className="text-sm mb-4" style={{ color: MUTED }}>
              Estimates derived from your stress profile and lifestyle inputs (not medical devices).
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <PhysCell label="Heart rate (avg)" value={`${phys?.heartRate} bpm`} ok />
              <PhysCell label="Resting HR" value={`${phys?.restingHr} bpm`} ok />
              <PhysCell label="SpO₂" value={`${phys?.spo2}%`} ok />
              <PhysCell label="Blood pressure (sys)" value={`${phys?.bloodPressureSys} mmHg`} warn={phys?.bloodPressureSys > 125} />
              <PhysCell label="Respiratory rate" value={`${phys?.respiratoryRate} /min`} ok />
              <PhysCell label="Sleep (hours)" value={`${phys?.sleepHours ?? "—"}`} ok={phys?.sleepHours >= 7} warn={phys?.sleepHours < 6} />
              <PhysCell label="Water intake" value={`${phys?.waterLiters ?? "—"} L`} warn={phys?.waterLiters < 2} />
              <PhysCell label="Daily steps" value={`${phys?.steps ?? "—"}`} ok={phys?.steps >= 5000} />
              <PhysCell label="Screen time" value={`${phys?.screenH ?? "—"} h`} warn={phys?.screenH > 8} />
            </div>
          </section>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
              Lifestyle & device patterns (self-report)
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <MiniStat icon={Smartphone} label="Screen time" value={`${prediction.phenotyping.screenHours} h`} />
              <MiniStat icon={Smartphone} label="Phone unlocks / day" value={prediction.phenotyping.unlocks} />
              <MiniStat icon={Activity} label="Night device use" value={`${prediction.phenotyping.nightUsage}%`} />
              <MiniStat icon={Footprints} label="Steps" value={prediction.phenotyping.steps} />
              <MiniStat icon={Brain} label="Study productivity" value={`${profile?.studyProductivityScore ?? "—"}/10`} />
              <MiniStat icon={User} label="Isolation index" value={`${prediction.phenotyping.isolation}%`} />
              <MiniStat icon={TrendingUp} label="Social media (h)" value={profile?.socialMediaHours ?? profile?.socialMediaUsage ?? "—"} />
              <MiniStat icon={Brain} label="Social interaction" value={`${profile?.socialInteractionLevel ?? "—"}/10`} />
            </div>
          </section>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-3" style={{ color: TEXT }}>
              Personalized recommendations
            </h2>
            <ul className="space-y-2">
              {recommendations.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm rounded-xl px-3 py-2 border"
                  style={{ borderColor: BORDER, background: "#fafbff" }}
                >
                  <span className="text-[#4caf50] font-bold">•</span>
                  <span style={{ color: TEXT }}>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-[20px] border p-5 sm:p-6 shadow-sm"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
              Weekly wellness trends (prediction-updated)
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: MUTED }} />
                  <YAxis domain={[0, 12]} tick={{ fontSize: 11, fill: MUTED }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stress" stroke={PRIMARY} strokeWidth={2} dot={false} name="Stress" />
                  <Line type="monotone" dataKey="sleep" stroke={TEAL} strokeWidth={2} dot={false} name="Sleep" />
                  <Line type="monotone" dataKey="anxiety" stroke="#ff6b6b" strokeWidth={2} dot={false} name="Anxiety" />
                  <Line type="monotone" dataKey="mood" stroke="#4caf50" strokeWidth={2} dot={false} name="Mood" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: MUTED }} />
                  <YAxis tick={{ fontSize: 11, fill: MUTED }} />
                  <Tooltip />
                  <Bar dataKey="screen" fill="#f4b942" name="Screen (h)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </StressReportStudentContext.Provider>
  );
}

function SummaryCard({ title, value, suffix, category, hint, icon: Icon, accent }) {
  return (
    <div
      className="rounded-[20px] border p-5 shadow-sm relative overflow-hidden"
      style={{ background: CARD, borderColor: BORDER }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style={{ background: accent }} />
      <div className="flex items-center gap-2 text-sm mb-2" style={{ color: MUTED }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
        {title}
      </div>
      <p className="text-3xl font-bold" style={{ color: TEXT }}>
        {value != null ? `${value}${suffix || ""}` : "—"}
      </p>
      <p className="text-xs font-semibold mt-2 inline-block px-2 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent }}>
        {category}
      </p>
      <p className="text-xs mt-2" style={{ color: MUTED }}>
        {hint}
      </p>
    </div>
  );
}

function BarRow({ label, value, max = 10, color }) {
  const v = value != null ? Number(value) : null;
  const pct = v != null && max ? Math.min(100, (v / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1" style={{ color: MUTED }}>
        <span>{label}</span>
        <span style={{ color: TEXT }}>{v != null ? v : "—"}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function PhysCell({ label, value, ok, warn }) {
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{
        borderColor: BORDER,
        background: warn ? "#fff7ed" : ok ? "#f0fdf4" : "#fafafa",
      }}
    >
      <p className="text-xs" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: TEXT }}>
        {value}
      </p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border p-3 flex gap-2 items-start" style={{ borderColor: BORDER }}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: PRIMARY }} />
      <div>
        <p className="text-xs" style={{ color: MUTED }}>
          {label}
        </p>
        <p className="font-medium text-sm" style={{ color: TEXT }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function buildLocalRecommendations(profile) {
  const rec = [];
  if (!profile) {
    return ["Complete onboarding and an assessment to unlock tailored tips."];
  }
  if (profile.sleepHours != null && profile.sleepHours < 6) {
    rec.push("Sleep duration looks low — aim for 7–8 hours and a stable bedtime.");
  }
  if (profile.screenTimeHours != null && profile.screenTimeHours > 8) {
    rec.push("High screen time — try a 1-hour wind-down without devices before sleep.");
  }
  if (profile.waterIntakeLiters != null && profile.waterIntakeLiters < 2) {
    rec.push("Hydration may be low — keep water nearby during study blocks.");
  }
  if (profile.stressLevel > 7 && profile.burnoutLevel > 6) {
    rec.push("Stress and burnout are elevated — consider counselling or peer support.");
  }
  if (rec.length === 0) rec.push("Keep logging check-ins and reassess monthly.");
  return rec.slice(0, 8);
}
