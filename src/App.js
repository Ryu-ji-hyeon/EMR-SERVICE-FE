import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Home from './Main/Home';
import LoginForm from './Main/LoginForm';
import SignupForm from './Main/SignupForm';
import DoctorSignup from './Doctor/DoctorSignup';
import MemberSignup from './Member/MemberSignup';
import Footer from './components/Footer';
import DepartmentDoctorSelection from './Doctor/DepartmentDoctorSelection';
import ReservationScreen from './Voice/ReservationScreen';
import MemberDashboard from './Member/MemberDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
import NavBar from './components/NavBar';
import ReservationHistory from './Voice/ReservationHistory'; 

function App() {
  return (
    <AuthProvider>
        <NavBar />
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
            <Route path="/member/reservations" element={
            <PrivateRoute>
              <ReservationHistory />
            </PrivateRoute>
          } />
            <Route path="/doctor/dashboard" element={
              <PrivateRoute>
                <DoctorDashboard />
              </PrivateRoute>
            } />
            <Route path="/Voice/DepartmentDoctorSelection" element={
              <PrivateRoute>
                <DepartmentDoctorSelection />
              </PrivateRoute>
            } />
            <Route path="/Voice/ReservationScreen" element={
              <PrivateRoute>
                <ReservationScreen />
              </PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
          </Routes>
        </div>
        <Footer />
    </AuthProvider>
  );
}

export default App;
