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

function weeklyDemoData(profile) {
  const stress = profile?.stressLevel ?? 6;
  const sleep = profile?.sleepHours ?? 7;
  const mood = profile?.moodRating ?? 6;
  return Array.from({ length: 7 }, (_, i) => ({
    day: `D${i + 1}`,
    stress: Math.max(1, Math.min(10, stress + (i - 3) * 0.4)),
    sleep: Math.max(4, Math.min(10, sleep + (i % 3) * 0.25)),
    mood: Math.max(1, Math.min(10, mood + (i % 2) * 0.3)),
    screen: Math.max(2, Math.min(12, (profile?.screenTimeHours ?? 6) + (i % 2) * 0.5)),
  }));
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

  const summary = apiReport?.summary || {
    stress: profile?.stressLevel,
    anxiety: profile?.anxietyLevel,
    sleepQuality: profile?.sleepQuality,
    burnout: profile?.burnoutLevel,
    mood: profile?.moodRating,
  };

  const recommendations =
    apiReport?.recommendations?.length > 0
      ? apiReport.recommendations
      : buildLocalRecommendations(profile);

  const phys = derivePhysio(profile);
  const chartData = weeklyDemoData(profile);

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
                Built from your onboarding profile, saved assessments, and your wellness API when
                the backend is running.
                {apiErr ? (
                  <span className="block text-amber-800 mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs">
                    Could not reach the API ({apiErr}). Showing local onboarding data. Start the Node
                    server on port 5000 with MongoDB, or use{" "}
                    <code className="bg-white px-1 rounded">npm run dev</code> with the Vite{" "}
                    <code className="bg-white px-1 rounded">/api</code> proxy.
                  </span>
                ) : apiReport ? (
                  <span className="block text-emerald-800 mt-2 text-xs font-medium">
                    Connected — report data loaded from the server.
                  </span>
                ) : null}
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
              hint="Self-reported (onboarding)"
              icon={TrendingUp}
              accent={PRIMARY}
            />
            <SummaryCard
              title="Anxiety"
              value={summary.anxiety}
              suffix="/10"
              category={categoryFromScore10(summary.anxiety)}
              hint="Self-reported (onboarding)"
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
              <BarRow label="Mood" value={profile?.moodRating} color={TEAL} />
              <BarRow label="Anxiety" value={profile?.anxietyLevel} color={PRIMARY} />
              <BarRow label="Stress" value={profile?.stressLevel} color="#f4b942" />
              <BarRow label="Burnout" value={profile?.burnoutLevel} color="#ff6b6b" />
              <BarRow label="Depression risk (PHQ-9)" value={apiReport?.phq9?.score} max={27} color="#6366f1" />
              <BarRow label="Motivation" value={profile?.motivationLevel} color="#4caf50" />
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
              <MiniStat icon={Smartphone} label="Screen time" value={`${profile?.screenTimeHours ?? "—"} h`} />
              <MiniStat icon={Smartphone} label="Phone unlocks / day" value={profile?.phoneUnlocksPerDay ?? "—"} />
              <MiniStat icon={Activity} label="Night device use" value={profile?.nightDeviceUsage || profile?.nightPhoneUsage || "—"} />
              <MiniStat icon={Footprints} label="Steps" value={profile?.dailySteps ?? profile?.walkingSteps ?? "—"} />
              <MiniStat icon={Brain} label="Study productivity" value={`${profile?.studyProductivityScore ?? "—"}/10`} />
              <MiniStat icon={User} label="Time alone (h)" value={profile?.timeSpentAloneHours ?? "—"} />
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
              Weekly wellness trends (illustrative)
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
