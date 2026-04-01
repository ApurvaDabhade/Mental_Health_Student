// Frontend/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Heart, 
  BookOpen, 
  MessageCircle, 
  Calendar, 
  Users, 
  X, 
  Settings,
  LogOut,
  Shield,
  FileBarChart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const studentMenuItems = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', color: 'bg-[#4F46E5]', path: '/mainpage' },
  { id: 'assessment', icon: Heart, label: 'Self Assessment', color: 'bg-[#EC4899]', path: '/assessment' },
  { id: 'resources', icon: BookOpen, label: 'Resources', color: 'bg-[#22C55E]', path: '/resources' },
  { id: 'mhfa', icon: Shield, label: 'MHFA Training', color: 'bg-[#0EA5E9]', path: '/mhfa-training-lab' },
  { id: 'stress-report', icon: FileBarChart, label: 'Stress report', color: 'bg-[#7C3AED]', path: '/stress-report' },
  { id: 'chatbot', icon: MessageCircle, label: 'AI Support', color: 'bg-[#F97316]', path: '/chatbot' },
  { id: 'booking', icon: Calendar, label: 'Book Counselor', color: 'bg-[#6366F1]', path: '/booking' },
  { id: 'community', icon: Users, label: 'Peer Support', color: 'bg-[#A855F7]', path: '/peer-support' },
];

const instituteMenuItems = [
  { id: 'institute', icon: BarChart3, label: 'Overview', color: 'bg-[#4F46E5]', path: '/institute' },
];

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userType } = useAuth();
  
  const menuItems = userType === 'institute' ? instituteMenuItems : studentMenuItems;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-[#F9FAFB] shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-[#E0E7FF]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Manas Veda</h1>
                <p className="text-sm text-[#6B7280]">Wellbeing</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#EEF2FF] transition-colors"
              aria-label="Close sidebar"
              title="Close menu"
            >
              <X className="w-5 h-5 text-[#111827]" />
            </button>
          </div>
          
          {/* User Info */}
          
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-[#E0E7FF] text-[#111827] shadow-sm' 
                  : 'text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#111827]'
              }`}
            >
              <div className={`w-10 h-10 ${location.pathname === item.path ? 'bg-[#4F46E5]' : item.color} rounded-lg flex items-center justify-center transition-colors`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 pt-0 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-[#6B7280] hover:bg-[#EEF2FF] rounded-xl transition-colors">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-[#B91C1C] hover:bg-[#FEE2E2] rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-[#EF4444] rounded-lg flex items-center justify-center">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;