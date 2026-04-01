/**
 * Reads latest daily check-in from localStorage (same shape as DailyCheckIn.jsx).
 */

export function getLatestDailyCheckIn() {
  try {
    const raw = window.localStorage.getItem('sahayDailyCheckins');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[0];
  } catch {
    return null;
  }
}

/**
 * Mood scale: 1 = very low … 5 = great. Anxiety: 5 = calm, 1 = very anxious.
 */
export function getCheckInConcern(entry) {
  if (!entry?.responses) {
    return { needsSupport: false, summary: null, moodId: null };
  }
  const { mood, sleep, hunger, anxiety, workMood } = entry.responses;
  const moodId = mood?.id ?? null;
  const sleepId = sleep?.id ?? null;
  const hungerId = hunger?.id ?? null;
  const anxietyId = anxiety?.id ?? null;
  const workId = workMood?.id ?? null;

  const pct = entry.score?.percentage;
  const level = entry.score?.level;

  const flags = [];
  if (moodId != null && moodId <= 2) flags.push('mood');
  if (sleepId != null && sleepId <= 2) flags.push('sleep');
  if (hungerId != null && hungerId <= 2) flags.push('eating');
  if (anxietyId != null && anxietyId <= 2) flags.push('stress');
  if (workId != null && workId <= 2) flags.push('studies');

  const scorePoor =
    level === 'Needs Attention' || (pct != null && pct < 40);

  const needsSupport = flags.length > 0 || scorePoor;

  let summary = null;
  if (moodId != null && moodId <= 2) {
    summary = 'Your last check-in looked low.';
  } else if (scorePoor) {
    summary = 'Your last score was on the low side.';
  } else if (flags.includes('stress')) {
    summary = 'Stress showed up in your last check-in.';
  } else if (flags.length) {
    summary = 'A few areas need a bit of care.';
  }

  return { needsSupport, summary, moodId, flags };
}
