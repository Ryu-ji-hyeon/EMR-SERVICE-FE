import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentSelector from '../Doctor/DepartmentSelector';
import DoctorSelector from '../Doctor/DoctorSelector';

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
    <div style={{ padding: '20px' }}>
      <h1>음성 인식 예약 시스템</h1>
      <DepartmentSelector onSelect={handleDepartmentSelect} />
      {selectedDepartment && (
        <DoctorSelector department={selectedDepartment} onSelect={handleDoctorSelect} />
      )}
    </div>
  );
};

export default DepartmentDoctorSelection;
