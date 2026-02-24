// src/components/QuestionScreen.jsx
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from 'lucide-react';

export default function QuestionScreen({ question, selected, onSelect, onBack, onSkip, isFirst, isLast, progress, currentIndex, totalQuestions }) {
  const getOptionColor = (idx) => {
    const colors = ['#2dc8ca', '#52c97a', '#eac163', '#f99c5b', '#f38788'];
    return colors[idx] || '#c8ced1';
  };

  const getOptionLabel = (idx) => {
    const labels = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
    return labels[idx] || `Option ${idx + 1}`;
  };

  return (
    <div className="bg-white border rounded-xl p-8 mb-8" style={{borderColor:'#c8ced1'}}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[#767272] mb-3">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-[#f0f0f0] rounded-full h-3">
          <div 
            className="bg-[#3d9098] h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#3d9098] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-[#2e2f34] leading-relaxed">
          {question.text}
        </h2>
        <p className="text-[#767272] mt-2">Please select the option that best describes your experience</p>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full p-4 border rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${
              selected === idx 
                ? 'border-[#3d9098] bg-[#f2f7eb] ring-2 ring-[#3d9098]/20 shadow-sm' 
                : 'border-[#c8ced1] hover:border-[#3d9098]/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {selected === idx ? (
                  <div className="w-6 h-6 bg-[#3d9098] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-[#c8ced1] rounded-full flex items-center justify-center">
                    <Circle className="w-3 h-3 text-transparent" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#2e2f34]">{getOptionLabel(idx)}</div>
                <div className="text-sm text-[#767272] mt-1">{option}</div>
              </div>
              <div 
                className="w-4 h-4 rounded-full"
                style={{backgroundColor: getOptionColor(idx)}}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isFirst}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isFirst 
              ? 'opacity-50 cursor-not-allowed text-[#767272]' 
              : 'text-[#2e2f34] hover:bg-[#f2f7eb] border border-[#c8ced1]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </div>
        </button>

        <div className="text-sm text-[#767272]">
          {isLast ? 'Final question!' : `${totalQuestions - currentIndex - 1} more to go`}
        </div>

        <button
          onClick={onSkip}
          disabled={selected === undefined}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            selected === undefined
              ? 'opacity-50 cursor-not-allowed bg-[#c8ced1] text-white'
              : 'bg-[#3d9098] text-white hover:opacity-90'
          }`}
        >
          <span>{isLast ? 'Submit' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}