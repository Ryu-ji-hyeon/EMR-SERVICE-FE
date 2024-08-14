import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 useNavigate 훅 사용
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const ReservationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReservationItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ReservationDetail = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #555;

  strong {
    font-weight: bold;
    color: #333;
  }
`;

const ViewButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1c3faa;
  }
`;

const NoReservationsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
`;

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

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
      const patientLoginId = decodedToken?.sub; // JWT에서 patientLoginId 추출

      // patientLoginId를 사용하여 patientId를 가져오는 API 호출
      axios.get(`${process.env.REACT_APP_API_SERVER}/api/member/patient-id`, {
        params: { loginId: patientLoginId },
        withCredentials: true
      })
      .then(response => {
        setPatientId(response.data); // patientId 설정
      })
      .catch(error => {
        console.error('Error fetching patient ID:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (patientId && csrfToken) {
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
  }, [patientId, csrfToken]);

  const handleViewDetails = (reservationId) => {
    navigate('/reservation/details', { state: { reservationId } });
  };

  return (
    <ScreenContainer>
      <Content>
        <h2 className="text-center mb-4">예약 내역</h2>
        <ReservationList>
          {reservations.length === 0 ? (
            <NoReservationsMessage>예약 내역이 없습니다.</NoReservationsMessage>
          ) : (
            reservations.map((reservation) => (
              <ReservationItem key={reservation.reservationId}>
                <ReservationDetail><strong>의사:</strong> {reservation.doctorName}</ReservationDetail>
                <ReservationDetail><strong>부서:</strong> {reservation.deptName}</ReservationDetail>
                <ReservationDetail><strong>날짜:</strong> {reservation.date}</ReservationDetail>
                <ReservationDetail><strong>시간:</strong> {reservation.time}</ReservationDetail>
                <ViewButton onClick={() => handleViewDetails(reservation.reservationId)}>
                  자세히 보기
                </ViewButton>
              </ReservationItem>
            ))
          )}
        </ReservationList>
      </Content>
    </ScreenContainer>
  );
};

export default ReservationHistory;
