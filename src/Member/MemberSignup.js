import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

const PatientRegistrationForm = () => {
    const [formData, setFormData] = useState({
        patientLoginId: '',
        patientPw: '',
        patientName: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        bloodType: ''
    });
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const apiServer = process.env.REACT_APP_API_SERVER;

        // CSRF 토큰을 서버에서 가져옵니다.
        axios.get(`${apiServer}/api/csrf-token`, { withCredentials: true })
            .then(response => setCsrfToken(response.data.token))
            .catch(error => console.error('Error fetching CSRF token:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const memberDto = {
            patientLoginId: formData.patientLoginId,
            patientPw: formData.patientPw,
            patientName: formData.patientName,
            gender: formData.gender,
            age: formData.age,
            weight: formData.weight,
            height: formData.height,
            bloodType: formData.bloodType
        };
        const registrationDto = {}; // 필요한 경우 추가 필드 설정

        const apiServer = process.env.REACT_APP_API_SERVER;
        axios.post(`${apiServer}/api/member/signup`, { memberDto, registrationDto }, {
            headers: {
                'X-XSRF-TOKEN': csrfToken
            },
            withCredentials: true
        })
            .then(response => {
                console.log('회원가입 성공:', response.data);
                alert('회원가입이 성공적으로 완료되었습니다.');
                navigate('/home/loginForm');
            })
            .catch(error => {
                console.error('회원가입 실패:', error);
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-dark text-white text-center">
                            <h3>환자 회원가입</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="patientLoginId">아이디</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="patientLoginId"
                                        name="patientLoginId"
                                        value={formData.patientLoginId}
                                        onChange={handleChange}
                                        placeholder="아이디 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="patientPw">비밀번호</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="patientPw"
                                        name="patientPw"
                                        value={formData.patientPw}
                                        onChange={handleChange}
                                        placeholder="비밀번호 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="patientName">이름</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="patientName"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        placeholder="이름 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">성별</label>
                                    <select
                                        id="gender"
                                        className="form-control"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="남">남</option>
                                        <option value="여">여</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">나이</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="나이 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight">체중</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="체중 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="height">신장</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="height"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        placeholder="신장 입력"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bloodType">혈액형</label>
                                    <select
                                        id="bloodType"
                                        className="form-control"
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="A">A형</option>
                                        <option value="B">B형</option>
                                        <option value="AB">AB형</option>
                                        <option value="O">O형</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">회원가입</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistrationForm;