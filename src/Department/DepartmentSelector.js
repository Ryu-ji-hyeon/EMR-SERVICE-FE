import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentSelector = ({ onSelect }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchDepartmentsAndCsrfToken = async () => {
      try {
        // CSRF 토큰을 서버에서 가져옵니다.
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        const csrfToken = csrfResponse.data.token;

        // 서버에서 부서 목록을 가져옵니다.
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': csrfToken
          }
        });

        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };

    fetchDepartmentsAndCsrfToken();
  }, []);

  const handleSelect = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    onSelect(department);
  };

  return (
    <div>
      <h2>부서를 선택하세요</h2>
      <select value={selectedDepartment} onChange={handleSelect}>
        <option value="" disabled>부서를 선택하세요</option>
        {departments.map((department, index) => (
          <option key={index} value={department.deptName}>{department.deptName}</option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentSelector;
