// Frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const homeForType = (t) => {
  if (t === 'counsellor') return '/counsellor';
  if (t === 'institute') return '/institute';
  return '/mainpage';
};

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  if (!requiredUserType) return children;
  const t = localStorage.getItem('userType') || 'user';
  if (t !== requiredUserType) {
    return <Navigate to={homeForType(t)} replace />;
  }
  return children;
};

export default ProtectedRoute;