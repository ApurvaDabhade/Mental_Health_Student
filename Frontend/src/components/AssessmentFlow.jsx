import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveLatestAssessment } from "../utils/studentStressReportStorage";
import QuestionScreen from "./QuestionScreen";
import ResultScreen from "./ResultScreen";
import Sidebar from "./Sidebar";
import {
  Brain,
  Heart,
  ArrowLeft,
  Menu,
  Loader2,
  MessageCircle,
  TrendingUp,
  ClipboardList,
  Moon,
  Users,
  BookOpen,
  Flame,
  Activity,
} from "lucide-react";
import {
  ASSESSMENT_MODULES,
  ASSESSMENT_MODULE_KEYS,
  computeTotalScore,
} from "../data/assessmentModules";
import { postAssessmentRecord } from "../api/wellnessApi";

const BG = "#eef5f7";
const BORDER = "#dbe3ea";
const PRIMARY = "#5b5ce6";
const TEAL = "#4ca6af";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

const MODULE_ICONS = {
  PHQ9: TrendingUp,
  GAD7: Brain,
  PSS: ClipboardList,
  BURNOUT: Flame,
  SLEEP: Moon,
  SOCIAL: Users,
  ACADEMIC: BookOpen,
  LIFESTYLE: Activity,
};

function severityNeedsFollowUp(severity, moduleKey) {
  const s = String(severity || "").toLowerCase();
  if (["moderate", "moderately_severe", "severe", "high", "poor", "isolated", "elevated"].includes(s))
    return true;
  if (moduleKey === "SLEEP" && s === "fair") return false;
  return false;
}

function messageForResult(moduleKey, severity) {
  const mod = ASSESSMENT_MODULES[moduleKey];
  const s = String(severity || "").toLowerCase();
  const generic = {
    minimal: "Your responses suggest minimal symptoms. Keep routines that support sleep, movement, and connection.",
    mild: "Mild signals — consider small daily habits: sleep schedule, short walks, and reaching out when needed.",
    moderate: "Moderate concerns — peer support or counselling can help; use in-app resources and breathing exercises.",
    moderately_severe: "Strong symptoms — please consider professional mental health support soon.",
    severe: "Severe symptoms — please reach out to a professional or crisis line if you feel unsafe.",
    low: "Scores are in a lower range — keep monitoring and self-care.",
    high: "Scores are elevated — prioritize rest, support, and professional help if distress persists.",
    good: "Positive patterns — maintain consistency.",
    fair: "Mixed signals — small tweaks to sleep and screen time may help.",
    poor: "Sleep quality looks strained — consider sleep hygiene and routine.",
    connected: "Social connection looks reasonable — keep nurturing relationships.",
    mixed: "Mixed social connection — consider one small social step this week.",
    isolated: "Isolation signals — consider reaching out to peers, groups, or support.",
    manageable: "Academic pressure feels manageable.",
    elevated: "Elevated academic pressure — break tasks into smaller steps and ask for help when needed.",
    healthy: "Lifestyle habits look supportive.",
    needs_attention: "Lifestyle areas may need attention — hydration, movement, and screen breaks.",
  };
  if (generic[s]) return generic[s];
  return `Your ${mod?.label || "assessment"} result category: ${severity}. This is a screening tool, not a diagnosis.`;
}

