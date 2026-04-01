import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  MessageCircle, 
  Calendar, 
  BarChart3, 
  Users, 
  Menu, 
  Bell,
  Smile,
  Brain,
  Sun,
  Moon,
  Coffee,
  ArrowRight,
  FileBarChart,
  Footprints,
  Zap,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { getLatestDailyCheckIn, getCheckInConcern } from '../utils/dailyCheckInStorage';

const PAGE_BG = '#eef5f7';

function loadWellnessLocal() {
  try {
    const raw = localStorage.getItem('manasVeda_wellness_full_v1');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

function pct10(v) {
  if (v == null || Number.isNaN(Number(v))) return 0;
  return Math.min(100, Math.max(0, (Number(v) / 10) * 100));
}

function pctSleepHours(h) {
  if (h == null || Number.isNaN(Number(h))) return 0;
  return Math.min(100, Math.max(0, (Number(h) / 8) * 100));
}

function pctSteps(s) {
  if (s == null || Number.isNaN(Number(s))) return 0;
  return Math.min(100, Math.max(0, (Number(s) / 10000) * 100));
}

function metricSparkPoints(raw, maxVal, seed) {
  const base =
    raw != null && maxVal
      ? Math.min(1, Math.max(0, Number(raw) / maxVal))
      : 0.42;
  return Array.from({ length: 8 }, (_, i) => {
    const osc = Math.sin(i * 0.85 + seed * 1.3) * 0.07;
    return Math.max(0.08, Math.min(0.98, base + osc + (i % 2) * 0.03));
  });
}

function MiniSparkline({ color, points }) {
  const w = 128;
  const h = 36;
  const max = Math.max(...points, 0.01);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="block opacity-95" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WellnessMetricCard({ label, value, suffix, color, icon: Icon, pct, sparkPoints, hint }) {
  const offset = RING_C - (pct / 100) * RING_C;
  return (
    <div
      className="bg-white rounded-[20px] border p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ borderColor: "#dbe3ea" }}
    >
      <div className="relative shrink-0">
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
          <circle cx="36" cy="36" r={RING_R} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ color }}
        >
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{label}</p>
        </div>
        <p className="text-2xl font-bold text-[#1f2937] mt-0.5">
          {value != null ? `${value}${suffix}` : "—"}
        </p>
        {hint && <p className="text-[11px] text-[#9ca3af] mt-0.5">{hint}</p>}
        <div className="mt-2 flex items-end justify-between gap-2">
          <MiniSparkline color={color} points={sparkPoints} />
        </div>
      </div>
    </div>
  );
}

function riskAlertsFromProfile(p) {
  if (!p) return [];
  const a = [];
  if (p.sleepHours != null && p.sleepHours < 6) a.push('Try for a bit more sleep tonight.');
  if (p.stressLevel != null && p.stressLevel > 7) a.push('Stress looks high — take a short break.');
  if (p.screenTimeHours != null && p.screenTimeHours > 8) a.push('Consider a screen-free stretch.');
  if (p.waterIntakeLiters != null && p.waterIntakeLiters < 2) a.push('Drink a glass of water when you can.');
  return a.slice(0, 4);
}

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTick, setCheckInTick] = useState(0);
  const wellness = useMemo(() => loadWellnessLocal(), []);

  const latestCheckIn = useMemo(() => getLatestDailyCheckIn(), [checkInTick]);
  const checkInConcern = useMemo(() => getCheckInConcern(latestCheckIn), [latestCheckIn]);

  useEffect(() => {
    if (localStorage.getItem('manasVeda_onboarding_complete') !== 'true') {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bump = () => setCheckInTick((n) => n + 1);
    window.addEventListener('sahayDailyCheckinsUpdated', bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener('sahayDailyCheckinsUpdated', bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun };
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee };
    return { text: 'Good evening', icon: Moon };
  };

  const greeting = getGreeting();

  const displayName =
    wellness?.fullName?.trim() ||
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    'Student';

  const quickActions = [
    {
      id: 'chatbot',
      title: 'AI Companion',
      subtitle: '24/7 chat',
      icon: Brain,
      bgColor: 'bg-[#cdbdd4]',
      action: 'Chat',
      time: 'Now'
    },
    {
      id: 'booking',
      title: 'Book Session',
      subtitle: 'Counsellor',
      icon: Calendar,
      bgColor: 'bg-[#6366F1]',
      action: 'Book',
      time: ''
    },
    {
      id: 'mhfa',
      title: 'MHFA Training Lab',
      subtitle: 'First aid skills',
      icon: BookOpen,
      bgColor: 'bg-[#f99c5b]',
      action: 'Open',
      time: 'Self-paced',
      onClick: () => navigate('/mhfa-training-lab')
    },
    {
      id: 'stress-report',
      title: 'Stress report',
      subtitle: 'Your scores & tips',
      icon: FileBarChart,
      bgColor: 'bg-[#7C3AED]',
      action: 'Open',
      time: '',
    },
  ];

  const articles = [
    {
      title: 'Managing Exam Stress: A Practical Guide',
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop',
      tag: 'Article',
      readTime: '6 min',
      searchQuery: 'exam stress',
    },
    {
      title: 'Sleep Hygiene for Better Mental Health',
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=1200&auto=format&fit=crop',
      tag: 'Blog',
      readTime: '4 min',
      searchQuery: 'sleep',
    },
    {
      title: 'Mindfulness in 5 Minutes: Daily Routine',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
      tag: 'Article',
      readTime: '5 min',
      searchQuery: 'mindfulness',
    },
  ];

  const hubResources = [
    {
      title: 'CBT Basics',
      desc: 'Understand cognitive behavioral techniques',
      lang: 'English',
      searchQuery: 'anxiety',
    },
    {
      title: 'Anxiety Toolkit',
      desc: 'Grounding, journaling, breathing',
      lang: 'Hindi',
      searchQuery: 'anxiety',
      langFilter: 'hindi',
    },
    {
      title: 'Depression Self-care',
      desc: 'Small steps that help',
      lang: 'English',
      searchQuery: 'depression',
    },
    {
      title: 'Study Burnout',
      desc: 'Recognize and recover',
      lang: 'English',
      searchQuery: 'stress',
    },
  ];

  const featuredResources = [
    {
      title: 'Exam Stress Management',
      description: 'Handle academic pressure',
      readTime: '5 min',
      bgColor: 'bg-[#eaf1f5]',
      iconColor: 'text-[#2dc8ca]',
      category: 'Study Skills'
    },
    {
      title: 'Sleep & Mental Health',
      description: 'Sleep and mood',
      readTime: '3 min',
      bgColor: 'bg-[#f2f7eb]',
      iconColor: 'text-[#889260]',
      category: 'Lifestyle'
    },
    {
      title: 'Building Resilience',
      description: 'Bounce back stronger',
      readTime: '7 min',
      bgColor: 'bg-[#fbecb3]',
      iconColor: 'text-[#f99c5b]',
      category: 'Mental Skills'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Header (hidden on booking and checkin pages) */}
        {!['/booking', '/checkin'].includes(location.pathname) && (
        <header className="bg-white border-b sticky top-0 z-30" style={{borderColor:'#c8ced1'}}>
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-lg transition-colors"
                style={{background:'#c8ced1'}}
              >
                <Menu className="w-5 h-5 text-[#2e2f34]" />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-8 h-8 bg-[#fbecb3] rounded-lg flex items-center justify-center">
                    <greeting.icon className="w-5 h-5 text-[#eac163]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2e2f34]">{greeting.text}, {displayName}!</h2>
                </div>
                <p className="text-base text-[#767272]">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              
              <button className="relative p-2.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] transition-colors group">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f38788] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
              </button>
              <div className="w-10 h-10 bg-[#7d7074] rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-colors">
                <span className="text-white font-bold text-sm">
                  {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>
        )}

        {/* Main Content */}
        <main className="p-6 space-y-8">
          <section
            className="rounded-[24px] border bg-gradient-to-br from-white to-[#eef2ff] p-6 shadow-sm"
            style={{ borderColor: '#c8ced1' }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6366F1] flex items-center justify-center shrink-0">
                  <Smile className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Daily check-in</p>
                  <h3 className="text-2xl font-bold text-[#111827] mt-1">How are you feeling today?</h3>
                  <p className="text-[#6b7280] mt-1 max-w-xl">
                    {latestCheckIn
                      ? `Last: ${new Date(latestCheckIn.date).toLocaleDateString()} · ${latestCheckIn.score?.percentage ?? '—'}%`
                      : 'Quick mood and sleep check-in.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/checkin')}
                className="shrink-0 px-8 py-3.5 rounded-xl bg-[#6366F1] text-white font-semibold hover:bg-[#4F46E5] transition-colors shadow-md"
              >
                {latestCheckIn ? 'Check in again' : 'Start daily check-in'}
              </button>
            </div>
          </section>

          {checkInConcern.needsSupport && (
            <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-5 text-rose-950">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex gap-3">
                  <MessageCircle className="w-6 h-6 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg text-rose-900">Need support?</p>
                    <p className="mt-1 text-sm text-rose-900/90">
                      {checkInConcern.summary || 'Things look tough from your last check-in.'} Chat below or open your assessment.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/chatbot?focus=low_mood')}
                    className="px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-900 font-semibold text-sm hover:bg-rose-100"
                  >
                    AI chat
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/assessment')}
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700"
                  >
                    Self assessment
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredResources.map((fr, i) => (
              <Link
                key={i}
                to={`/resources?q=${encodeURIComponent(fr.title)}`}
                className={`block rounded-xl border p-4 ${fr.bgColor} hover:shadow-md transition-shadow`}
                style={{ borderColor: '#c8ced1' }}
              >
                <p className="text-xs font-semibold text-[#6b7280]">{fr.category}</p>
                <h4 className="font-bold text-[#2e2f34] mt-1">{fr.title}</h4>
                <p className="text-sm text-[#6b7280] mt-1">{fr.description}</p>
                <p className="text-xs text-[#6366F1] mt-2 font-medium">{fr.readTime} · Open →</p>
              </Link>
            ))}
          </section>

          {wellness && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <WellnessMetricCard
                label="Stress load"
                value={wellness.stressLevel}
                suffix="/10"
                color="#5b5ce6"
                icon={Zap}
                pct={pct10(wellness.stressLevel)}
                sparkPoints={metricSparkPoints(wellness.stressLevel, 10, 1)}
                hint="1–10"
              />
              <WellnessMetricCard
                label="Mood"
                value={wellness.moodRating}
                suffix="/10"
                color="#4ca6af"
                icon={Smile}
                pct={pct10(wellness.moodRating)}
                sparkPoints={metricSparkPoints(wellness.moodRating, 10, 2)}
                hint="1–10"
              />
              <WellnessMetricCard
                label="Sleep"
                value={wellness.sleepHours}
                suffix=" h"
                color="#4caf50"
                icon={Moon}
                pct={pctSleepHours(wellness.sleepHours)}
                sparkPoints={metricSparkPoints(wellness.sleepHours, 8, 3)}
                hint="hours"
              />
              <WellnessMetricCard
                label="Activity"
                value={wellness.dailySteps ?? wellness.walkingSteps}
                suffix=" steps"
                color="#f4b942"
                icon={Footprints}
                pct={pctSteps(wellness.dailySteps ?? wellness.walkingSteps)}
                sparkPoints={metricSparkPoints(wellness.dailySteps ?? wellness.walkingSteps, 10000, 4)}
                hint="steps"
              />
            </section>
          )}

          {riskAlertsFromProfile(wellness).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-4 text-sm text-amber-950">
              <p className="font-semibold mb-2">Tips</p>
              <ul className="list-disc pl-5 space-y-1">
                {riskAlertsFromProfile(wellness).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions - refined styling */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#111827]">Quick Actions</h3>
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="text-[#6366F1] font-semibold text-sm flex items-center hover:underline"
              >
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group cursor-pointer" style={{borderColor:'#c8ced1'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    {action.time ? (
                      <div className="text-right">
                        <div className="text-[#8d949d] text-xs font-medium">{action.time}</div>
                      </div>
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                  <h4 className="font-bold text-[#2e2f34] text-base mb-1">{action.title}</h4>
                  <p className="text-[#767272] text-sm mb-3">{action.subtitle}</p>
                  <button 
                    onClick={() => (action.onClick ? action.onClick() : navigate(`/${action.id}`))}
                    className="w-full bg-[#f2f7eb] hover:bg-[#eaf1f5] text-[#2e2f34] font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center group-hover:bg-[#e1d1c9] group-hover:text-[#3d9098]"
                  >
                    {action.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Articles & Blogs with images + Psychoeducational Hub + Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles & Blogs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#2e2f34]">Articles & Blogs</h3>
                <Link
                  to="/resources"
                  className="text-[#6366F1] text-sm font-semibold hover:underline"
                >
                  Browse all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.map((a, i) => (
                  <Link
                    key={i}
                    to={`/resources?q=${encodeURIComponent(a.searchQuery)}`}
                    className="group block bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    style={{ borderColor: '#c8ced1' }}
                  >
                    <div className="h-40 w-full overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{background:'#EEF2FF', color:'#4F46E5'}}>{a.tag}</span>
                        <span className="text-xs" style={{color:'#8d949d'}}>{a.readTime}</span>
                      </div>
                      <h4 className="font-semibold text-[#2e2f34]">{a.title}</h4>
                      <p className="text-xs text-[#6366F1] mt-2 font-medium">Open →</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Psychoeducational Hub */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#111827]">Psychoeducational Hub</h3>
                  <Link
                    to="/resources"
                    className="text-[#6366F1] text-sm font-semibold hover:underline"
                  >
                    See library
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                  {hubResources.map((r, i) => {
                    const hubParams = new URLSearchParams();
                    hubParams.set('q', r.searchQuery);
                    if (r.langFilter) hubParams.set('lang', r.langFilter);
                    return (
                      <Link
                        key={i}
                        to={`/resources?${hubParams.toString()}`}
                        className="block bg-white border rounded-xl p-4 hover:shadow-md transition-shadow hover:border-[#6366F1]/40"
                        style={{ borderColor: '#c8ced1' }}
                      >
                        <h4 className="font-semibold text-[#2e2f34] mb-1">{r.title}</h4>
                        <p className="text-sm" style={{ color: '#767272' }}>{r.desc}</p>
                        <div className="text-xs mt-2 flex justify-between items-center" style={{ color: '#8d949d' }}>
                          <span>{r.lang}</span>
                          <span className="text-[#6366F1] font-medium">View resources →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#111827]">Upcoming Sessions</h3>
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="text-[#6366F1] text-sm font-semibold hover:underline"
                >
                  Manage
                </button>
              </div>
              <div className="bg-white border rounded-xl p-4 space-y-4" style={{borderColor:'#c8ced1'}}>
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="w-full text-left flex items-start justify-between gap-2 rounded-lg p-2 -m-2 hover:bg-[#f9fafb] transition-colors"
                >
                  <div>
                    <p className="text-sm" style={{color:'#8d949d'}}>Tomorrow • 2:00 PM</p>
                    <p className="font-semibold text-[#2e2f34]">Counseling with Dr. A</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded border shrink-0" style={{borderColor:'#c8ced1', color:'#2e2f34'}}>Reschedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="w-full text-left flex items-start justify-between gap-2 rounded-lg p-2 -m-2 hover:bg-[#f9fafb] transition-colors"
                >
                  <div>
                    <p className="text-sm" style={{color:'#8d949d'}}>Fri • 11:30 AM</p>
                    <p className="font-semibold text-[#2e2f34]">Peer Group: Study Stress</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded border shrink-0" style={{borderColor:'#c8ced1', color:'#2e2f34'}}>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="w-full bg-[#6366F1] text-white py-2.5 rounded-lg font-semibold hover:bg-[#4F46E5]"
                >
                  Book New Session
                </button>
              </div>
            </div>
          </div>
          
          {/* Meditation & Exercise shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border" style={{borderColor:'#c8ced1'}}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-[#111827]">Meditation</h4>
                <span className="text-xs px-2 py-1 rounded bg-[#EEF2FF] text-[#4F46E5]">Relax</span>
              </div>
              <p className="text-[#6B7280] mb-4">Play soothing ambient sounds for focus and calm.</p>
              <button onClick={()=>navigate('/meditation')} className="w-full bg-[#6366F1] text-white py-2.5 rounded-lg font-semibold hover:bg-[#4F46E5]">Open Meditation</button>
            </div>
            <div className="bg-white rounded-xl p-6 border" style={{borderColor:'#c8ced1'}}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-[#2e2f34]">Exercise</h4>
                <span className="text-xs px-2 py-1 rounded bg-[#fbecb3] text-[#7d7074]">Refresh</span>
              </div>
              <p className="text-[#767272] mb-4">Quick routines to energize body and reduce stress.</p>
              <button onClick={()=>navigate('/exercise')} className="w-full bg-[#889260] text-white py-2.5 rounded-lg font-semibold hover:opacity-90">Open Exercise</button>
            </div>
          </div>          
          
          {/* Community Highlight */}
          <div
            className="bg-[#6366F1] rounded-xl p-8 text-white cursor-pointer hover:opacity-[0.98] transition-opacity"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/peer-support')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/peer-support');
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">Join Our Peer Support Community</h3>
                <p className="text-[#E5E7EB] text-lg mb-6">Connect with fellow students in a safe, supportive space</p>
                <span className="inline-flex bg-white text-[#4F46E5] px-8 py-3 rounded-lg font-bold hover:bg-[#EEF2FF] transition-colors items-center">
                  Join Community
                  <Users className="w-5 h-5 ml-2" />
                </span>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-[#a0b4bb] rounded-xl flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;