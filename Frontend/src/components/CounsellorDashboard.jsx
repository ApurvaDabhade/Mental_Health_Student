import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Star,
  CheckCircle,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Award,
  BookOpen,
  Heart,
  Brain,
  Users,
  Bell,
  Search,
  Plus,
  Trash2,
  MessageSquare,
  LogOut
} from 'lucide-react';

const CounselorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [editingProfile, setEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Counselor profile state
  const [counselorProfile, setCounselorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const loadLocal = () => {
      try {
        const draftRaw = localStorage.getItem('counsellorProfileDraft');
        if (!draftRaw) {
          navigate('/counsellor-onboarding');
          return;
        }

        const draft = JSON.parse(draftRaw);
        const displayName = localStorage.getItem('devDisplayName') || 'Demo Counsellor';
        const email = localStorage.getItem('devEmail') || 'demo@manasveda.local';

        const slotsObj = {};
        const startStr = draft.availability?.slots?.[0]?.startTime || '09:00';
        const endStr = draft.availability?.slots?.[0]?.endTime || '17:00';
        const startHour = parseInt(startStr.split(':')[0]);
        const endHour = parseInt(endStr.split(':')[0]);
        const generatedSlots = [];
        for (let i = startHour; i < endHour; i++) {
          generatedSlots.push(`${i.toString().padStart(2, '0')}:00`);
        }
        (draft.availability?.days || []).forEach((day) => {
          slotsObj[day] = generatedSlots;
        });

        setCounselorProfile({
          id: 'local',
          name: displayName,
          email,
          phone: 'N/A',
          specialization: draft.specializations?.[0] || 'General',
          experience: `${draft.experienceYears || 0} years`,
          bio: draft.bio || '',
          languages: draft.languages || [],
          location: 'Online',
          workingHours: `${startStr} - ${endStr}`,
          rating: 5,
          totalSessions: 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`,
          availableDays: draft.availability?.days || [],
          timeSlots: slotsObj
        });

        const localAptsRaw = localStorage.getItem('sahayAppointments');
        const localApts = localAptsRaw ? JSON.parse(localAptsRaw) : [];
        const mappedAppointments = (Array.isArray(localApts) ? localApts : []).map((apt) => ({
          id: apt.id || `${Date.now()}`,
          studentName: 'Anonymous Student',
          studentId: localStorage.getItem('userId') || 'dev_student',
          date: apt.date,
          time: apt.time,
          status: apt.status === 'cancelled' ? 'cancelled' : 'pending',
          type: apt.type || 'first-time',
          reason: 'Requested via App',
          notes: apt.notes || '',
          bookedAt: apt.bookedAt || new Date().toLocaleDateString()
        }));
        setAppointments(mappedAppointments);
      } catch (error) {
        console.error('Failed to load local dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocal();
  }, []);

  const specializations = [
    'Anxiety & Depression',
    'Academic Stress & Career Counseling',
    'Relationship & Social Issues',
    'Crisis Intervention & Trauma',
    'Substance Abuse',
    'Eating Disorders',
    'ADHD & Learning Disabilities',
    'Grief & Loss Counseling'
  ];

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi',
    'Gujarati', 'Bengali', 'Punjabi', 'Kannada', 'Malayalam'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = selectedDate === 'all' || appointment.date === selectedDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  const handleAppointmentAction = async (appointmentId, action, notes = '') => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: action, notes: notes || apt.notes }
          : apt
      )
    );
    alert(`Appointment ${action} successfully.`);
  };

  const handleProfileUpdate = () => {
    setEditingProfile(false);
    // Here you would typically save to backend
    alert('Profile updated successfully!');
  };

  const toggleDayAvailability = (day) => {
    setCounselorProfile(prev => {
      const newAvailableDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: newAvailableDays };
    });
  };

  const addTimeSlot = (day) => {
    const newTime = prompt('Enter time slot (format: HH:MM):', '09:00');
    if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
      setCounselorProfile(prev => ({
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [day]: [...(prev.timeSlots[day] || []), newTime].sort()
        }
      }));
    }
  };

  const removeTimeSlot = (day, time) => {
    setCounselorProfile(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [day]: prev.timeSlots[day].filter(t => t !== time)
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#f99c5b] text-white';
      case 'accepted': return 'bg-[#889260] text-white';
      case 'completed': return 'bg-[#3d9098] text-white';
      case 'rejected': return 'bg-[#f38788] text-white';
      case 'cancelled': return 'bg-[#7d7074] text-white';
      default: return 'bg-[#c8ced1] text-[#2e2f34]';
    }
  };

  const getSpecializationIcon = (specialization) => {
    if (specialization.includes('Anxiety') || specialization.includes('Depression'))
      return <Brain className="w-4 h-4" />;
    if (specialization.includes('Academic') || specialization.includes('Career'))
      return <BookOpen className="w-4 h-4" />;
    if (specialization.includes('Relationship') || specialization.includes('Social'))
      return <Users className="w-4 h-4" />;
    if (specialization.includes('Crisis') || specialization.includes('Trauma'))
      return <Heart className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  if (loading || !counselorProfile) {
    return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30" style={{ borderColor: '#c8ced1' }}>
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3d9098] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2e2f34]">Counselor Dashboard</h1>
              <p className="text-base text-[#767272]">Welcome back, {counselorProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-[#f38788] hover:opacity-90 transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2dc8ca] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{pendingCount}</span>
                </span>
              )}
            </button>
            <img
              src={counselorProfile.avatar}
              alt={counselorProfile.name}
              className="w-10 h-10 rounded-lg object-cover cursor-pointer"
            />
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg bg-white border border-[#c8ced1] text-[#767272] hover:bg-[#f2f7eb] hover:text-[#f38788] transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#f99c5b] rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2e2f34]">{pendingCount}</p>
                  <p className="text-sm text-[#767272]">Pending Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#3d9098] rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2e2f34]">{appointments.filter(a => a.status === 'accepted').length}</p>
                  <p className="text-sm text-[#767272]">Upcoming Sessions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#889260] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2e2f34]">{appointments.filter(a => a.status === 'completed').length}</p>
                  <p className="text-sm text-[#767272]">Completed This Week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#cdbdd4] rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2e2f34]">{counselorProfile.rating}</p>
                  <p className="text-sm text-[#767272]">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl mb-8 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
            <div className="flex border-b" style={{ borderColor: '#c8ced1' }}>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'appointments'
                  ? 'text-[#3d9098] border-b-2 border-[#3d9098]'
                  : 'text-[#767272] hover:text-[#2e2f34]'
                  }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'profile'
                  ? 'text-[#3d9098] border-b-2 border-[#3d9098]'
                  : 'text-[#767272] hover:text-[#2e2f34]'
                  }`}
              >
                Profile & Availability
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'analytics'
                  ? 'text-[#3d9098] border-b-2 border-[#3d9098]'
                  : 'text-[#767272] hover:text-[#2e2f34]'
                  }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                    >
                      <option value="all">All Days</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointments List */}
              <div className="bg-white rounded-xl shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <div className="p-6 border-b" style={{ borderColor: '#c8ced1' }}>
                  <h3 className="text-lg font-bold text-[#2e2f34]">Appointments ({filteredAppointments.length})</h3>
                </div>
                <div className="divide-y" style={{ borderColor: '#c8ced1' }}>
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6">
                      <div className="flex flex-col md:flex-row items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-[#cdbdd4] rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                              <h4 className="text-lg font-semibold text-[#2e2f34]">{appointment.studentName}</h4>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.type === 'first-time'
                                ? 'bg-[#f2f7eb] text-[#889260]'
                                : 'bg-[#eaf1f5] text-[#3d9098]'
                                }`}>
                                {appointment.type === 'first-time' ? 'First Time' : 'Follow-up'}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-[#767272]">
                                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>{appointment.date} at {appointment.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-[#767272]">
                                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>Booked: {appointment.bookedAt}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm"><span className="font-medium text-[#2e2f34]">Reason:</span> {appointment.reason}</p>
                                {appointment.notes && (
                                  <p className="text-sm"><span className="font-medium text-[#2e2f34]">Notes:</span> {appointment.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full md:w-auto md:ml-4 flex-shrink-0">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                                className="flex-1 md:flex-none px-4 py-2 bg-[#889260] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-semibold"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for rejection (optional):');
                                  handleAppointmentAction(appointment.id, 'rejected', reason || '');
                                }}
                                className="flex-1 md:flex-none px-4 py-2 bg-[#f38788] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-semibold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {appointment.status === 'accepted' && (
                            <button
                              onClick={() => {
                                const notes = prompt('Session notes:');
                                handleAppointmentAction(appointment.id, 'completed', notes || '');
                              }}
                              className="w-full md:w-auto px-4 py-2 bg-[#3d9098] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-semibold"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button className="p-2 text-[#767272] hover:text-[#2e2f34] hover:bg-[#f2f7eb] rounded-lg">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Basic Profile */}
              <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#2e2f34]">Profile Information</h3>
                  <button
                    onClick={() => editingProfile ? handleProfileUpdate() : setEditingProfile(true)}
                    className="px-4 py-2 bg-[#3d9098] text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
                  >
                    {editingProfile ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{editingProfile ? 'Save Changes' : 'Edit Profile'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Full Name</label>
                      {editingProfile ? (
                        <input
                          type="text"
                          value={counselorProfile.name}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, name: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        />
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Email</label>
                      <p className="text-[#767272]">{counselorProfile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Phone</label>
                      {editingProfile ? (
                        <input
                          type="text"
                          value={counselorProfile.phone}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        />
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Specialization</label>
                      {editingProfile ? (
                        <select
                          value={counselorProfile.specialization}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, specialization: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        >
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {getSpecializationIcon(counselorProfile.specialization)}
                          <span className="text-[#767272]">{counselorProfile.specialization}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Experience</label>
                      {editingProfile ? (
                        <input
                          type="text"
                          value={counselorProfile.experience}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, experience: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        />
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.experience}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Location</label>
                      {editingProfile ? (
                        <input
                          type="text"
                          value={counselorProfile.location}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, location: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        />
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Working Hours</label>
                      {editingProfile ? (
                        <input
                          type="text"
                          value={counselorProfile.workingHours}
                          onChange={(e) => setCounselorProfile({ ...counselorProfile, workingHours: e.target.value })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                        />
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.workingHours}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2e2f34] mb-2">Languages</label>
                      {editingProfile ? (
                        <select
                          multiple
                          value={counselorProfile.languages}
                          onChange={(e) => setCounselorProfile({
                            ...counselorProfile,
                            languages: Array.from(e.target.selectedOptions, option => option.value)
                          })}
                          className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098] h-24"
                        >
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-[#767272]">{counselorProfile.languages.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#2e2f34] mb-2">Bio</label>
                  {editingProfile ? (
                    <textarea
                      value={counselorProfile.bio}
                      onChange={(e) => setCounselorProfile({ ...counselorProfile, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098] h-28"
                      rows="4"
                    />
                  ) : (
                    <p className="text-[#767272]">{counselorProfile.bio}</p>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <h3 className="text-lg font-bold text-[#2e2f34] mb-6">Manage Availability</h3>
                <div className="space-y-4">
                  {days.map(day => (
                    <div key={day} className="p-4 border rounded-lg" style={{ borderColor: '#c8ced1' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={counselorProfile.availableDays.includes(day)}
                            onChange={() => toggleDayAvailability(day)}
                            disabled={!editingProfile}
                            className="h-4 w-4 text-[#3d9098] focus:ring-[#3d9098] border-gray-300 rounded"
                          />
                          <label htmlFor={`day-${day}`} className="font-semibold text-[#2e2f34]">{day}</label>
                        </div>
                        {editingProfile && counselorProfile.availableDays.includes(day) && (
                          <button onClick={() => addTimeSlot(day)} className="flex items-center space-x-1 text-sm text-[#3d9098] font-semibold hover:opacity-80">
                            <Plus className="w-4 h-4" />
                            <span>Add Slot</span>
                          </button>
                        )}
                      </div>
                      {counselorProfile.availableDays.includes(day) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(counselorProfile.timeSlots[day] || []).length > 0 ? (
                            counselorProfile.timeSlots[day].map(time => (
                              <div key={time} className="flex items-center space-x-2 bg-[#eaf1f5] px-3 py-1.5 rounded-full">
                                <span className="text-sm font-medium text-[#3d9098]">{time}</span>
                                {editingProfile && (
                                  <button onClick={() => removeTimeSlot(day, time)}>
                                    <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No time slots added for this day.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-12 shadow-sm border flex flex-col items-center justify-center text-center" style={{ borderColor: '#c8ced1' }}>
              <Award className="w-16 h-16 text-[#cdbdd4] mb-4" />
              <h3 className="text-2xl font-bold text-[#2e2f34] mb-2">Analytics Dashboard</h3>
              <p className="text-[#767272] max-w-md">
                This feature is coming soon! You'll be able to see detailed insights into your sessions, student feedback, and performance metrics right here.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;