import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Briefcase, GraduationCap, Award, Globe, Loader2, Clock, Calendar } from 'lucide-react';

export default function CounsellorOnboarding() {
    const navigate = useNavigate();
    const location = useLocation();
    // Auth/backend temporarily disabled – no userId required for now

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        experienceYears: '',
        specializations: '', // Comma separated string for input
        qualifications: '', // Simple string for now, or JSON logic later
        languages: '', // Comma separated
        startTime: '09:00',
        endTime: '17:00'
    });

    const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Temporarily store profile locally instead of sending to backend
        const payload = {
            bio: formData.bio,
            experienceYears: Number(formData.experienceYears),
            specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
            languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
            qualifications: [{ degree: formData.qualifications, institution: 'Various', year: new Date().getFullYear() }],
            availability: {
                days: selectedDays,
                slots: [{ startTime: formData.startTime, endTime: formData.endTime }]
            }
        };

        try {
            localStorage.setItem('counsellorProfileDraft', JSON.stringify(payload));
            navigate('/counsellor'); // Counsellor dashboard
        } catch (error) {
            console.error('Error saving counsellor profile locally:', error);
            alert('Failed to save profile locally. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf1f5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#2e2f34]">Complete Your Counsellor Profile</h1>
                    <p className="mt-2 text-[#767272]">
                        Help students find you by sharing your expertise and experience.
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border" style={{ borderColor: '#c8ced1' }}>
                    <div className="bg-[#2dc8ca] h-2"></div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Bio Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-[#2dc8ca]">
                                <CheckCircle className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-[#2e2f34]">About You</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#2e2f34] mb-1">Professional Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                    placeholder="Tell students about your approach and background..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-[#2dc8ca]">
                                <Briefcase className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-[#2e2f34]">Experience & Skills</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#2e2f34] mb-1">Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experienceYears"
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                        placeholder="e.g. 5"
                                        value={formData.experienceYears}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#2e2f34] mb-1">Languages Spoken</label>
                                    <input
                                        type="text"
                                        name="languages"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                        placeholder="English, Hindi, Bengali..."
                                        value={formData.languages}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#2e2f34] mb-1">Specializations (Comma separated)</label>
                                <input
                                    type="text"
                                    name="specializations"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                    placeholder="Anxiety, Career Counseling, Depression..."
                                    value={formData.specializations}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Qualifications Section (Simplified) */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-[#2dc8ca]">
                                <GraduationCap className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-[#2e2f34]">Qualifications</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#2e2f34] mb-1">Highest Degree / Certification</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                    placeholder="M.Sc. in Psychology, PhD, etc."
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Availability Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-[#2dc8ca]">
                                <Clock className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-[#2e2f34]">Availability</h3>
                            </div>

                            {/* Days Selector */}
                            <div>
                                <label className="block text-sm font-medium text-[#2e2f34] mb-3 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Available Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedDays.includes(day)
                                                ? 'bg-[#2dc8ca] text-white border-[#2dc8ca] shadow-md'
                                                : 'bg-white text-[#767272] border-gray-300 hover:border-[#2dc8ca]'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Range */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#2e2f34] mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#2e2f34] mb-1">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent transition-all"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#2dc8ca] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#25a8aa] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                        Saving Profile...
                                    </>
                                ) : (
                                    "Save & Continue to Dashboard"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
