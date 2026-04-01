const PROFILE_KEY = "manasVeda_profile_latest_v1";

function computeBmi(heightCm, weightKg) {
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!h || !w) return null;
  const bmi = w / (h * h);
  if (!Number.isFinite(bmi)) return null;
  return Math.round(bmi * 10) / 10;
}

function bmiCategory(bmi) {
  if (bmi == null) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function saveProfileFromSignup({ fullName, email, heightCm, weightKg }) {
  const bmi = computeBmi(heightCm, weightKg);
  const profile = {
    fullName: fullName?.trim() || null,
    email: email?.trim() || null,
    heightCm: heightCm ? Number(heightCm) : null,
    weightKg: weightKg ? Number(weightKg) : null,
    bmi,
    bmiCategory: bmiCategory(bmi),
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
}

export function loadProfileForEmail(email) {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.email || !email || parsed.email !== email) return parsed;
    return parsed;
  } catch {
    return null;
  }
}