export default function AssessmentFlow() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState("pick");
  const [assessmentType, setAssessmentType] = useState("PHQ9");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStartAssessment = () => {
    try {
      const mod = ASSESSMENT_MODULES[assessmentType];
      if (!mod) throw new Error("Unknown module");
      const qs = mod.questions.map((text, idx) => ({
        q_id: `${assessmentType}_${idx + 1}`,
        text,
        options: mod.options,
      }));
      setQuestions(qs);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setStep("questions");
    } catch (error) {
      console.error(error);
      alert(`Failed to start: ${error.message}`);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMessage("Saving your responses…");
    try {
      const mod = ASSESSMENT_MODULES[assessmentType];
      const answerArr = mod.questions.map((_, idx) => answers[idx] ?? 0);
      const total = computeTotalScore(assessmentType, answerArr);
      const severity = mod.severity(total);
      const message = messageForResult(assessmentType, severity);
      const follow = severityNeedsFollowUp(severity, assessmentType);
      const next_step_url = follow
        ? `/booking?ref=${assessmentType}&score=${total}`
        : null;

      const localResult = {
        total_score: total,
        maxScore: mod.maxScore,
        severity,
        message,
        next_step_url,
        assessmentType,
        module: assessmentType,
        moduleLabel: mod.label,
      };

      const userId = currentUser?.uid;
      if (userId) {
        saveLatestAssessment(userId, localResult);
        try {
          await postAssessmentRecord({
            userId,
            module: assessmentType,
            totalScore: total,
            maxScore: mod.maxScore,
            severity,
            answers: answerArr,
            context: "",
          });
        } catch (e) {
          console.warn("Assessment API save failed:", e);
        }
      }

      setResult(localResult);
      setStep("result");
    } catch (error) {
      console.error(error);
      alert(`Failed to submit: ${error.message}`);
    }
    setLoading(false);
    setLoadingMessage("");
  };

  const handleRestart = () => {
    setStep("pick");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen lg:pl-72" style={{ background: BG }}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-[20px] border p-12 text-center shadow-sm"
              style={{ background: "#fff", borderColor: BORDER }}
            >
              <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin" style={{ color: TEAL }} />
              <p style={{ color: TEXT }} className="font-semibold">
                Processing
              </p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>
                {loadingMessage || "Please wait…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-72" style={{ background: BG }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between border-b" style={{ borderColor: BORDER }}>
        <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg">
          <Menu className="w-6 h-6" style={{ color: TEXT }} />
        </button>
        <h1 className="text-lg font-bold" style={{ color: TEXT }}>
          Assessment
        </h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="hidden lg:flex items-center space-x-3 mb-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="p-2 rounded-xl border"
              style={{ borderColor: BORDER, background: "#fff" }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: TEXT }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
                Mental Health Assessment
              </h1>
              <p className="text-sm" style={{ color: MUTED }}>
                Screening questionnaires — not a substitute for clinical diagnosis
              </p>
            </div>
          </div>

          {step === "pick" && (
            <div
              className="rounded-[20px] border p-6 sm:p-8 mb-8 shadow-sm"
              style={{ background: "#fff", borderColor: BORDER }}
            >
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: TEAL }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>
                  How are you feeling today?
                </h2>
                <p style={{ color: MUTED }}>Choose one module — one question at a time.</p>
              </div>

              <p className="text-sm font-semibold mb-3" style={{ color: TEXT }}>
                Assessment type
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ASSESSMENT_MODULE_KEYS.map((key) => {
                  const mod = ASSESSMENT_MODULES[key];
                  const Icon = MODULE_ICONS[key] || Brain;
                  const active = assessmentType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAssessmentType(key)}
                      className="p-4 border rounded-[16px] text-left transition-all"
                      style={{
                        borderColor: active ? TEAL : BORDER,
                        background: active ? "rgba(76, 166, 175, 0.08)" : "#fff",
                        boxShadow: active ? "0 0 0 2px rgba(76, 166, 175, 0.25)" : undefined,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: active ? TEAL : `${PRIMARY}22` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: active ? "#fff" : PRIMARY }} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: TEXT }}>
                            {mod.label}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                            {mod.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="w-full px-6 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                  style={{ background: TEAL }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Start assessment →
                </button>
              </div>
            </div>
          )}

          {step === "questions" && currentQuestion && (
            <QuestionScreen
              question={currentQuestion}
              selected={answers[currentQuestionIndex]}
              onSelect={handleAnswerSelect}
              onBack={handleBack}
              onSkip={handleNext}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
              progress={progress}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          )}

          {step === "result" && result && <ResultScreen result={result} onRestart={handleRestart} />}
        </div>
      </div>
    </div>
  );
}
