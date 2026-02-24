// src/components/ResultScreen.jsx
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  Heart, 
  ArrowLeft, 
  Share2, 
  Calendar,
  MessageCircle,
  Shield,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function ResultScreen({ result, onRestart }) {
  const navigate = useNavigate();

  const handleBookCounselor = () => {
    // Parse query parameters from next_step_url if available
    if (result.next_step_url) {
      const url = new URL(result.next_step_url, window.location.origin);
      const ref = url.searchParams.get('ref');
      const score = url.searchParams.get('score');
      
      // Navigate to booking with query parameters
      const bookingUrl = `/booking${ref ? `?ref=${ref}` : ''}${score ? `${ref ? '&' : '?'}score=${score}` : ''}`;
      navigate(bookingUrl);
    } else {
      // Fallback to booking without params
      navigate('/booking');
    }
  };
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
        return '#2dc8ca';
      case 'mild':
        return '#52c97a';
      case 'moderate':
        return '#eac163';
      case 'moderately_severe':
      case 'moderately severe':
        return '#f99c5b';
      case 'severe':
        return '#f38788';
      default:
        return '#3d9098';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
      case 'mild':
        return <CheckCircle className="w-5 h-5" />;
      case 'moderate':
        return <Info className="w-5 h-5" />;
      case 'moderately_severe':
      case 'moderately severe':
      case 'severe':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getSeverityMessage = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
        return "You're doing well! Keep up the great self-care habits.";
      case 'mild':
        return "You're managing well overall. Consider some additional self-care strategies.";
      case 'moderate':
        return "Your responses suggest some challenges. Consider reaching out for support.";
      case 'moderately_severe':
      case 'moderately severe':
        return "Your responses indicate significant concerns. Professional support is recommended.";
      case 'severe':
        return "Your responses suggest you may benefit from immediate professional support.";
      default:
        return "Thank you for completing the assessment. Your responses have been recorded.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-xl p-8 text-center" style={{borderColor:'#c8ced1'}}>
        <div className="w-20 h-20 bg-[#3d9098] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-[#2e2f34] mb-2">Assessment Complete</h2>
        <p className="text-[#767272]">Your personalized mental wellness insights</p>
      </div>

      {/* Score Card */}
      <div className="bg-white border rounded-xl p-8" style={{borderColor:'#c8ced1'}}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#3d9098] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2e2f34]">Your Assessment Score</h3>
          </div>
          
          <div 
            className="text-6xl font-bold mb-2"
            style={{color: getSeverityColor(result.severity)}}
          >
            {result.total_score}
          </div>
          
          <div 
            className="text-xl font-semibold mb-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full"
            style={{backgroundColor: getSeverityColor(result.severity) + '20', color: getSeverityColor(result.severity)}}
          >
            {getSeverityIcon(result.severity)}
            <span className="capitalize">{result.severity.replace('_', ' ')}</span>
          </div>
          
          <p className="text-[#767272] max-w-md mx-auto">
            {getSeverityMessage(result.severity)}
          </p>
        </div>
      </div>

      {/* Detailed Message */}
      <div className="bg-white border rounded-xl p-8" style={{borderColor:'#c8ced1'}}>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-[#3d9098] rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#2e2f34] mb-3">Personalized Insights</h4>
            <p className="text-[#2e2f34] leading-relaxed">{result.message}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {result.next_step_url && (
          <button 
            onClick={handleBookCounselor}
            className="w-full px-6 py-4 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Counselor Session</span>
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/mainpage')}
            className="px-6 py-3 border border-[#c8ced1] text-[#2e2f34] rounded-xl font-semibold hover:bg-[#f2f7eb] flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <button className="px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-[#f2f7eb] border border-[#3d9098]/20 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-[#3d9098] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#2e2f34]">
            <p className="font-medium mb-1">Your Privacy is Protected</p>
            <p className="text-[#767272]">This assessment is completely anonymous. Your responses are not linked to your identity and are used only to provide you with personalized insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}