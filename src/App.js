import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Home from './Main/Home';
import LoginForm from './Main/LoginForm';
import SignupForm from './Main/SignupForm';
import DoctorSignup from './Doctor/DoctorSignup';
import MemberSignup from './Member/MemberSignup';
import Footer from './components/Footer';
import VoiceReservationSystem from './Voice/VoiceReservationSystem';
import MemberDashboard from './Member/MemberDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';

function App() {
  return (
    <AuthProvider>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home/loginForm" element={<LoginForm />} />
          <Route path="/home/choiceMember" element={<SignupForm />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/member/signup" element={<MemberSignup />} />
          <Route path="/member/dashboard" element={
            <PrivateRoute>
              <MemberDashboard />
            </PrivateRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          } />
          <Route path="/logout" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/voice/reservation" element={
            <PrivateRoute>
              <VoiceReservationSystem />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
