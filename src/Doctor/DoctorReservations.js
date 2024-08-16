import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ $isCompleted }) => ($isCompleted ? '#28a745' : '#2260ff')};
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isCompleted }) => ($isCompleted ? '#218838' : '#1c3faa')};
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    background-color: #e0a800;
  }
`;

const NoReservationsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
`;

const DoctorReservations = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfTokenAndDoctorId = async () => {
      try {
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(csrfResponse.data.token);

        const token = localStorage.getItem('accessToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const loggedInUserId = decodedToken?.sub;

          const doctorResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/doctor-id`, {
            params: { loginId: loggedInUserId },
            withCredentials: true,
          });
          setDoctorId(doctorResponse.data);

          fetchReservations(doctorResponse.data, csrfResponse.data.token);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchReservations = async (doctorId, csrfToken) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/doctor/${doctorId}`, {
          headers: {
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          const reservationsWithStatus = await Promise.all(
            response.data.map(async (reservation) => {
              const prescriptionStatus = await fetchPrescriptionStatus(reservation.reservationId);
              return { ...reservation, isPrescribed: prescriptionStatus };
            })
          );
          setReservations(reservationsWithStatus);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    const fetchPrescriptionStatus = async (reservationId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/status/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        });
        return response.data; // true if prescribed, false otherwise
      } catch (error) {
        console.error('Error checking prescription status:', error);
        return false;
      }
    };

    fetchCsrfTokenAndDoctorId();
  }, []);

  const handlePrescriptionClick = (reservationId, isPrescribed) => {
    if (!reservationId) {
      console.error('Invalid reservation ID:', reservationId);
      return;
    }
    console.log('Navigating with Reservation ID:', reservationId);
    if (!isPrescribed) {
      navigate('/doctor/prescribe', { state: { reservationId } });
    }
    else{
      navigate('/reservation/details', { state: { reservationId } });
    }
  };

  const handleEditClick = (reservationId) => {
    navigate('/doctor/edit-prescription', { state: { reservationId } });
  };

  return (
    <ScreenContainer>
      <Content>
        <Title>예약된 환자 목록</Title>
        {reservations.length > 0 ? (
          <ReservationList>
            {reservations.map((reservation) => {
              const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);

              if (!reservation.reservationId) {
                console.error('Reservation ID is missing:', reservation);
              }

              return (
                <ReservationItem key={reservation.reservationId}>
                  <div>
                    <ReservationDetail>
                      <strong>환자 이름:</strong> {reservation.patientName}
                    </ReservationDetail>
                    <ReservationDetail>
                      <strong>예약 시간:</strong> {reservationDateTime.toLocaleDateString()}{' '}
                      {reservationDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </ReservationDetail>
                  </div>
                  <div>
                    <ActionButton
                      $isCompleted={reservation.isPrescribed}
                      onClick={() => handlePrescriptionClick(reservation.reservationId, reservation.isPrescribed)}
                    >
                      {reservation.isPrescribed ? '처방 완료' : '처방전 입력'}
                    </ActionButton>
                    {reservation.isPrescribed && (
                      <EditButton onClick={() => handleEditClick(reservation.reservationId)}>수정</EditButton>
                    )}
                  </div>
                </ReservationItem>
              );
            })}
          </ReservationList>
        ) : (
          <NoReservationsMessage>예약된 환자가 없습니다.</NoReservationsMessage>
        )}
      </Content>
    </ScreenContainer>
  );
};

export default DoctorReservations;
