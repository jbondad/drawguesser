import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const loggedIn = localStorage.getItem('user') !== null;
  return loggedIn ? children : <Navigate to='/Login' />;
};

export default PrivateRoute;
