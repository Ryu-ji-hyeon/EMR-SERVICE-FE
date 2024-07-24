import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupForm = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userType === "의사") {
      navigate('/doctor/signup');
    } else {
      navigate('/member/signup');
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center">회원가입</h1>
        <hr />
        <form onSubmit={handleSubmit} className="text-center">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="doctorRadio"
              name="userType"
              value="의사"
              checked={userType === '의사'}
              onChange={handleUserTypeChange}
            />
            <label className="form-check-label" htmlFor="doctorRadio">의사</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="patientRadio"
              name="userType"
              value="환자"
              checked={userType === '환자'}
              onChange={handleUserTypeChange}
            />
            <label className="form-check-label" htmlFor="patientRadio">환자</label>
          </div>
          <button type="submit" className="btn btn-primary mt-3">다음</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;