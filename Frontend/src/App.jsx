// Frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import DailyCheckIn from './components/DailyCheckIn';
import BookCounselor from './components/BookCounselor';
import CounsellorDashboard from './components/CounsellorDashboard';
import PsychoeducationalHub from './components/PsychoeducationalHub';
import './App.css';
import Exercise from "./components/Exercise";
import Meditation from "./components/Meditation";
import CounsellorOnboarding from "./components/CounsellorOnboarding";
import WellnessChat from "./components/SahaayChat";
import AssessmentFlow from "./components/AssessmentFlow";
import PeerSupport from "./components/PeerSupport";
import HomePage from "./components/HomePage";
import MHFATrainingLab from "./components/MHFATrainingLab";
import StudentStressReportDashboard from "./components/StudentStressReportDashboard";
import OnboardingFlow from "./components/OnboardingFlow";
import InstituteDashboard from "./components/InstituteDashboard";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-user" element={<SignupPage />} />
      <Route path="/register-counsellor" element={<SignupPage />} />

      {/* Protected User Routes */}
      <Route
        path="/mainpage"
        element={
          <ProtectedRoute requiredUserType="user">
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute requiredUserType="user">
            <DailyCheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute requiredUserType="user">
            <BookCounselor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute requiredUserType="user">
            <PsychoeducationalHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute requiredUserType="user">
            <WellnessChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercise"
        element={
          <ProtectedRoute requiredUserType="user">
            < Exercise />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meditation"
        element={
          <ProtectedRoute requiredUserType="user">
            < Meditation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute requiredUserType="user">
            < AssessmentFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/peer-support"
        element={
          <ProtectedRoute requiredUserType="user">
            <PeerSupport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mhfa-training-lab"
        element={
          <ProtectedRoute requiredUserType="user">
            <MHFATrainingLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stress-report"
        element={
          <ProtectedRoute requiredUserType="user">
            <StudentStressReportDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requiredUserType="user">
            <OnboardingFlow />
          </ProtectedRoute>
        }
      />

      <Route
        path="/institute"
        element={
          <ProtectedRoute requiredUserType="institute">
            <InstituteDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Counsellor Routes */}
      <Route
        path="/counsellor"
        element={
          <ProtectedRoute requiredUserType="counsellor">
            <CounsellorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/counsellor-onboarding"
        element={
          <ProtectedRoute requiredUserType="counsellor">
            <CounsellorOnboarding />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;