import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import Home from './Main/Home';
import LoginForm from './Main/LoginForm';
import SignupForm from './Main/SignupForm';
import DoctorSignup from './Doctor/DoctorSignup'; // 추가
import Footer from './components/Footer';
import VoiceReservationSystem from './Voice/VoiceReservationSystem';
import './style.css';

function App() {
  return (
    <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home/loginForm" element={<LoginForm />} />
            <Route path="/home/choiceMember" element={<SignupForm />} />
            <Route path="/doctor/signup" element={<DoctorSignup />} /> {/* 추가 */}
            <Route path="/home/logout" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
          </Routes>
          <Footer />
        </div>
    </AuthProvider>
  );
}

export default App;

{/* <VoiceReservationSystem /> 추가 */}