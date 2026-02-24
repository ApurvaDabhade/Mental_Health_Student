import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Play, 
  Volume2, 
  BookOpen, 
  Search, 
  Filter, 
  Globe, 
  Clock, 
  Star, 
  Download, 
  Share2, 
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Users,
  Brain,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import Sidebar from './Sidebar';

const PsychoeducationalHub = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
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

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'videos', name: 'Videos', icon: Play },
    { id: 'audio', name: 'Audio', icon: Volume2 },
    { id: 'guides', name: 'Guides', icon: BookOpen }
  ];

  const languages = [
    { id: 'all', name: 'All Languages', flag: '🌐' },
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { id: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { id: 'bengali', name: 'Bengali', flag: '🇮🇳' },
    { id: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { id: 'gujarati', name: 'Gujarati', flag: '🇮🇳' }
  ];

  const videoResources = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Student\'s Guide',
      description: 'Learn about anxiety symptoms, triggers, and coping strategies specifically for college students.',
      duration: '12:30',
      language: 'english',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
      views: 1250,
      rating: 4.8,
      tags: ['anxiety', 'mental health', 'students']
    },
    {
      id: 2,
      title: 'तनाव प्रबंधन: छात्रों के लिए गाइड',
      description: 'छात्रों के लिए तनाव को समझने और प्रबंधित करने के तरीके।',
      duration: '15:45',
      language: 'hindi',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=400&auto=format&fit=crop',
      views: 890,
      rating: 4.6,
      tags: ['stress', 'hindi', 'students']
    },
    {
      id: 3,
      title: 'Mindfulness Meditation for Beginners',
      description: 'Step-by-step guide to mindfulness meditation techniques for stress relief.',
      duration: '8:20',
      language: 'english',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=400&auto=format&fit=crop',
      views: 2100,
      rating: 4.9,
      tags: ['meditation', 'mindfulness', 'relaxation']
    },
    {
      id: 4,
      title: 'கவலை மேலாண்மை: மாணவர்களுக்கான வழிகாட்டி',
      description: 'மாணவர்களுக்கு கவலை மற்றும் மன அழுத்தத்தை நிர்வகிப்பதற்கான வழிகள்.',
      duration: '14:15',
      language: 'tamil',
      category: 'videos',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
      views: 650,
      rating: 4.7,
      tags: ['anxiety', 'tamil', 'students']
    }
  ];

  const audioResources = [
    {
      id: 5,
      title: 'Deep Breathing Exercise',
      description: 'Guided breathing exercise to reduce stress and anxiety.',
      duration: '5:30',
      language: 'english',
      category: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      downloads: 3200,
      rating: 4.8,
      tags: ['breathing', 'relaxation', 'stress relief']
    },
    {
      id: 6,
      title: 'शांति के लिए ध्यान',
      description: 'तनाव कम करने के लिए निर्देशित ध्यान सत्र।',
      duration: '10:15',
      language: 'hindi',
      category: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
      downloads: 1800,
      rating: 4.6,
      tags: ['meditation', 'hindi', 'peace']
    },
    {
      id: 7,
      title: 'Sleep Stories for Better Rest',
      description: 'Calming bedtime stories to help you fall asleep faster.',
      duration: '20:00',
      language: 'english',
      category: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=400&auto=format&fit=crop',
      downloads: 4500,
      rating: 4.9,
      tags: ['sleep', 'bedtime', 'relaxation']
    },
    {
      id: 8,
      title: 'Nature Sounds for Focus',
      description: 'Ambient nature sounds to improve concentration while studying.',
      duration: '30:00',
      language: 'english',
      category: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
      downloads: 2800,
      rating: 4.7,
      tags: ['focus', 'study', 'nature']
    }
  ];

  const guideResources = [
    {
      id: 9,
      title: 'Exam Stress Management Guide',
      description: 'Comprehensive guide to managing exam stress with practical tips and techniques.',
      language: 'english',
      category: 'guides',
      thumbnail: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=400&auto=format&fit=crop',
      readTime: '8 min',
      downloads: 5600,
      rating: 4.8,
      tags: ['exam stress', 'study tips', 'academic']
    },
    {
      id: 10,
      title: 'मानसिक स्वास्थ्य गाइड: छात्रों के लिए',
      description: 'छात्रों के लिए मानसिक स्वास्थ्य को बेहतर बनाने के लिए व्यापक गाइड।',
      language: 'hindi',
      category: 'guides',
      thumbnail: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=400&auto=format&fit=crop',
      readTime: '12 min',
      downloads: 3200,
      rating: 4.7,
      tags: ['mental health', 'hindi', 'students']
    },
    {
      id: 11,
      title: 'Building Healthy Relationships',
      description: 'Guide to developing and maintaining healthy relationships in college.',
      language: 'english',
      category: 'guides',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
      readTime: '6 min',
      downloads: 4100,
      rating: 4.6,
      tags: ['relationships', 'social skills', 'college']
    },
    {
      id: 12,
      title: 'தற்காலிக மன அழுத்தம் நிர்வகிப்பு',
      description: 'மாணவர்களுக்கு தற்காலிக மன அழுத்தத்தை நிர்வகிப்பதற்கான வழிகாட்டி.',
      language: 'tamil',
      category: 'guides',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
      readTime: '10 min',
      downloads: 1800,
      rating: 4.5,
      tags: ['stress management', 'tamil', 'students']
    }
  ];

  const allResources = [...videoResources, ...audioResources, ...guideResources];

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getResourceIcon = (category) => {
    switch (category) {
      case 'videos': return Play;
      case 'audio': return Volume2;
      case 'guides': return BookOpen;
      default: return BookOpen;
    }
  };

  const getLanguageName = (langId) => {
    const lang = languages.find(l => l.id === langId);
    return lang ? lang.name : 'Unknown';
  };

  const getLanguageFlag = (langId) => {
    const lang = languages.find(l => l.id === langId);
    return lang ? lang.flag : '🌐';
  };

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#eaf1f5]/80 backdrop-blur supports-[backdrop-filter]:bg-[#eaf1f5]/60">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:'#c8ced1'}}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[#f2f7eb]"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-[#2e2f34]" />
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#3d9098]" />
              <span className="font-semibold text-[#2e2f34]">Resources</span>
            </div>
            <div className="w-6" />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="p-6 space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-[#3d9098] p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2e2f34]">Psychoeducational Resource Hub</h1>
                <p className="text-[#767272]">Videos, audio, and guides for your mental wellness journey</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 border" style={{borderColor:'#c8ced1'}}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                  <input
                    type="text"
                    placeholder="Search resources, topics, or languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dc8ca] focus:border-transparent"
                    style={{borderColor:'#c8ced1'}}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? 'bg-[#2dc8ca] text-white'
                          : 'bg-[#eaf1f5] text-[#2e2f34] hover:bg-[#c8ced1]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Filter */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-4 h-4 text-[#767272]" />
                <span className="text-sm font-medium text-[#2e2f34]">Filter by Language:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => setSelectedLanguage(language.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      selectedLanguage === language.id
                        ? 'bg-[#2dc8ca] text-white'
                        : 'bg-[#eaf1f5] text-[#2e2f34] hover:bg-[#c8ced1]'
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#2e2f34]">
                {filteredResources.length} Resources Found
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#767272]">
                <Filter className="w-4 h-4" />
                <span>Filtered by: {categories.find(c => c.id === selectedCategory)?.name} • {languages.find(l => l.id === selectedLanguage)?.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getResourceIcon(resource.category);
                return (
                  <div key={resource.id} className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all duration-300 group cursor-pointer" style={{borderColor:'#c8ced1'}}>
                    {/* Thumbnail */}
                    <div className="relative mb-4">
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="bg-[#2dc8ca] text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                          <IconComponent className="w-3 h-3" />
                          <span className="capitalize">{resource.category}</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
                          {resource.category === 'guides' ? resource.readTime : resource.duration}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getLanguageFlag(resource.language)}</span>
                          <span className="text-xs text-[#8d949d]">{getLanguageName(resource.language)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#eac163] fill-current" />
                          <span className="text-sm text-[#767272]">{resource.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-[#2e2f34] text-lg group-hover:text-[#2dc8ca] transition-colors">
                        {resource.title}
                      </h4>
                      
                      <p className="text-sm text-[#767272] line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[#8d949d]">
                        <div className="flex items-center space-x-1">
                          {resource.category === 'guides' ? (
                            <>
                              <Download className="w-3 h-3" />
                              <span>{resource.downloads} downloads</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3 h-3" />
                              <span>{resource.views || resource.downloads} {resource.category === 'videos' ? 'views' : 'downloads'}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{resource.category === 'guides' ? resource.readTime : resource.duration}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-[#eaf1f5] text-[#3d9098] text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{borderColor:'#c8ced1'}}>
                        <button className="flex items-center space-x-2 text-[#2dc8ca] hover:text-[#3d9098] transition-colors">
                          <Play className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {resource.category === 'guides' ? 'Read Guide' : 'Play'}
                          </span>
                        </button>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-[#eaf1f5] rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-[#767272]" />
                          </button>
                          <button className="p-2 hover:bg-[#eaf1f5] rounded-lg transition-colors">
                            <Share2 className="w-4 h-4 text-[#767272]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-[#8d949d] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2e2f34] mb-2">No resources found</h3>
                <p className="text-[#767272]">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Featured Section */}
          <div className="bg-[#2dc8ca] rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">Need Personalized Support?</h3>
                <p className="text-[#fbecb3] text-lg mb-6">Connect with our AI counselor or book a session with a professional</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-white text-[#2dc8ca] px-6 py-3 rounded-lg font-bold hover:bg-[#f2f7eb] transition-colors flex items-center justify-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Talk to AI Counselor
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[#2dc8ca] transition-colors flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2" />
                    Book Counseling Session
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-[#a0b4bb] rounded-xl flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PsychoeducationalHub;

