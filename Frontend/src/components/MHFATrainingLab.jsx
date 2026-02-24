import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  Menu,
  ArrowLeft,
  BookOpenCheck,
  MessageCircle,
  AlertTriangle,
  GraduationCap,
  Shield,
  Heart,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Loader2,
  Bot,
  User
} from 'lucide-react';

export default function MHFATrainingLab() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview'); // overview | modules | roleplay | quiz | certificate

  // Dummy local state for quiz + certificate
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [isCertified, setIsCertified] = useState(false);

  const handleQuizChange = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    setQuizSubmitting(true);

    // Simple scoring logic (purely frontend for now)
    const correct = {
      q1: 'b',
      q2: 'c',
      q3: 'a'
    };

    let score = 0;
    Object.keys(correct).forEach(key => {
      if (quizAnswers[key] === correct[key]) score += 1;
    });

    const total = Object.keys(correct).length;
    const pass = score >= 2; // pass if 2 or more correct

    setTimeout(() => {
      setQuizResult({ score, total, pass });
      if (pass) setIsCertified(true);
      setQuizSubmitting(false);
    }, 700);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpenCheck },
    { id: 'modules', label: 'Training Modules', icon: PlayCircle },
    { id: 'roleplay', label: 'Role-Play Simulator', icon: MessageCircle },
    { id: 'quiz', label: 'Red-Flag Quiz', icon: AlertTriangle },
    { id: 'certificate', label: 'Certificate', icon: GraduationCap }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="w-6 h-6 text-[#3d9098]" />
          <h2 className="text-xl font-bold text-[#2e2f34]">What is MHFA Training Lab?</h2>
        </div>
        <p className="text-[#2e2f34] mb-3">
          This integrated <strong>Mental Health First Aid (MHFA) Training Lab</strong> is designed for 
          teachers, ASHA workers, Anganwadi workers, community volunteers and frontline health workers.
          It trains you to be a <span className="font-semibold">stigma breaker, first listener, emotional 
          first-aid responder and referral connector</span> — without turning you into a counsellor.
        </p>
        <p className="text-[#767272]">
          You&apos;ll learn how to listen without judgement, respond calmly, recognise red flags, 
          and connect people to professional help when needed.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: '#c8ced1' }}>
          <Heart className="w-6 h-6 text-[#3d9098] mb-2" />
          <h3 className="font-semibold text-[#2e2f34] mb-1">Stigma Breaker</h3>
          <p className="text-sm text-[#767272]">
            Learn how to talk about mental health in a kind, normal and shame-free way.
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: '#c8ced1' }}>
          <MessageCircle className="w-6 h-6 text-[#3d9098] mb-2" />
          <h3 className="font-semibold text-[#2e2f34] mb-1">First Listener</h3>
          <p className="text-sm text-[#767272]">
            Practice how to listen deeply when someone opens up about their feelings.
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: '#c8ced1' }}>
          <Shield className="w-6 h-6 text-[#3d9098] mb-2" />
          <h3 className="font-semibold text-[#2e2f34] mb-1">Emotional First Aid</h3>
          <p className="text-sm text-[#767272]">
            Learn safe, simple steps to support someone in distress in the moment.
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: '#c8ced1' }}>
          <Sparkles className="w-6 h-6 text-[#3d9098] mb-2" />
          <h3 className="font-semibold text-[#2e2f34] mb-1">Referral Guide</h3>
          <p className="text-sm text-[#767272]">
            Understand when to escalate, whom to call and how to connect to professionals.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <h3 className="text-lg font-semibold text-[#2e2f34] mb-4">Your Training Journey</h3>
        <ol className="space-y-3 text-sm text-[#2e2f34] list-decimal list-inside">
          <li><strong>Watch the short modules</strong> on listening, language and emotional first aid.</li>
          <li><strong>Practice role-play</strong> with Sahaay on real-life community scenarios.</li>
          <li><strong>Take the Red-Flag Quiz</strong> to check your understanding of crisis signals.</li>
          <li><strong>Unlock your certificate</strong> as a <em>Certified Emotional First Responder – MHFA Basic</em>.</li>
        </ol>
        <p className="text-xs text-[#767272] mt-3">
          Note: Your role is to support and refer – not to diagnose or treat.
        </p>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <h2 className="text-xl font-bold text-[#2e2f34] mb-1">Core MHFA Modules</h2>
        <p className="text-sm text-[#767272]">
          Short, practical lessons with simple language and India-focused examples.
        </p>
      </div>

      {[
        {
          id: 1,
          title: 'Understanding Emotional Distress',
          duration: '8 mins video + 2 mins recap',
          level: 'Foundation',
          description:
            'Identify early signs of stress, sadness, anxiety and burnout in students, mothers, workers and community members.'
        },
        {
          id: 2,
          title: 'Listening Without Judgement',
          duration: '10 mins video + practice lines',
          level: 'Core Skill',
          description:
            'Learn how to create safe space, what to say, what not to say, and how to respond when someone shares something heavy.'
        },
        {
          id: 3,
          title: 'Language: What Not to Say',
          duration: '7 mins video + checklist',
          level: 'Core Skill',
          description:
            'Avoid shaming, blaming and dismissive phrases. Use validation and supportive words instead.'
        },
        {
          id: 4,
          title: 'Crisis & Red Flags',
          duration: '9 mins video + examples',
          level: 'Essential',
          description:
            'Spot urgent warning signs like suicidal talk, self-harm, violence, or child safety risks – and know when to escalate.'
        },
        {
          id: 5,
          title: 'Referral Pathways & Boundaries',
          duration: '6 mins video + PDF map',
          level: 'Essential',
          description:
            'Understand your limits, how to refer to counsellors, helplines, or supervisors, and how to document concerns.'
        }
      ].map(module => (
        <div
          key={module.id}
          className="bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderColor: '#c8ced1' }}
        >
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <PlayCircle className="w-5 h-5 text-[#3d9098]" />
              <h3 className="font-semibold text-[#2e2f34]">{module.title}</h3>
            </div>
            <p className="text-sm text-[#767272] mb-2">{module.description}</p>
            <div className="flex items-center gap-3 text-xs text-[#767272]">
              <span className="px-2 py-1 rounded-full bg-[#f2f7eb] text-[#3d9098]">
                {module.level}
              </span>
              <span>{module.duration}</span>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-[#3d9098] text-white rounded-lg text-sm font-semibold hover:opacity-90"
            type="button"
          >
            Start Lesson
          </button>
        </div>
      ))}

      <div className="bg-white border rounded-xl p-4 text-sm text-[#767272]" style={{ borderColor: '#c8ced1' }}>
        📎 <strong>Note: </strong> Video and PDF links can be wired later to your actual content library 
        (e.g., hosted on S3, YouTube unlisted, or internal CMS).
      </div>
    </div>
  );

  const renderRoleplay = () => (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <div className="flex items-center space-x-3 mb-3">
          <MessageCircle className="w-6 h-6 text-[#3d9098]" />
          <h2 className="text-xl font-bold text-[#2e2f34]">Role-Play Simulator with Sahaay</h2>
        </div>
        <p className="text-sm text-[#767272]">
          Practice real-life conversations with the Sahaay chatbot. You&apos;ll act as a teacher / worker, and 
          Sahaay will simulate a student, parent, community member or colleague in distress.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: 'Anxious Student Before Exam',
            description: 'A teenager says: “Agar main fail ho gaya toh sab khatam hai.”',
            tag: 'School / College'
          },
          {
            title: 'Mother Feeling Overwhelmed',
            description: 'Postpartum mother struggling with sleep, crying often, feeling like a bad parent.',
            tag: 'Maternal Health'
          },
          {
            title: 'ASHA Field Burnout',
            description: 'Frontline worker exhausted, saying “Mujhse ab nahi ho raha, sab mere upar hai.”',
            tag: 'Health Worker'
          }
        ].map((scenario, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl p-4 flex flex-col justify-between"
            style={{ borderColor: '#c8ced1' }}
          >
            <div>
              <p className="text-xs text-[#767272] mb-1">{scenario.tag}</p>
              <h3 className="font-semibold text-[#2e2f34] mb-2">{scenario.title}</h3>
              <p className="text-sm text-[#767272] mb-3">{scenario.description}</p>
            </div>
            <button
              type="button"
              className="mt-auto px-3 py-2 bg-[#3d9098] text-white rounded-lg text-xs font-semibold hover:opacity-90"
            >
              Practice this scenario
            </button>
          </div>
        ))}
      </div>

      {/* Mock chat preview */}
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <h3 className="text-sm font-semibold text-[#2e2f34] mb-3">
          Example: How a practice conversation might look
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#3d9098] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#f2f7eb] rounded-xl p-3 max-w-xl">
              <p className="text-xs text-[#767272] mb-1">You (Teacher)</p>
              <p className="text-sm text-[#2e2f34]">
                I&apos;m really glad you told me this. It sounds like you&apos;re under a lot of pressure.
                I&apos;m here to listen. Can you tell me what&apos;s worrying you the most right now?
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#e5f3f4] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#3d9098]" />
            </div>
            <div className="bg-white border rounded-xl p-3 max-w-xl" style={{ borderColor: '#c8ced1' }}>
              <p className="text-xs text-[#767272] mb-1">Sahaay (Student)</p>
              <p className="text-sm text-[#2e2f34]">
                Mujhe lagta hai agar main fail ho gaya toh sab meri wajah se disappointed ho jaayenge.
                Kabhi kabhi lagta hai ki main hi problem hoon...
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#767272] mt-4">
          In the real simulator, Sahaay will rate your responses, highlight safer phrases and suggest alternatives.
        </p>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <div className="flex items-center space-x-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-[#d97706]" />
          <h2 className="text-xl font-bold text-[#2e2f34]">Red-Flag Awareness Quiz</h2>
        </div>
        <p className="text-sm text-[#767272]">
          This short quiz checks if you can identify crisis signals and choose safe first responses. 
          It&apos;s not an exam – just a learning checkpoint.
        </p>
      </div>

      <form onSubmit={handleQuizSubmit} className="space-y-4">
        {/* Q1 */}
        <div className="bg-white border rounded-xl p-5" style={{ borderColor: '#c8ced1' }}>
          <p className="text-sm font-semibold text-[#2e2f34] mb-2">
            1. A student says: “Kabhi kabhi lagta hai sab khatam kar doon.” What should you do first?
          </p>
          <div className="space-y-2 text-sm text-[#2e2f34]">
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q1"
                value="a"
                checked={quizAnswers.q1 === 'a'}
                onChange={() => handleQuizChange('q1', 'a')}
                className="mt-1"
              />
              <span>Tell them to stop overreacting and focus on studies.</span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q1"
                value="b"
                checked={quizAnswers.q1 === 'b'}
                onChange={() => handleQuizChange('q1', 'b')}
                className="mt-1"
              />
              <span>
                Stay calm, ask gentle follow-up questions about safety, and prepare to escalate to a counsellor / helpline.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q1"
                value="c"
                checked={quizAnswers.q1 === 'c'}
                onChange={() => handleQuizChange('q1', 'c')}
                className="mt-1"
              />
              <span>Promise to keep it secret and not tell anyone.</span>
            </label>
          </div>
        </div>

        {/* Q2 */}
        <div className="bg-white border rounded-xl p-5" style={{ borderColor: '#c8ced1' }}>
          <p className="text-sm font-semibold text-[#2e2f34] mb-2">
            2. Which of these is a <strong>red flag</strong> that needs escalation?
          </p>
          <div className="space-y-2 text-sm text-[#2e2f34]">
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q2"
                value="a"
                checked={quizAnswers.q2 === 'a'}
                onChange={() => handleQuizChange('q2', 'a')}
                className="mt-1"
              />
              <span>Someone says, “I had a tough day, I just need rest.”</span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q2"
                value="b"
                checked={quizAnswers.q2 === 'b'}
                onChange={() => handleQuizChange('q2', 'b')}
                className="mt-1"
              />
              <span>Someone feels nervous before an exam.</span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q2"
                value="c"
                checked={quizAnswers.q2 === 'c'}
                onChange={() => handleQuizChange('q2', 'c')}
                className="mt-1"
              />
              <span>
                Someone mentions self-harm, violence at home, or feeling like life is not worth living.
              </span>
            </label>
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-white border rounded-xl p-5" style={{ borderColor: '#c8ced1' }}>
          <p className="text-sm font-semibold text-[#2e2f34] mb-2">
            3. What is your role as a mental health first aider?
          </p>
          <div className="space-y-2 text-sm text-[#2e2f34]">
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q3"
                value="a"
                checked={quizAnswers.q3 === 'a'}
                onChange={() => handleQuizChange('q3', 'a')}
                className="mt-1"
              />
              <span>
                Listen with care, offer emotional first aid, and connect the person to professional help or supervisors.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q3"
                value="b"
                checked={quizAnswers.q3 === 'b'}
                onChange={() => handleQuizChange('q3', 'b')}
                className="mt-1"
              />
              <span>Give medicines and start therapy sessions.</span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="radio"
                name="q3"
                value="c"
                checked={quizAnswers.q3 === 'c'}
                onChange={() => handleQuizChange('q3', 'c')}
                className="mt-1"
              />
              <span>Tell them to be strong and move on quickly.</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#767272]">
            Your answers are only for training purposes and will not be used to judge you.
          </p>
          <button
            type="submit"
            disabled={quizSubmitting}
            className="px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 flex items-center space-x-2 disabled:opacity-60"
          >
            {quizSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>

      {quizResult && (
        <div
          className={`border rounded-xl p-4 flex items-center space-x-3 ${
            quizResult.pass ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <CheckCircle2
            className={`w-6 h-6 ${
              quizResult.pass ? 'text-green-600' : 'text-yellow-600'
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-[#2e2f34]">
              You scored {quizResult.score} / {quizResult.total}
            </p>
            <p className="text-xs text-[#767272]">
              {quizResult.pass
                ? 'Great job! You have a strong basic understanding of red-flag situations. Your certificate tab is now unlocked.'
                : 'This is a learning journey. Revisit the modules and try again – every attempt builds confidence.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderCertificate = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-6" style={{ borderColor: '#c8ced1' }}>
        <div className="flex items-center space-x-3 mb-3">
          <GraduationCap className="w-6 h-6 text-[#3d9098]" />
          <h2 className="text-xl font-bold text-[#2e2f34]">
            MHFA Basic – Emotional First Responder Badge
          </h2>
        </div>
        <p className="text-sm text-[#767272]">
          This badge recognises that you&apos;ve completed the core MHFA Training Lab journey:
          watched the key modules, reflected on scenarios, and passed the red-flag quiz.
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-8 flex flex-col items-center justify-center text-center" style={{ borderColor: '#c8ced1' }}>
        {isCertified ? (
          <>
            <div className="w-20 h-20 rounded-full bg-[#e5f3f4] flex items-center justify-center mb-3">
              <Shield className="w-10 h-10 text-[#3d9098]" />
            </div>
            <h3 className="text-xl font-bold text-[#2e2f34] mb-1">
              Certified Emotional First Responder – MHFA Basic
            </h3>
            <p className="text-sm text-[#767272] mb-3 max-w-lg">
              You have demonstrated awareness of distress signals, safe listening skills, and clear 
              referral pathways. You are now a trusted first listener in your community.
            </p>
            <p className="text-xs text-[#767272]">
              Downloadable certificate & ID card design can be added here in the next phase.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] flex items-center justify-center mb-3">
              <AlertTriangle className="w-10 h-10 text-[#d97706]" />
            </div>
            <h3 className="text-xl font-bold text-[#2e2f34] mb-1">
              Complete your training to unlock this badge
            </h3>
            <p className="text-sm text-[#767272] mb-2 max-w-lg">
              To unlock the MHFA Basic badge, please complete the training modules and pass the 
              Red-Flag Awareness Quiz. The badge shows that you&apos;re ready to support and refer safely.
            </p>
            <button
              type="button"
              onClick={() => setCurrentTab('quiz')}
              className="mt-3 px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90"
            >
              Go to Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'modules':
        return renderModules();
      case 'roleplay':
        return renderRoleplay();
      case 'quiz':
        return renderQuiz();
      case 'certificate':
        return renderCertificate();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf1f5] lg:pl-72">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile Header */}
      <div
        className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between"
        style={{ borderColor: '#c8ced1' }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#2e2f34]" />
        </button>
        <h1 className="text-lg font-bold text-[#2e2f34]">MHFA Training Lab</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/mainpage')}
                className="p-2 rounded-lg hover:bg-white transition-colors"
                style={{ background: '#c8ced1' }}
              >
                <ArrowLeft className="w-5 h-5 text-[#2e2f34]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2e2f34]">
                  MHFA Training Lab
                </h1>
                <p className="text-[#767272]">
                  Train as a safe, stigma-free emotional first responder in your community.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border rounded-xl p-2 mb-6 flex flex-wrap gap-2" style={{ borderColor: '#c8ced1' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCurrentTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === id
                    ? 'bg-[#3d9098] text-white'
                    : 'text-[#2e2f34] hover:bg-[#f2f7eb]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}