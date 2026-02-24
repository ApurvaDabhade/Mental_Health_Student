import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun };
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee };
    return { text: 'Good evening', icon: Moon };
  };

  const greeting = getGreeting();


  const quickActions = [
    {
      id: 'checkin',
      title: 'Daily Check-in',
      subtitle: 'How are you feeling today?',
      icon: Smile,
      bgColor: 'bg-[#889260]',
      action: 'Start Check-in',
      time: '2 minutes'
    },
    {
      id: 'chatbot',
      title: 'AI Companion',
      subtitle: 'Chat with your wellness buddy',
      icon: Brain,
      bgColor: 'bg-[#cdbdd4]',
      action: 'Start Chat',
      time: 'Available 24/7'
    },
    {
      id: 'booking',
      title: 'Book Session',
      subtitle: 'Talk to a counselor',
      icon: Calendar,
      bgColor: 'bg-[#6366F1]',
      action: 'Schedule',
      time: 'Next: Tomorrow 2pm'
    },
    {
      id: 'mhfa',
      title: 'MHFA Training Lab',
      subtitle: 'Learn mental health first aid',
      icon: BookOpen,
      bgColor: 'bg-[#f99c5b]',
      action: 'Start Learning',
      time: 'Self-paced',
      onClick: () => navigate('/mhfa-training-lab')
    }
  ];

  const articles = [
    {
      title: 'Managing Exam Stress: A Practical Guide',
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop',
      tag: 'Article',
      readTime: '6 min',
      href: '#'
    },
    {
      title: 'Sleep Hygiene for Better Mental Health',
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=1200&auto=format&fit=crop',
      tag: 'Blog',
      readTime: '4 min',
      href: '#'
    },
    {
      title: 'Mindfulness in 5 Minutes: Daily Routine',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
      tag: 'Article',
      readTime: '5 min',
      href: '#'
    }
  ];

  const hubResources = [
    { title: 'CBT Basics', desc: 'Understand cognitive behavioral techniques', lang: 'English', href: '#' },
    { title: 'Anxiety Toolkit', desc: 'Grounding, journaling, breathing', lang: 'Hindi', href: '#' },
    { title: 'Depression Self-care', desc: 'Small steps that help', lang: 'English', href: '#' },
    { title: 'Study Burnout', desc: 'Recognize and recover', lang: 'English', href: '#' },
  ];

  const featuredResources = [
    {
      title: 'Exam Stress Management',
      description: 'Evidence-based techniques for academic pressure',
      readTime: '5 min read',
      bgColor: 'bg-[#eaf1f5]',
      iconColor: 'text-[#2dc8ca]',
      category: 'Study Skills'
    },
    {
      title: 'Sleep & Mental Health',
      description: 'How quality sleep improves wellbeing',
      readTime: '3 min read',
      bgColor: 'bg-[#f2f7eb]',
      iconColor: 'text-[#889260]',
      category: 'Lifestyle'
    },
    {
      title: 'Building Resilience',
      description: 'Develop skills to bounce back stronger',
      readTime: '7 min read',
      bgColor: 'bg-[#fbecb3]',
      iconColor: 'text-[#f99c5b]',
      category: 'Mental Skills'
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
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
                  <h2 className="text-2xl font-bold text-[#2e2f34]">{greeting.text}, {currentUser?.displayName || 'Student'}!</h2>
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
          {/* Quick Actions - refined styling */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#111827]">Quick Actions</h3>
              <button className="text-[#6366F1] font-semibold text-sm flex items-center">
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
                    <div className="text-right">
                      <div className="text-[#8d949d] text-xs font-medium">{action.time}</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-[#2e2f34] text-base mb-1">{action.title}</h4>
                  <p className="text-[#767272] text-sm mb-3">{action.subtitle}</p>
                  <button 
                    onClick={() => navigate(`/${action.id}`)}
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
                <button className="text-[#6366F1] text-sm font-semibold">Browse all</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.map((a, i) => (
                  <a key={i} href={a.href} className="group block bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow" style={{borderColor:'#c8ced1'}}>
                    <div className="h-40 w-full overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{background:'#EEF2FF', color:'#4F46E5'}}>{a.tag}</span>
                        <span className="text-xs" style={{color:'#8d949d'}}>{a.readTime}</span>
                      </div>
                      <h4 className="font-semibold text-[#2e2f34]">{a.title}</h4>
                    </div>
                  </a>
                ))}
              </div>

              {/* Psychoeducational Hub */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#111827]">Psychoeducational Hub</h3>
                  <button className="text-[#6366F1] text-sm font-semibold">See library</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                  {hubResources.map((r, i) => (
                    <a key={i} href={r.href} className="block bg-white border rounded-xl p-4 hover:shadow-md transition-shadow" style={{borderColor:'#c8ced1'}}>
                      <h4 className="font-semibold text-[#2e2f34] mb-1">{r.title}</h4>
                      <p className="text-sm" style={{color:'#767272'}}>{r.desc}</p>
                      <div className="text-xs mt-2" style={{color:'#8d949d'}}>{r.lang}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#111827]">Upcoming Sessions</h3>
                <button className="text-[#6366F1] text-sm font-semibold">Manage</button>
              </div>
              <div className="bg-white border rounded-xl p-4 space-y-4" style={{borderColor:'#c8ced1'}}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm" style={{color:'#8d949d'}}>Tomorrow • 2:00 PM</p>
                    <p className="font-semibold text-[#2e2f34]">Counseling with Dr. A</p>
                  </div>
                  <button className="text-sm px-3 py-1 rounded border" style={{borderColor:'#c8ced1', color:'#2e2f34'}}>Reschedule</button>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm" style={{color:'#8d949d'}}>Fri • 11:30 AM</p>
                    <p className="font-semibold text-[#2e2f34]">Peer Group: Study Stress</p>
                  </div>
                  <button className="text-sm px-3 py-1 rounded border" style={{borderColor:'#c8ced1', color:'#2e2f34'}}>View</button>
                </div>
                <button 
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
          <div className="bg-[#6366F1] rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">Join Our Peer Support Community</h3>
                <p className="text-[#E5E7EB] text-lg mb-6">Connect with fellow students in a safe, supportive space</p>
                <button className="bg-white text-[#4F46E5] px-8 py-3 rounded-lg font-bold hover:bg-[#EEF2FF] transition-colors flex items-center">
                  Join Community
                  <Users className="w-5 h-5 ml-2" />
                </button>
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