import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CreatePrescription = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [medication, setMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');

    const location = useLocation();
    const { reservationId } = location.state || {};

    const [reservation, setReservation] = useState(null);

    // CSRF 토큰 가져오기
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

    // 예약 정보 가져오기
    useEffect(() => {
        console.log("Reservation ID:", reservationId);  // 추가된 디버그 로그
        if (reservationId) {
            const fetchReservation = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/reservations/${reservationId}`, {
                        headers: {
                            'X-XSRF-TOKEN': csrfToken,
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        withCredentials: true
                    });

                    if (response.data) {
                        setReservation(response.data);
                    } else {
                        console.error('No reservation data received');
                    }
                } catch (error) {
                    console.error('Error fetching reservation:', error);
                }
            };

            fetchReservation();
        }
    }, [reservationId, csrfToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day}T${hours-3}:${minutes}:${seconds}`;



        try {
            await axios.post(
                `${process.env.REACT_APP_API_SERVER}/api/prescriptions/create/${reservationId}`,
                null,  
                {
                    headers: {
                        'X-XSRF-TOKEN': csrfToken,
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    params: {
                        medication: medication,
                        dosage: dosage,
                        instructions: instructions,
                        date: formattedDate
                    },
                    withCredentials: true
                }
            );
            alert('처방전이 성공적으로 생성되었습니다.');
        } catch (error) {
            console.error('처방전 생성 중 오류가 발생했습니다.', error);
            alert('처방전 생성에 실패했습니다.');
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>처방전 작성</h2>
            <div>
                <label>약물</label>
                <input type="text" value={medication} onChange={(e) => setMedication(e.target.value)} required />
            </div>
            <div>
                <label>용량</label>
                <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
            </div>
            <div>
                <label>지침</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
            </div>
            <button type="submit">처방전 작성</button>
        </form>
    );
};

export default CreatePrescription;
