import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Star,
  CheckCircle,
  ArrowLeft,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Heart,
  Brain,
  Users,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const BookCounselor = () => {
  const navigate = useNavigate();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [existingAppointments, setExistingAppointments] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahayAppointments');
      if (saved) {
        setExistingAppointments(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Save to localStorage whenever appointments change
  useEffect(() => {
    try {
      localStorage.setItem('sahayAppointments', JSON.stringify(existingAppointments));
    } catch (e) {
      // ignore
    }
  }, [existingAppointments]);

  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real counsellors from backend
  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/counsellors');
        const data = await response.json();

        // Transform backend data to match UI structure
        const transformed = data.map(c => {
          // Generate hourly slots from the single start/end range
          const slotsObj = {};
          const startStr = c.availability?.slots?.[0]?.startTime || "09:00";
          const endStr = c.availability?.slots?.[0]?.endTime || "17:00";

          const startHour = parseInt(startStr.split(':')[0]);
          const endHour = parseInt(endStr.split(':')[0]);

          const generatedSlots = [];
          for (let i = startHour; i < endHour; i++) {
            generatedSlots.push(`${i.toString().padStart(2, '0')}:00`);
          }

          (c.availability?.days || []).forEach(day => {
            slotsObj[day] = generatedSlots;
          });

          return {
            id: c._id, // This is Counsellor Profile ID
            userId: c.user?._id, // This is the User ID (needed for appointment)
            name: c.user?.fullName || 'Unknown Counselor',
            specialization: c.specializations?.join(', ') || 'General',
            experience: `${c.experienceYears || 0}+ years`,
            rating: c.rating?.average || 5.0,
            reviews: c.rating?.count || 0,
            avatar: c.user?.profileImage || 'https://ui-avatars.com/api/?name=' + (c.user?.fullName || 'C'),
            bio: c.bio || 'Experienced counsellor ready to help.',
            languages: c.languages || ['English'],
            location: 'Online / Campus',
            phone: 'Contact via App',
            email: c.user?.email,
            availableDays: c.availability?.days || [],
            timeSlots: slotsObj,
            nextAvailable: 'Check Availability',
            isAvailable: true
          };
        });

        setCounselors(transformed);
      } catch (error) {
        console.error('Failed to fetch counsellors:', error);
        // Fallback: local mock counsellors (auth/api disabled mode)
        setCounselors([
          {
            id: 'local_1',
            userId: 'local_user_1',
            name: 'Dr. Asha Patel',
            specialization: 'Anxiety & Depression',
            experience: '6+ years',
            rating: 4.8,
            reviews: 42,
            avatar: 'https://ui-avatars.com/api/?name=Dr+Asha+Patel',
            bio: 'Supportive, student-friendly counselling with practical coping tools.',
            languages: ['English', 'Hindi'],
            location: 'Online / Campus',
            phone: 'Contact via App',
            email: 'asha@example.com',
            availableDays: ['Monday', 'Wednesday', 'Friday'],
            timeSlots: {
              Monday: ['10:00', '11:00', '12:00', '15:00'],
              Wednesday: ['10:00', '11:00', '12:00', '15:00'],
              Friday: ['10:00', '11:00', '12:00', '15:00'],
            },
            nextAvailable: 'Today 3pm',
            isAvailable: true
          },
          {
            id: 'local_2',
            userId: 'local_user_2',
            name: 'Dr. Rahul Mehta',
            specialization: 'Academic Stress & Career Counseling',
            experience: '10+ years',
            rating: 4.6,
            reviews: 58,
            avatar: 'https://ui-avatars.com/api/?name=Dr+Rahul+Mehta',
            bio: 'Helps with burnout, exam stress, and career clarity.',
            languages: ['English', 'Marathi'],
            location: 'Online',
            phone: 'Contact via App',
            email: 'rahul@example.com',
            availableDays: ['Tuesday', 'Thursday'],
            timeSlots: {
              Tuesday: ['09:00', '10:00', '11:00', '16:00'],
              Thursday: ['09:00', '10:00', '11:00', '16:00'],
            },
            nextAvailable: 'Thu 10am',
            isAvailable: true
          },
          {
            id: 'local_3',
            userId: 'local_user_3',
            name: 'Dr. Nisha Iyer',
            specialization: 'Relationship & Social Issues',
            experience: '5+ years',
            rating: 4.7,
            reviews: 31,
            avatar: 'https://ui-avatars.com/api/?name=Dr+Nisha+Iyer',
            bio: 'A safe space to talk through relationships, loneliness, and confidence.',
            languages: ['English', 'Tamil'],
            location: 'Online / Campus',
            phone: 'Contact via App',
            email: 'nisha@example.com',
            availableDays: ['Monday', 'Saturday'],
            timeSlots: {
              Monday: ['13:00', '14:00', '15:00'],
              Saturday: ['10:00', '11:00', '12:00'],
            },
            nextAvailable: 'Sat 11am',
            isAvailable: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  const specializations = [
    'all',
    'Anxiety & Depression',
    'Academic Stress & Career Counseling',
    'Relationship & Social Issues',
    'Crisis Intervention & Trauma'
  ];

  const filteredCounselors = counselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counselor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' ||
      counselor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const getSpecializationIcon = (specialization) => {
    switch (specialization) {
      case 'Anxiety & Depression': return <Brain className="w-4 h-4" />;
      case 'Academic Stress & Career Counseling': return <BookOpen className="w-4 h-4" />;
      case 'Relationship & Social Issues': return <Users className="w-4 h-4" />;
      case 'Crisis Intervention & Trauma': return <Heart className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const handleBookAppointment = async (counselorId) => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    // Find selected counsellor object to extract IDs
    const currentCounselor = counselors.find(c => c.id === counselorId);
    if (!currentCounselor) return;

    // Get current student ID (dev mode ensures this exists)
    const studentId = localStorage.getItem('userId') || 'dev_student';

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          counsellorId: currentCounselor.userId, // Send the User ID of the counsellor
          date: selectedDate,
          time: selectedTimeSlot,
          reason: 'Requested via App',
          type: 'first-time'
        })
      });

      if (response.ok) {
        const savedAppointment = await response.json();
        const newAppointment = {
          id: savedAppointment._id,
          counselorId: currentCounselor.id,
          counselorName: currentCounselor.name,
          date: selectedDate,
          time: selectedTimeSlot,
          status: 'pending',
          type: 'new',
          bookedAt: new Date().toLocaleDateString()
        };
        setExistingAppointments(prev => [...prev, newAppointment]);
        alert('Appointment request sent successfully!');
        setSelectedCounselor(null);
        setSelectedDate('');
        setSelectedTimeSlot('');
        return;
      }

      // If backend responds but not ok, fall back to local booking
      const newAppointment = {
        id: `${Date.now()}`,
        counselorId: currentCounselor.id,
        counselorName: currentCounselor.name,
        date: selectedDate,
        time: selectedTimeSlot,
        status: 'upcoming',
        type: 'new',
        bookedAt: new Date().toLocaleDateString()
      };
      setExistingAppointments(prev => [...prev, newAppointment]);
      alert('Booked locally (backend unavailable).');
      setSelectedCounselor(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
    } catch (error) {
      console.error('Booking error:', error);
      // Offline fallback
      const newAppointment = {
        id: `${Date.now()}`,
        counselorId: currentCounselor.id,
        counselorName: currentCounselor.name,
        date: selectedDate,
        time: selectedTimeSlot,
        status: 'upcoming',
        type: 'new',
        bookedAt: new Date().toLocaleDateString()
      };
      setExistingAppointments(prev => [...prev, newAppointment]);
      alert('Booked locally (backend unavailable).');
      setSelectedCounselor(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
    }
  };

  const handleRebookAppointment = (appointmentId) => {
    const appointment = existingAppointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const counselor = counselors.find(c => c.id === appointment.counselorId);
    if (!counselor) return;

    setSelectedCounselor(counselor);
    setSelectedDate(appointment.date);
    setSelectedTimeSlot(appointment.time);
  };

  const handleCancelAppointment = (appointmentId) => {
    setExistingAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'cancelled' };
      }
      return apt;
    }));
  };

  return (
    <div className="min-h-screen bg-[#eaf1f5] p-6">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/mainpage')}
              className="p-2 rounded-lg hover:bg-white transition-colors"
              style={{ background: '#c8ced1' }}
            >
              <ArrowLeft className="w-5 h-5 text-[#2e2f34]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#2e2f34]">Book Counselor</h1>
              <p className="text-[#767272]">Schedule anonymous appointments with verified campus counselors</p>
            </div>
          </div>
        </div>

        {/* Existing Appointments */}
        {existingAppointments.length > 0 && (
          <>
            {/* Upcoming */}
            {existingAppointments.filter(a => a.status === 'upcoming').length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <h2 className="text-xl font-bold text-[#2e2f34] mb-4">Upcoming Appointments</h2>
                <div className="space-y-3">
                  {existingAppointments.filter(a => a.status === 'upcoming').map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#c8ced1' }}>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#3d9098] rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2e2f34]">{appointment.counselorName}</p>
                          <p className="text-sm text-[#767272]">{appointment.date} at {appointment.time}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#f2f7eb] text-[#889260]">{appointment.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="px-4 py-2 border border-[#c8ced1] rounded-lg hover:bg-[#f2f7eb] transition-colors text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {existingAppointments.filter(a => a.status !== 'upcoming').length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
                <h2 className="text-xl font-bold text-[#2e2f34] mb-4">Previous Appointments</h2>
                <div className="space-y-3">
                  {existingAppointments.filter(a => a.status !== 'upcoming').map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#c8ced1' }}>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#7d7074] rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2e2f34]">{appointment.counselorName}</p>
                          <p className="text-sm text-[#767272]">{appointment.date} at {appointment.time}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'cancelled' ? 'bg-[#cdbdd4] text-[#4e4f65]' : 'bg-[#eaf1f5] text-[#3d9098]'}`}>{appointment.status}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRebookAppointment(appointment.id)}
                        className="px-4 py-2 bg-[#2dc8ca] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-semibold"
                      >
                        Rebook
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border" style={{ borderColor: '#c8ced1' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
              <input
                type="text"
                placeholder="Search counselors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="px-4 py-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-[#c8ced1] rounded-lg hover:bg-[#f2f7eb] transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCounselors.map((counselor) => (
            <div key={counselor.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow" style={{ borderColor: '#c8ced1' }}>
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={counselor.avatar}
                  alt={counselor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2e2f34] mb-1">{counselor.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {getSpecializationIcon(counselor.specialization)}
                      <span className="text-sm text-[#3d9098] font-medium">{counselor.specialization}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[#767272]">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-[#eac163]" />
                      <span>{counselor.rating}</span>
                      <span>({counselor.reviews} reviews)</span>
                    </div>
                    <span>{counselor.experience}</span>
                  </div>
                </div>
              </div>

              <p className="text-[#767272] text-sm mb-4">{counselor.bio}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#8d949d]" />
                  <span className="text-[#767272]">{counselor.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-[#8d949d]" />
                  <span className="text-[#767272]">Next available: {counselor.nextAvailable}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-[#8d949d]" />
                  <span className="text-[#767272]">Languages: {counselor.languages.join(', ')}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedCounselor(counselor)}
                  className="flex-1 bg-[#3d9098] text-white py-2.5 rounded-lg hover:opacity-90 transition-colors font-semibold"
                >
                  Book Appointment
                </button>
                <button className="px-4 py-2.5 border border-[#c8ced1] rounded-lg hover:bg-[#f2f7eb] transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="px-4 py-2.5 border border-[#c8ced1] rounded-lg hover:bg-[#f2f7eb] transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedCounselor && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCounselor(null)}
          >
            <div
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border"
              style={{ borderColor: '#c8ced1' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2e2f34]">Book with {selectedCounselor.name}</h2>
                <button
                  onClick={() => setSelectedCounselor(null)}
                  className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-[#2e2f34] mb-2">Select Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTimeSlot('');
                    }}
                    className="w-full p-3 border border-[#c8ced1] rounded-lg focus:outline-none focus:border-[#3d9098]"
                  >
                    <option value="">Choose a date</option>
                    {selectedCounselor.availableDays.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                {/* Time Slot Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2e2f34] mb-2">Select Time</label>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedCounselor.timeSlots[selectedDate]?.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`p-3 rounded-lg border transition-colors ${selectedTimeSlot === time
                              ? 'bg-[#3d9098] text-white border-[#3d9098]'
                              : 'border-[#c8ced1] hover:bg-[#f2f7eb]'
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointment Summary */}
                {selectedDate && selectedTimeSlot && (
                  <div className="bg-[#f2f7eb] rounded-lg p-4">
                    <h3 className="font-semibold text-[#2e2f34] mb-2">Appointment Summary</h3>
                    <div className="space-y-1 text-sm text-[#767272]">
                      <p><strong>Counselor:</strong> {selectedCounselor.name}</p>
                      <p><strong>Specialization:</strong> {selectedCounselor.specialization}</p>
                      <p><strong>Date:</strong> {selectedDate}</p>
                      <p><strong>Time:</strong> {selectedTimeSlot}</p>
                      <p><strong>Location:</strong> {selectedCounselor.location}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedCounselor(null)}
                    className="flex-1 px-4 py-3 border border-[#c8ced1] rounded-lg hover:bg-[#f2f7eb] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBookAppointment(selectedCounselor.id)}
                    disabled={!selectedDate || !selectedTimeSlot}
                    className="flex-1 px-4 py-3 bg-[#3d9098] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCounselor;
