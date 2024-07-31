import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ReservationHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [patientId, setPatientId] = useState(null);
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

    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token: ", decodedToken); 
      const loggedInUserId = decodedToken?.sub; 
      console.log("loggedInUserID: ", loggedInUserId);
      setPatientId(loggedInUserId);
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-XSRF-TOKEN': csrfToken
        },
        withCredentials: true
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else {
          setReservations([]);
        }
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        setReservations([]);
      });
    }
  }, [patientId]);

  return (
    <div>
      <h2>예약 내역</h2>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <p>의사: {reservation.doctorName}</p>
              <p>부서: {reservation.deptName}</p>
              <p>날짜: {reservation.date}</p>
              <p>시간: {reservation.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationHistory;
