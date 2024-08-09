import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPrescriptions = ({ patientId }) => {
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/prescriptions/patient/${patientId}`);
                setPrescriptions(response.data);
            } catch (error) {
                console.error('처방전 조회 중 오류가 발생했습니다.', error);
            }
        };

        fetchPrescriptions();
    }, [patientId]);

    return (
        <div>
            <h2>처방전 목록</h2>
            {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                    <div key={prescription.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <p><strong>약물:</strong> {prescription.medication}</p>
                        <p><strong>용량:</strong> {prescription.dosage}</p>
                        <p><strong>지침:</strong> {prescription.instructions}</p>
                        <p><strong>날짜:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>처방전이 없습니다.</p>
            )}
        </div>
    );
};

export default ViewPrescriptions;
