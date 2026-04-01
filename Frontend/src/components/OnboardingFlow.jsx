import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveWellnessProfile } from "../api/wellnessApi";
import Sidebar from "./Sidebar";
import { Menu, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const BG = "#eef5f7";
const CARD = "#ffffff";
const BORDER = "#dbe3ea";
const PRIMARY = "#5b5ce6";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

const inputCls =
  "w-full px-3 py-3 rounded-xl border text-base outline-none focus:ring-2 focus:ring-[#5b5ce6]/30";

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
      <span className="text-sm font-semibold" style={{ color: MUTED }}>
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
          <p className="text-base font-semibold" style={{ color: PRIMARY }}>
            Step {step} of 3
          </p>
          <h1 className="text-3xl font-bold mt-1" style={{ color: TEXT }}>
            Welcome to Manas Veda
          </h1>
          <p className="text-base mt-1" style={{ color: MUTED }}>
            We use this information to personalize your stress report and dashboard. You can update it later.
          </p>
        </div>

        <div
          className="rounded-[20px] border shadow-sm p-6 sm:p-8"
          style={{ background: CARD, borderColor: BORDER }}
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: TEXT }}>
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
              <h2 className="text-2xl font-semibold mb-4" style={{ color: TEXT }}>
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
              <h2 className="text-2xl font-semibold mb-3" style={{ color: TEXT }}>
                Finalize profile
              </h2>
              <p className="text-base mb-5" style={{ color: MUTED }}>
                Great — your basic profile is ready. Mental-health prediction will now be generated from your Self Assessment responses plus behavioral mock signals.
              </p>
              <div className="rounded-xl border p-4 bg-[#f8faff]" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#5b5ce6]" />
                  <p className="text-base font-semibold" style={{ color: TEXT }}>
                    What happens next
                  </p>
                </div>
                <ul className="text-sm space-y-2" style={{ color: MUTED }}>
                  <li>- Complete Self Assessment modules (PHQ-9, GAD-7, PSS, Burnout, Sleep, etc.).</li>
                  <li>- Model combines your scores + lifestyle data to infer risk and trend.</li>
                  <li>- Stress & Wellness Report updates graphs and recommendations dynamically.</li>
                </ul>
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-base font-semibold"
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-base font-semibold disabled:opacity-60"
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
