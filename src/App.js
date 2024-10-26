import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import LoginForm from './Main/LoginForm';
import SignupForm from './Main/SignupForm';
import DoctorSignup from './Doctor/DoctorSignup';
import MemberSignup from './Member/MemberSignup';
import Footer from './components/Footer';
import DepartmentDoctorSelection from './VoiceReservation/VoiceDepartmentDoctorSelection';
import VoiceReservationSystem from './VoiceReservation/VoiceReservationSystem';
import MemberDashboard from './Member/MemberDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
import NavBar from './components/NavBar';
import ReservationHistory from './VoiceReservation/ReservationHistory'; 
import ReservationChoice from './VoiceReservation/ReservationChoice'; 
import StandardReservation from './StandardReservation/StandardReservation';
import VoiceGuide from './VoiceReservation/VoiceGuide';
import CreatePrescription from './Doctor/CreatePrescription';
import ViewPrescriptions from './Member/ViewPrescriptions';
import DoctorReservations from './Doctor/DoctorReservations';
import DoctorReservationDetails from './Doctor/DoctorReservationDetails';
import StandardDepartmentDoctorSelector from './Department/StandardDepartmentDoctorSelector';
import EditPrescription from './Doctor/EditPrescription';
import MemberProfile from './Member/MemberProfile';
import MemberEdit from './Member/MemberEdit';
import MemberUpdatePassword from './Member/MemberUpdatePassword';
import MemberDelete from './Member/MemberDelete';
import MemberReservationDetails from './Member/MemberReservationDetails';
import DoctorProfile from './Doctor/DoctorProfile';
import DoctorUpdatePassword from './Doctor/DoctorUpdatePassword';
import DoctorDelete from './Doctor/DoctorDelete';
import SplashScreen from './components/SplashScreen'; // 스플래시 스크린 추가

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 후 로딩 종료
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 로딩 중에는 스플래시 스크린 표시
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home/loginForm" element={<LoginForm />} />
          <Route path="/home/choiceMember" element={<SignupForm />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/member/signup" element={<MemberSignup />} />
          <Route path="/member/dashboard" element={<PrivateRoute><MemberDashboard /></PrivateRoute>} />
          <Route path="/member/reservations" element={<PrivateRoute><ReservationHistory /></PrivateRoute>} />
          <Route path="/doctor/reservation/details" element={<PrivateRoute><DoctorReservationDetails /></PrivateRoute>} />
          <Route path="/member/reservation/details" element={<PrivateRoute><MemberReservationDetails /></PrivateRoute>} />
          <Route path="/member/prescriptions" element={<PrivateRoute><ViewPrescriptions /></PrivateRoute>} />
          <Route path="/member/profile" element={<PrivateRoute><MemberProfile /></PrivateRoute>} />
          <Route path="/member/edit" element={<PrivateRoute><MemberEdit /></PrivateRoute>} />
          <Route path="/member/memberupdatepassword" element={<PrivateRoute><MemberUpdatePassword /></PrivateRoute>} />
          <Route path="/member/delete" element={<PrivateRoute><MemberDelete /></PrivateRoute>} />
          <Route path="/doctor/profile" element={<PrivateRoute><DoctorProfile /></PrivateRoute>} />
          <Route path="/doctor/doctorupdatepassword" element={<PrivateRoute><DoctorUpdatePassword /></PrivateRoute>} />
          <Route path="/doctor/delete" element={<PrivateRoute><DoctorDelete /></PrivateRoute>} />
          <Route path="/doctor/dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
          <Route path="/doctor/prescribe" element={<PrivateRoute><CreatePrescription /></PrivateRoute>} />
          <Route path="/doctor/edit-prescription" element={<PrivateRoute><EditPrescription /></PrivateRoute>} />
          <Route path="/doctor/reservations" element={<PrivateRoute><DoctorReservations /></PrivateRoute>} />
          <Route path="/reservation-choice" element={<PrivateRoute><ReservationChoice /></PrivateRoute>} />
          <Route path="/Voice/DepartmentDoctorSelection" element={<PrivateRoute><DepartmentDoctorSelection /></PrivateRoute>} />
          <Route path="/Voice/ReservationScreen" element={<PrivateRoute><VoiceReservationSystem /></PrivateRoute>} />
          <Route path="/Standard/ReservationScreen" element={<PrivateRoute><StandardReservation /></PrivateRoute>} />
          <Route path="/standard-reservation" element={<PrivateRoute><StandardDepartmentDoctorSelector /></PrivateRoute>} />
          <Route path="/Voice/VoiceGuide" element={<PrivateRoute><VoiceGuide /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
