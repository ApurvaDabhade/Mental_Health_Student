import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveWellnessProfile } from "../api/wellnessApi";
import Sidebar from "./Sidebar";
import { Menu, ArrowRight, CheckCircle } from "lucide-react";

const BG = "#eef5f7";
const CARD = "#ffffff";
const BORDER = "#dbe3ea";
const PRIMARY = "#5b5ce6";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

const inputCls =
  "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#5b5ce6]/30";

export default function OnboardingFlow() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    department: "",
    yearOfStudy: "",
    emergencyContact: "",
    healthConditions: "",
    medications: "",
    sleepHours: "",
    waterIntakeLiters: "",
    screenTimeHours: "",
    studyHours: "",
    exerciseFrequency: "",
    dailySteps: "",
    outdoorActivityMins: "",
    socialMediaHours: "",
    nightDeviceUsage: "",
    moodRating: "5",
    stressLevel: "5",
    anxietyLevel: "5",
    burnoutLevel: "5",
    socialInteractionLevel: "5",
    sleepQuality: "5",
    motivationLevel: "5",
    academicPressureLevel: "5",
    phoneUnlocksPerDay: "",
    nightPhoneUsage: "",
    walkingSteps: "",
    outdoorActivityTime: "",
    timeSpentAloneHours: "",
    socialMediaUsage: "",
    studyProductivityScore: "5",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    try {
      const prev = localStorage.getItem("manasVeda_wellness_full_v1");
      if (prev) {
        const p = JSON.parse(prev);
        setForm((f) => ({ ...f, ...p, age: p.age != null ? String(p.age) : f.age }));
        return;
      }
      const sp = localStorage.getItem("manasVeda_profile_latest_v1");
      if (sp) {
        const j = JSON.parse(sp);
        setForm((f) => ({
          ...f,
          fullName: j.fullName || f.fullName,
          heightCm: j.heightCm != null ? String(j.heightCm) : f.heightCm,
          weightKg: j.weightKg != null ? String(j.weightKg) : f.weightKg,
        }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toNum = (v) => (v === "" || v == null ? undefined : Number(v));

  const handleFinish = async () => {
    setSaving(true);
    const userId = currentUser?.uid || localStorage.getItem("userId") || "guest";
    const payload = {
      userId,
      email: currentUser?.email || form.fullName || undefined,
      fullName: form.fullName,
      age: toNum(form.age),
      gender: form.gender,
      heightCm: toNum(form.heightCm),
      weightKg: toNum(form.weightKg),
      department: form.department,
      yearOfStudy: form.yearOfStudy,
      emergencyContact: form.emergencyContact,
      healthConditions: form.healthConditions,
      medications: form.medications,
      sleepHours: toNum(form.sleepHours),
      waterIntakeLiters: toNum(form.waterIntakeLiters),
      screenTimeHours: toNum(form.screenTimeHours),
      studyHours: toNum(form.studyHours),
      exerciseFrequency: form.exerciseFrequency,
      dailySteps: toNum(form.dailySteps),
      outdoorActivityMins: toNum(form.outdoorActivityMins),
      socialMediaHours: toNum(form.socialMediaHours),
      nightDeviceUsage: form.nightDeviceUsage,
      moodRating: toNum(form.moodRating),
      stressLevel: toNum(form.stressLevel),
      anxietyLevel: toNum(form.anxietyLevel),
      burnoutLevel: toNum(form.burnoutLevel),
      socialInteractionLevel: toNum(form.socialInteractionLevel),
      sleepQuality: toNum(form.sleepQuality),
      motivationLevel: toNum(form.motivationLevel),
      academicPressureLevel: toNum(form.academicPressureLevel),
      phoneUnlocksPerDay: toNum(form.phoneUnlocksPerDay),
      nightPhoneUsage: form.nightPhoneUsage,
      walkingSteps: toNum(form.walkingSteps),
      outdoorActivityTime: toNum(form.outdoorActivityTime),
      timeSpentAloneHours: toNum(form.timeSpentAloneHours),
      socialMediaUsage: toNum(form.socialMediaUsage),
      studyProductivityScore: toNum(form.studyProductivityScore),
      onboardingComplete: true,
    };
    try {
      localStorage.setItem("manasVeda_wellness_full_v1", JSON.stringify(payload));
      localStorage.setItem("manasVeda_onboarding_complete", "true");
      await saveWellnessProfile(payload);
    } catch (e) {
      console.warn("Wellness API save failed (offline OK):", e);
    } finally {
      setSaving(false);
      navigate("/mainpage");
    }
  };

  const field = (label, key, type = "text", ph = "") => (
    <label className="block mb-3">
      <span className="text-xs font-medium" style={{ color: MUTED }}>
        {label}
      </span>
      <input
        type={type}
        className={inputCls}
        style={{ borderColor: BORDER, color: TEXT, background: CARD }}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={ph}
      />
    </label>
  );

  return (
    <div className="min-h-screen lg:pl-72" style={{ background: BG }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b bg-white/90 backdrop-blur" style={{ borderColor: BORDER }}>
        <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg">
          <Menu className="w-6 h-6" style={{ color: TEXT }} />
        </button>
        <span className="font-semibold" style={{ color: TEXT }}>
          Profile setup
        </span>
        <span className="w-8" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold" style={{ color: PRIMARY }}>
            Step {step} of 3
          </p>
          <h1 className="text-2xl font-bold mt-1" style={{ color: TEXT }}>
            Welcome to Manas Veda
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            We use this information to personalize your stress report and dashboard. You can update it later.
          </p>
        </div>

        <div
          className="rounded-[20px] border shadow-sm p-6 sm:p-8"
          style={{ background: CARD, borderColor: BORDER }}
        >
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
                Personal details
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {field("Full name *", "fullName", "text", "Your name")}
                {field("Age *", "age", "number", "Years")}
                {field("Gender", "gender", "text", "e.g. Female")}
                {field("Height (cm) *", "heightCm", "number")}
                {field("Weight (kg) *", "weightKg", "number")}
                {field("College / Department", "department")}
                {field("Year of study", "yearOfStudy")}
                {field("Emergency contact", "emergencyContact", "tel")}
                {field("Existing health conditions", "healthConditions")}
                {field("Medications (if any)", "medications")}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
                Lifestyle
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {field("Average sleep (hours/night)", "sleepHours", "number")}
                {field("Water intake (liters/day)", "waterIntakeLiters", "number")}
                {field("Daily screen time (hours)", "screenTimeHours", "number")}
                {field("Average study hours / day", "studyHours", "number")}
                {field("Exercise frequency", "exerciseFrequency", "text", "e.g. 3x/week")}
                {field("Daily steps (approx.)", "dailySteps", "number")}
                {field("Outdoor activity (mins/week)", "outdoorActivityMins", "number")}
                {field("Social media (hours/day)", "socialMediaHours", "number")}
                {field("Night device usage", "nightDeviceUsage", "text", "e.g. Often before sleep")}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold mb-4" style={{ color: TEXT }}>
                Mental wellness & behavior (1–10 scales)
              </h2>
              <p className="text-xs mb-4" style={{ color: MUTED }}>
                1 = low / very little · 10 = high / very much
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {["moodRating", "stressLevel", "anxietyLevel", "burnoutLevel", "socialInteractionLevel", "sleepQuality", "motivationLevel", "academicPressureLevel"].map((k) => (
                  <label key={k} className="block mb-3">
                    <span className="text-xs font-medium capitalize" style={{ color: MUTED }}>
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      className="w-full accent-[#5b5ce6]"
                      value={form[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                    <div className="text-xs text-right" style={{ color: TEXT }}>
                      {form[k]}
                    </div>
                  </label>
                ))}
              </div>
              <h3 className="text-sm font-semibold mt-6 mb-2" style={{ color: TEXT }}>
                Behavioral (approximate)
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {field("Phone unlocks / day", "phoneUnlocksPerDay", "number")}
                {field("Night phone usage", "nightPhoneUsage")}
                {field("Walking steps", "walkingSteps", "number")}
                {field("Outdoor time (mins/day)", "outdoorActivityTime", "number")}
                {field("Time alone (hours/day)", "timeSpentAloneHours", "number")}
                {field("Social media usage (hrs)", "socialMediaUsage", "number")}
                <label className="block mb-3 sm:col-span-2">
                  <span className="text-xs font-medium" style={{ color: MUTED }}>
                    Study productivity (1–10)
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    className="w-full accent-[#5b5ce6]"
                    value={form.studyProductivityScore}
                    onChange={(e) => set("studyProductivityScore", e.target.value)}
                  />
                </label>
              </div>
            </>
          )}

          <div className="flex justify-between mt-8 gap-3">
            {step > 1 ? (
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
                style={{ borderColor: BORDER, color: TEXT }}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: PRIMARY }}
                onClick={() => setStep((s) => s + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: "#4ca6af" }}
                onClick={handleFinish}
              >
                {saving ? "Saving…" : "Finish"}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
