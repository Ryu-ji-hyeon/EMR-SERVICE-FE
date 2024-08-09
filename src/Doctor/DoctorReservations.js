import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DoctorReservations = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [doctorId, setDoctorId] = useState(null);
    const [reservations, setReservations] = useState([]); // 예약된 환자 목록을 저장하는 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    useEffect(() => {
        const fetchCsrfTokenAndDoctorId = async () => {
            try {
                // CSRF 토큰 가져오기
                const csrfResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/csrf-token`, { withCredentials: true });
                setCsrfToken(csrfResponse.data.token);

                // JWT 토큰에서 의사 ID 추출
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const loggedInUserId = decodedToken?.sub;

                    // 의사 ID를 서버에서 가져오기
                    const doctorResponse = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/doctor/doctor-id`, {
                        params: { loginId: loggedInUserId },
                        withCredentials: true
                    });
                    setDoctorId(doctorResponse.data);

                    // 해당 의사에게 예약된 환자 목록을 가져오기
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
        // 처방전 입력 페이지로 이동
        navigate('/doctor/prescribe', { state: { reservationId } });
    };

    return (
        <div>
            <h2>예약된 환자 목록</h2>
            {reservations.length > 0 ? (
                <ul>
                    {reservations.map(reservation => {
                        // 예약된 날짜와 시간을 결합하여 Date 객체 생성
                        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);

                        if (!reservation.reservationId) {
                            console.error("Reservation ID is missing:", reservation);
                        }

                        return (
                            <li key={reservation.reservationId}>
                                <p>환자 이름: {reservation.patientName} - 예약 시간: {reservationDateTime.toLocaleDateString()} {reservationDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <button onClick={() => handlePrescriptionClick(reservation.reservationId)}>
                                    처방전 입력
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>예약된 환자가 없습니다.</p>
            )}
        </div>
    );
};

export default DoctorReservations;
