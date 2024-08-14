import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ScreenContainer from '../components/ScreenContainer';
import Content from '../components/Content';

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PrescriptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PrescriptionItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PrescriptionDetail = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #555;

  strong {
    font-weight: bold;
    color: #333;
  }
`;

const NoPrescriptionsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
`;

const ReservationDetails = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const location = useLocation();
    const { reservationId } = location.state || {};

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

        if (csrfToken) {
            fetchPrescriptions();
        }
    }, [reservationId, csrfToken]);

    return (
        <ScreenContainer>
            <Content>
                <Title>처방전 목록</Title>
                {prescriptions.length > 0 ? (
                    <PrescriptionList>
                        {prescriptions.map((prescription) => (
                            <PrescriptionItem key={prescription.prescriptionId}>
                                <PrescriptionDetail><strong>약물:</strong> {prescription.medication}</PrescriptionDetail>
                                <PrescriptionDetail><strong>용량:</strong> {prescription.dosage}</PrescriptionDetail>
                                <PrescriptionDetail><strong>지침:</strong> {prescription.instructions}</PrescriptionDetail>
                                <PrescriptionDetail><strong>날짜:</strong> {new Date(prescription.date).toLocaleString()}</PrescriptionDetail>
                            </PrescriptionItem>
                        ))}
                    </PrescriptionList>
                ) : (
                    <NoPrescriptionsMessage>처방전이 없습니다.</NoPrescriptionsMessage>
                )}
            </Content>
        </ScreenContainer>
    );
};

export default ReservationDetails;
