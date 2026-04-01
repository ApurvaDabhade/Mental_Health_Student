/** Manas Veda — extended screening modules (not a substitute for clinical diagnosis). */

export const OPTION_LIKERT_4 = [
  "Never",
  "Sometimes",
  "Often",
  "Very often",
];

export const OPTION_LIKERT_5 = [
  "Not at all",
  "A little",
  "Moderately",
  "Quite a bit",
  "Extremely",
];

export const ASSESSMENT_MODULES = {
  PHQ9: {
    label: "Depression (PHQ-9)",
    description: "9 questions about mood and energy.",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking slowly, or being fidgety/restless",
      "Thoughts that you would be better off dead or of hurting yourself",
    ],
    maxScore: 27,
    severity(total) {
      if (total <= 4) return "minimal";
      if (total <= 9) return "mild";
      if (total <= 14) return "moderate";
      if (total <= 19) return "moderately_severe";
      return "severe";
    },
  },
  GAD7: {
    label: "Anxiety (GAD-7)",
    description: "7 questions about anxiety and worry.",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
    maxScore: 21,
    severity(total) {
      if (total <= 4) return "minimal";
      if (total <= 9) return "mild";
      if (total <= 14) return "moderate";
      return "severe";
    },
  },
  PSS: {
    label: "Perceived Stress (PSS-style)",
    description: "How often you felt stressed in the last month.",
    options: OPTION_LIKERT_4,
    questions: [
      "How often have you been upset because of something that happened unexpectedly?",
      "How often have you felt that you were unable to control the important things in your life?",
      "How often have you felt nervous and stressed?",
      "How often have you felt confident about handling personal problems?",
      "How often have you felt that things were going your way?",
      "How often have you found that you could not cope with all the things you had to do?",
    ],
    maxScore: 24,
    severity(total) {
      if (total <= 8) return "low";
      if (total <= 16) return "moderate";
      return "high";
    },
  },
  BURNOUT: {
    label: "Study burnout",
    description: "Quick check-in on exhaustion and motivation.",
    options: OPTION_LIKERT_5,
    questions: [
      "I feel mentally exhausted from my studies.",
      "I feel disconnected or cynical about coursework.",
      "I feel my motivation dropping week by week.",
      "I feel emotionally drained after study sessions.",
      "I doubt whether my efforts are worthwhile.",
    ],
    maxScore: 20,
    severity(total) {
      if (total <= 8) return "low";
      if (total <= 14) return "moderate";
      return "high";
    },
  },
  SLEEP: {
    label: "Sleep quality",
    description: "Sleep habits and restfulness.",
    options: OPTION_LIKERT_5,
    questions: [
      "How many hours do you usually sleep? (score higher = more hours feels restful)",
      "How often do you wake up during the night?",
      "How rested do you feel in the morning?",
      "How often do you use screens right before sleep?",
      "How consistent is your sleep schedule?",
    ],
    maxScore: 20,
    severity(total) {
      if (total >= 15) return "good";
      if (total >= 10) return "fair";
      return "poor";
    },
  },
  SOCIAL: {
    label: "Social connection",
    description: "Loneliness and social interaction.",
    options: OPTION_LIKERT_5,
    questions: [
      "How often do you meet friends or classmates in person?",
      "How lonely do you feel lately?",
      "How often do you join group activities (clubs, sports, study groups)?",
      "How supported do you feel by people around you?",
    ],
    maxScore: 16,
    severity(total) {
      if (total >= 12) return "connected";
      if (total >= 8) return "mixed";
      return "isolated";
    },
  },
  ACADEMIC: {
    label: "Academic pressure",
    description: "Deadlines, exams, and performance stress.",
    options: OPTION_LIKERT_5,
    questions: [
      "Deadlines feel overwhelming.",
      "Exams increase my stress a lot.",
      "I feel pressure to perform better than I think I can sustain.",
      "I worry about disappointing others academically.",
    ],
    maxScore: 16,
    severity(total) {
      if (total <= 6) return "manageable";
      if (total <= 11) return "elevated";
      return "high";
    },
  },
  LIFESTYLE: {
    label: "Lifestyle habits",
    description: "Movement, hydration, and screen balance.",
    options: OPTION_LIKERT_5,
    questions: [
      "I get physical activity most days.",
      "I drink enough water during the day.",
      "I take breaks from screens during study blocks.",
      "I spend some time outdoors weekly.",
      "I eat regular meals on most days.",
    ],
    maxScore: 20,
    severity(total) {
      if (total >= 15) return "healthy";
      if (total >= 10) return "mixed";
      return "needs_attention";
    },
  },
};

/** PSS items 4 & 5 (0-based indices 3 & 4) are reverse-scored on a 0–3 scale. */
export function pssItemScore(questionIndex, optionIndex) {
  const reverse = questionIndex === 3 || questionIndex === 4;
  const o = Number(optionIndex);
  if (!Number.isFinite(o)) return 0;
  return reverse ? 3 - o : o;
}

/** Sum of per-item scores (handles PSS reverse items). */
export function computeTotalScore(moduleKey, answers) {
  const mod = ASSESSMENT_MODULES[moduleKey];
  if (!mod) return 0;
  const arr = Array.isArray(answers) ? answers : [];
  if (moduleKey === "PSS") {
    return mod.questions.reduce((sum, _q, qIdx) => {
      const idx = arr[qIdx];
      return sum + pssItemScore(qIdx, typeof idx === "number" ? idx : 0);
    }, 0);
  }
  return arr.reduce((sum, idx) => sum + (typeof idx === "number" ? idx : 0), 0);
}

export const ASSESSMENT_MODULE_KEYS = Object.keys(ASSESSMENT_MODULES);
