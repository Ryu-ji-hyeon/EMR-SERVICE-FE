import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DepartmentDoctorSelection from './DepartmentDoctorSelection';
import ReservationScreen from './ReservationScreen';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoiceReservationSystem = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route 
            path="/" 
            element={<DepartmentDoctorSelection onDoctorSelect={handleDoctorSelect} />} 
          />
          <Route 
            path="/reservation" 
            element={<ReservationScreen selectedDoctor={selectedDoctor} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default VoiceReservationSystem;
