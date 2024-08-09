import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReservationHistory.css';

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
            const patientLoginId = decodedToken?.sub; // JWT에서 patientLoginId 추출
            console.log("patientLoginId: ", patientLoginId);

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
    }, [patientId, csrfToken]);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">예약 내역</h2>
            <div className="reservation-list">
                {reservations.length === 0 ? (
                    <p className="text-center">예약 내역이 없습니다.</p>
                ) : (
                    <ul className="list-group">
                        {reservations.map((reservation) => (
                            <li key={reservation.id} className="list-group-item mb-3">
                                <p><strong>의사:</strong> {reservation.doctorName}</p>
                                <p><strong>부서:</strong> {reservation.deptName}</p>
                                <p><strong>날짜:</strong> {reservation.date}</p>
                                <p><strong>시간:</strong> {reservation.time}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ReservationHistory;
