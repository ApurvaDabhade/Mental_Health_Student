// Frontend/src/components/ProtectedRoute.jsx
import React from 'react';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  // Auth temporarily disabled – always allow access
  return children;
};

export default ProtectedRoute;