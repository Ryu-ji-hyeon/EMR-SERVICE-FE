import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorSelector = ({ department, onSelect }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(response.data.token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (department && csrfToken) {
        try {
          const token = localStorage.getItem('token'); 
          const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/doctors?department=${department}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-XSRF-TOKEN': csrfToken
            },
            withCredentials: true
          });

          if (Array.isArray(response.data)) {
            setDoctors(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setDoctors([]);
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setDoctors([]);
        }
      }
    };

    fetchDoctors();
  }, [department, csrfToken]);

  const handleSelect = (event) => {
    const doctorId = event.target.value;
    const doctor = doctors.find(doc => doc.doctorId === parseInt(doctorId));
    setSelectedDoctor(doctorId);
    onSelect(doctor);  // Pass the whole doctor object to the parent component
  };

  return (
    <div>
      <h2>의사 선생님을 선택하세요</h2>
      <select value={selectedDoctor} onChange={handleSelect}>
        <option value="" disabled>의사 선생님을 선택하세요</option>
        {doctors.map((doctor, index) => (
          <option key={index} value={doctor.doctorId}>{doctor.doctorName}</option>
        ))}
      </select>
    </div>
  );
};

export default DoctorSelector;
