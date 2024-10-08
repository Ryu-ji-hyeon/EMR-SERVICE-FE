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
import ReservationDetails from './VoiceReservation/ReservationDetails';
import StandardDepartmentDoctorSelector from './Department/StandardDepartmentDoctorSelector';
import EditPrescription from './Doctor/EditPrescription';

function App() {
  return (
    <AuthProvider>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/home/loginForm" element={<LoginForm />} />
            <Route path="/home/choiceMember" element={<SignupForm />} />
            <Route path="/doctor/signup" element={<DoctorSignup />} />
            <Route path="/member/signup" element={<MemberSignup />} />
            <Route path="/member/dashboard" element={
              <PrivateRoute>
                <MemberDashboard />
              </PrivateRoute>
            } />
            // 예약 확인
            <Route path="/member/reservations" element={
            <PrivateRoute>
              <ReservationHistory />
            </PrivateRoute>
          } />
            // 예약 자세히 보기
           <Route path="/reservation/details" element={
            <PrivateRoute>
              <ReservationDetails />
            </PrivateRoute>
          } />
          <Route path="/member/prescriptions" element={
            <PrivateRoute>
              <ViewPrescriptions />
            </PrivateRoute>
          } />
            <Route path="/doctor/dashboard" element={
              <PrivateRoute>
                <DoctorDashboard />
              </PrivateRoute>
            } />
             <Route path="/doctor/prescribe" element={
              <PrivateRoute>
                <CreatePrescription />
              </PrivateRoute>
            } />
            <Route path="/doctor/edit-prescription" element={
              <PrivateRoute>
                <EditPrescription />
              </PrivateRoute>
            } />
            <Route path="/doctor/reservations" element={
              <PrivateRoute>
                <DoctorReservations />
              </PrivateRoute>
            } />
            <Route path="/reservation-choice" element={
              <PrivateRoute>
                <ReservationChoice />
              </PrivateRoute>
            } />
            <Route path="/Voice/DepartmentDoctorSelection" element={
              <PrivateRoute>
                <DepartmentDoctorSelection />
              </PrivateRoute>
            } />
            <Route path="/Voice/ReservationScreen" element={
              <PrivateRoute>
                <VoiceReservationSystem />
              </PrivateRoute>
            } />
            <Route path="/Standard/ReservationScreen" element={
              <PrivateRoute>
                <StandardReservation />
              </PrivateRoute>
            } />
            <Route path="/standard-reservation" element={
              <PrivateRoute>
                <StandardDepartmentDoctorSelector />
              </PrivateRoute>
            } />
            <Route path="/Voice/VoiceGuide" element={
              <PrivateRoute>
                <VoiceGuide />
              </PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;
