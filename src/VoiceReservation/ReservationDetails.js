import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ReservationDetails = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const location = useLocation();
    const { reservationId } = location.state || {};

    // CSRF 토큰을 가져오는 함수
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

    // 처방전을 가져오는 함수
    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!reservationId) {
                console.error('Reservation ID is missing');
                return;
            }
            if (!csrfToken) {
                console.error('CSRF token is missing');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/reservation/${reservationId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'X-XSRF-TOKEN': csrfToken,
                    },
                    withCredentials: true
                });

                if (response.data && response.data.length > 0) {
                    setPrescriptions(response.data);
                } else {
                    setPrescriptions([]);
                    console.warn('No prescriptions found');
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };

        // CSRF 토큰이 설정된 후에만 처방전을 가져오도록 변경
        if (csrfToken) {
            fetchPrescriptions();
        }
    }, [reservationId, csrfToken]);

    return (
        <div>
            <h2>처방전 목록</h2>
            {prescriptions.length > 0 ? (
                <ul>
                    {prescriptions.map((prescription) => (
                        <li key={prescription.prescriptionId}>
                            <p>약물: {prescription.medication}</p>
                            <p>용량: {prescription.dosage}</p>
                            <p>지침: {prescription.instructions}</p>
                            <p>날짜: {new Date(prescription.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>처방전이 없습니다.</p>
            )}
        </div>
    );
};

export default ReservationDetails;
