import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";

const TEAL = "#4ca6af";
const PRIMARY = "#5b5ce6";
const BORDER = "#dbe3ea";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

export default function QuestionScreen({
  question,
  selected,
  onSelect,
  onBack,
  onSkip,
  isFirst,
  isLast,
  progress,
  currentIndex,
  totalQuestions,
}) {
  const getOptionColor = (idx) => {
    const colors = [TEAL, "#4caf50", "#f4b942", "#ff6b6b", "#5b5ce6"];
    return colors[idx % colors.length];
  };

  return (
    <div
      className="rounded-[20px] border p-6 sm:p-8 mb-8 shadow-sm"
      style={{ background: "#ffffff", borderColor: BORDER }}
    >
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3" style={{ color: MUTED }}>
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full rounded-full h-3" style={{ background: "#e5e7eb" }}>
          <div
            className="h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: PRIMARY }}
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: TEAL }}
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold leading-relaxed" style={{ color: TEXT }}>
          {question.text}
        </h2>
        <p className="mt-2 text-sm" style={{ color: MUTED }}>
          Select the option that best describes your experience
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(idx)}
            className={`w-full p-4 border rounded-[14px] text-left transition-all duration-200 hover:scale-[1.01] ${
              selected === idx ? "ring-2 shadow-sm" : "hover:shadow-sm"
            }`}
            style={{
              borderColor: selected === idx ? TEAL : BORDER,
              background: selected === idx ? "rgba(76, 166, 175, 0.08)" : "#fff",
              boxShadow: selected === idx ? `0 0 0 1px ${TEAL}` : undefined,
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {selected === idx ? (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: TEAL }}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 border-2 rounded-full flex items-center justify-center"
                    style={{ borderColor: BORDER }}
                  >
                    <Circle className="w-3 h-3 text-transparent" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: TEXT }}>
                  {option}
                </div>
              </div>
              <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: getOptionColor(idx) }} />
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isFirst ? "opacity-50 cursor-not-allowed" : "border"
          }`}
          style={
            isFirst
              ? { color: MUTED }
              : { color: TEXT, borderColor: BORDER, background: "#fff" }
          }
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </div>
        </button>

        <div className="text-sm" style={{ color: MUTED }}>
          {isLast ? "Last question" : `${totalQuestions - currentIndex - 1} remaining`}
        </div>

        <button
          type="button"
          onClick={onSkip}
          disabled={selected === undefined}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 text-white ${
            selected === undefined ? "opacity-50 cursor-not-allowed" : "hover:opacity-95"
          }`}
          style={{ background: selected === undefined ? "#9ca3af" : TEAL }}
        >
          <span>{isLast ? "Submit" : "Next"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
