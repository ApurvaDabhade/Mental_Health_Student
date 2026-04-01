import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Users, Brain, CheckCircle, Star, ArrowRight, Menu, X, MessageCircle, Calendar, BookOpen, BarChart3, Sparkles, Activity, Globe, Smile } from 'lucide-react';

export default function Homepage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    { text: "The self-assessment tools helped me understand my anxiety better. I finally reached out for help.", author: "Anonymous User", rating: 5 },
    { text: "The AI chatbot was there for me at 3 AM when I had a panic attack. It really helped me calm down.", author: "Anonymous User", rating: 5 },
    { text: "I love the peer support community. Knowing I'm not alone in my struggles made all the difference.", author: "Anonymous User", rating: 5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Self-Assessment Tools",
      description: "Screenings and questionnaires to understand how you're doing."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chat",
      description: "Talk anytime — supportive, private chat."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Counsellor Booking",
      description: "Book sessions when you want professional support."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Peer Support Community",
      description: "Connect with others in a safe space."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Resources",
      description: "Articles and tools in more than one language."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Wellness & Routine",
      description: "Meditation, breathing, and daily habits."
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#6366F1] p-2 rounded-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Manas Veda</h1>
                <p className="text-xs" style={{color:'#6B7280'}}>Wellbeing</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="transition-colors" style={{color:'#767272'}}>About</a>
              <a href="#features" className="transition-colors" style={{color:'#767272'}}>Features</a>
              <a href="#how-it-works" className="transition-colors" style={{color:'#767272'}}>How It Works</a>
              <a href="#testimonials" className="transition-colors" style={{color:'#767272'}}>Reviews</a>
              <Link to="/stress-report" className="transition-colors" style={{color:'#767272'}}>
                Stress report
              </Link>
              <button 
                onClick={() => navigate('/login')}
                className="text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105" 
                style={{background:'#6366F1'}}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t py-4" style={{borderColor:'#c8ced1'}}>
              <div className="flex flex-col space-y-4">
                <a href="#about" className="px-4" style={{color:'#767272'}}>About</a>
                <a href="#features" className="px-4" style={{color:'#767272'}}>Features</a>
                <a href="#how-it-works" className="px-4" style={{color:'#767272'}}>How It Works</a>
                <a href="#testimonials" className="px-4" style={{color:'#767272'}}>Reviews</a>
                <Link to="/stress-report" className="px-4" style={{color:'#767272'}}>
                  Stress report
                </Link>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-white px-6 py-2 rounded-full mx-4" 
                  style={{background:'#2dc8ca'}}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium" style={{background:'#EEF2FF', color:'#6366F1'}}>
                <Sparkles className="w-4 h-4" />
                <span>Anonymous & Accessible Support</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{color:'#111827'}}>
                Your Mental Health{' '}
                <span className="text-[#6366F1]">Journey</span> Starts Here
              </h1>
              
              <p className="text-xl leading-relaxed" style={{color:'#6B7280'}}>
                This platform provides comprehensive mental health support—from self-assessment tools and AI-guided emotional support to professional counselling and peer connections. All in one safe, accessible, and stigma-free space.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2" 
                  style={{background:'#6366F1'}}
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto border-2 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2" style={{borderColor:'#6366F1', color:'#6366F1'}}>
                  <MessageCircle className="w-5 h-5" />
                  <span>Try AI Chatbot</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" style={{color:'#889260'}} />
                  <span className="text-sm" style={{color:'#767272'}}>100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" style={{color:'#889260'}} />
                  <span className="text-sm" style={{color:'#767272'}}>24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" style={{color:'#ab5275'}} />
                  <span className="text-sm" style={{color:'#767272'}}>Free to Use</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500" style={{background:'#E0E7FF'}}>
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg" style={{background:'#EEF2FF'}}>
                        <p className="text-sm" style={{color:'#4F46E5'}}>Hi! I'm here to support you. How are you feeling today?</p>
                      </div>
                      <div className="p-3 rounded-lg ml-8" style={{background:'#E5E7EB'}}>
                        <p className="text-sm" style={{color:'#111827'}}>I've been feeling anxious lately...</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{background:'#EEF2FF'}}>
                        <p className="text-sm" style={{color:'#4F46E5'}}>Let's try a grounding technique together. It can help...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 text-white p-3 rounded-full shadow-lg animate-bounce" style={{background:'#6366F1'}}>
                <Heart className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 p-3 rounded-full shadow-lg" style={{background:'#E5E7EB'}}>
                <Shield className="w-6 h-6" style={{color:'#4F46E5'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" style={{background:'#f2f7eb'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{color:'#2e2f34'}}>
                  Breaking Barriers to Mental Health Support
                </h2>
                <p className="text-lg sm:text-xl leading-relaxed mb-6" style={{color:'#767272'}}>
                  Mental health awareness is growing, yet access to timely, affordable, and reliable support remains limited—especially in underserved communities. Stigma, lack of professional resources, and language barriers prevent many from seeking help.
                </p>
                <p className="text-lg leading-relaxed" style={{color:'#767272'}}>
                  Sahay is a comprehensive digital platform providing early intervention, self-assessment tools, professional counselling access, AI-based emotional guidance, and community-driven peer support—all in one safe and accessible space.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={{background:'#eaf1f5'}}>
                  <div className="p-3 rounded-full w-fit mb-4" style={{background:'#3d9098'}}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{color:'#2e2f34'}}>For Everyone</h3>
                  <p className="text-sm" style={{color:'#767272'}}>Accessible mental health support for all</p>
                </div>
                
                <div className="p-6 rounded-2xl" style={{background:'#fbf1ea'}}>
                  <div className="p-3 rounded-full w-fit mb-4" style={{background:'#f99c5b'}}>
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{color:'#2e2f34'}}>Multilingual</h3>
                  <p className="text-sm" style={{color:'#767272'}}>Support in multiple languages</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl p-8" style={{background:'#eaf1f5'}}>
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="p-4 rounded-full w-fit mx-auto" style={{background:'#3d9098'}}>
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold" style={{color:'#2e2f34'}}>Our Vision</h3>
                    <p className="leading-relaxed" style={{color:'#767272'}}>
                      To build a trusted digital ecosystem where mental well-being support is available anytime, anywhere, empowering individuals—especially from underserved communities—to seek help confidently and without stigma.
                    </p>
                    <div className="flex items-center justify-center space-x-2" style={{color:'#3d9098'}}>
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Accessible • Inclusive • Stigma-free</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 p-4 rounded-full shadow-lg animate-pulse" style={{background:'#3d9098'}}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-4 rounded-full shadow-lg" style={{background:'#b7c0d0'}}>
                <Sparkles className="w-8 h-8" style={{color:'#3d9098'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{color:'#2e2f34'}}>
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color:'#767272'}}>
              Everything you need for your mental well-being journey, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group" style={{background:'#eaf1f5'}}>
                <div className="text-white p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300" style={{background:'#3d9098'}}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4" style={{color:'#2e2f34'}}>{feature.title}</h3>
                <p className="leading-relaxed" style={{color:'#767272'}}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8" style={{background:'#f2f7eb'}}>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl" style={{background:'#3d9098'}}>
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{color:'#2e2f34'}}>Daily Check-In</h3>
                  <p style={{color:'#767272'}}>
                    Track your mood and emotional health with simple daily well-being questions. Regular self-reflection helps you understand patterns and take informed steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{background:'#fbf1ea'}}>
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl" style={{background:'#f99c5b'}}>
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{color:'#2e2f34'}}>Wellness Routines</h3>
                  <p style={{color:'#767272'}}>
                    Access guided meditation, breathing exercises, and daily exercise suggestions with built-in timers and reminders to develop healthy mental health routines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" style={{background:'#f2f7eb'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{color:'#2e2f34'}}>
              How Sahay Works
            </h2>
            <p className="text-xl" style={{color:'#767272'}}>
              Simple steps to access comprehensive mental health support
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <div className="text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{background:'#3d9098'}}>
                  1
                </div>
                <Users className="w-16 h-16 mx-auto" style={{color:'#3d9098'}} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color:'#2e2f34'}}>
                Sign Up
              </h3>
              <p style={{color:'#767272'}}>
                Create your account and access our platform anonymously and securely.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <div className="text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{background:'#2dc8ca'}}>
                  2
                </div>
                <Brain className="w-16 h-16 mx-auto" style={{color:'#2dc8ca'}} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color:'#2e2f34'}}>Self-Assess</h3>
              <p style={{color:'#767272'}}>
                Take PHQ-9 or GAD-7 assessments to understand your mental well-being.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <div className="text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{background:'#f99c5b'}}>
                  3
                </div>
                <MessageCircle className="w-16 h-16 mx-auto" style={{color:'#f99c5b'}} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color:'#2e2f34'}}>Get Support</h3>
              <p style={{color:'#767272'}}>
                Chat with AI, book counsellors, or connect with peers for immediate help.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <div className="text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{background:'#889260'}}>
                  4
                </div>
                <Heart className="w-16 h-16 mx-auto" style={{color:'#889260'}} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color:'#2e2f34'}}>Track Progress</h3>
              <p style={{color:'#767272'}}>
                Monitor your journey with daily check-ins and wellness tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{color:'#2e2f34'}}>
                Your Privacy is Our Priority
              </h2>
              <p className="text-xl mb-8" style={{color:'#767272'}}>
                We understand that seeking mental health support requires trust. That's why anonymity and security are built into every feature of Sahay.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full" style={{background:'#f2f7eb'}}>
                    <CheckCircle className="w-6 h-6" style={{color:'#889260'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{color:'#2e2f34'}}>Anonymous Community</h3>
                    <p style={{color:'#767272'}}>Share in peer support spaces without revealing your identity. Express yourself freely without fear of judgment.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full" style={{background:'#f2f7eb'}}>
                    <CheckCircle className="w-6 h-6" style={{color:'#889260'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{color:'#2e2f34'}}>Secure Counselling</h3>
                    <p style={{color:'#767272'}}>Your sessions with counsellors remain confidential and protected with end-to-end encryption.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full" style={{background:'#f2f7eb'}}>
                    <CheckCircle className="w-6 h-6" style={{color:'#889260'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{color:'#2e2f34'}}>Private Assessment Data</h3>
                    <p style={{color:'#767272'}}>Your self-assessment results and mental health data are stored securely and never shared without consent.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-8" style={{background:'#eaf1f5'}}>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold" style={{color:'#2e2f34'}}>Privacy Dashboard</h3>
                  <Shield className="w-6 h-6" style={{color:'#2dc8ca'}} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color:'#767272'}}>Anonymous Community Posts</span>
                    <span className="px-2 py-1 rounded text-xs" style={{background:'#f2f7eb', color:'#889260'}}>Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color:'#767272'}}>Data Encryption</span>
                    <span className="px-2 py-1 rounded text-xs" style={{background:'#f2f7eb', color:'#889260'}}>256-bit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color:'#767272'}}>Secure Sessions</span>
                    <span className="px-2 py-1 rounded text-xs" style={{background:'#f2f7eb', color:'#889260'}}>Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color:'#767272'}}>Data Sharing</span>
                    <span className="px-2 py-1 rounded text-xs" style={{background:'#fbf1ea', color:'#f99c5b'}}>Never</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" style={{background:'#f2f7eb'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{color:'#2e2f34'}}>
            Users Trust Sahay
          </h2>
          <p className="text-xl mb-12" style={{color:'#767272'}}>
            Hear from people who found support through our platform
          </p>

          <div className="rounded-3xl p-8 shadow-xl" style={{background:'#eaf1f5'}}>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" style={{color:'#eac163'}} />
              ))}
            </div>
            
            <blockquote className="text-xl mb-6 italic" style={{color:'#2e2f34'}}>
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            
            <p className="font-semibold" style={{color:'#3d9098'}}>
              {testimonials[currentTestimonial].author}
            </p>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-[#2dc8ca]' : 'bg-[#c8ced1]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{background:'#2dc8ca'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey with Manas Veda?
          </h2>
          <p className="text-xl mb-8" style={{color:'#fbecb3'}}>
            Join a supportive community where mental health support is accessible, anonymous, and stigma-free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2" 
              style={{color:'#3d9098'}}
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#3d9098] transition-all duration-300 flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>For Counsellors</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{background:'#2e2f34'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl" style={{background:'#3d9098'}}>
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Sahay</h3>
                  <p style={{color:'#c8ced1'}}>Manas Veda</p>
                </div>
              </div>
              <p className="mb-6 max-w-md" style={{color:'#c8ced1'}}>
                Empowering individuals with accessible, anonymous, and comprehensive mental health support for everyone.
              </p>
              <div className="flex space-x-4">
                <div className="p-3 rounded-lg" style={{background:'#7d7074'}}>
                  <span className="text-sm">🌍 Inclusive & Multilingual</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-3" style={{color:'#c8ced1'}}>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3" style={{color:'#c8ced1'}}>
                <li><a href="#" className="hover:text-white transition-colors">Crisis Helplines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Counsellor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 text-center" style={{borderTop:'1px solid #7d7074', color:'#c8ced1'}}>
            <p>&copy; 2025 Sahay. All rights reserved. Built with ❤️ for mental wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
            