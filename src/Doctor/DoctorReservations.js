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

const PrescriptionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2260ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #1c3faa;
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
                        withCredentials: true
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
                        'X-XSRF-TOKEN': csrfToken
                    },
                    withCredentials: true
                });

                if (Array.isArray(response.data)) {
                    setReservations(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchCsrfTokenAndDoctorId();
    }, []);

    const handlePrescriptionClick = (reservationId) => {
        if (!reservationId) {
            console.error("Invalid reservation ID:", reservationId);
            return;
        }
        console.log("Navigating with Reservation ID:", reservationId);
        navigate('/doctor/prescribe', { state: { reservationId } });
    };

    return (
        <ScreenContainer>
            <Content>
                <Title>예약된 환자 목록</Title>
                {reservations.length > 0 ? (
                    <ReservationList>
                        {reservations.map(reservation => {
                            const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);

                            if (!reservation.reservationId) {
                                console.error("Reservation ID is missing:", reservation);
                            }

                            return (
                                <ReservationItem key={reservation.reservationId}>
                                    <ReservationDetail><strong>환자 이름:</strong> {reservation.patientName}</ReservationDetail>
                                    <ReservationDetail><strong>예약 시간:</strong> {reservationDateTime.toLocaleDateString()} {reservationDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ReservationDetail>
                                    <PrescriptionButton onClick={() => handlePrescriptionClick(reservation.reservationId)}>
                                        처방전 입력
                                    </PrescriptionButton>
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
