import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentSelector from '../Doctor/DepartmentSelector';
import DoctorSelector from '../Doctor/DoctorSelector';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DepartmentDoctorSelection.css';

const DepartmentDoctorSelection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    navigate('/Voice/ReservationScreen', { state: { selectedDoctor: doctor } });
  };

  return (
    <div className="background">
      <div className="container mt-5">
        <h1 className="text-center mb-4">음성 인식 예약 시스템</h1>
        <div className="card p-4">
          <DepartmentSelector onSelect={handleDepartmentSelect} />
          {selectedDepartment && (
            <DoctorSelector department={selectedDepartment} onSelect={handleDoctorSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDoctorSelection;
