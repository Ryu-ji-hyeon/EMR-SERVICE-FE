import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    doctorLoginId: '',
    doctorPw: '',
    doctorName: '',
    deptId: ''
  });
  const [depts, setDepts] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const apiServer = process.env.REACT_APP_API_SERVER;

    // 부서 목록을 서버에서 가져옵니다.
    axios.get(`${apiServer}/api/doctor/departments`, { withCredentials: true })
      .then(response => setDepts(response.data))
      .catch(error => console.error('Error fetching departments:', error));

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
    const apiServer = process.env.REACT_APP_API_SERVER;
    e.preventDefault();
    axios.post(`${apiServer}/api/doctor/signup`, formData, {
      headers: {
        'X-XSRF-TOKEN': csrfToken
      },
      withCredentials: true
    })
      .then(response => {
        console.log('Signup successful:', response.data);
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/home/loginForm');
      })
      .catch(error => {
        console.error('Error during signup:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-dark text-white text-center">
                <h3>의사 회원가입</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="doctorLoginId">아이디</label>
                    <input
                      type="text"
                      className="form-control"
                      id="doctorLoginId"
                      name="doctorLoginId"
                      value={formData.doctorLoginId}
                      onChange={handleChange}
                      placeholder="아이디 입력"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="doctorPw">비밀번호</label>
                    <input
                      type="password"
                      className="form-control"
                      id="doctorPw"
                      name="doctorPw"
                      value={formData.doctorPw}
                      onChange={handleChange}
                      placeholder="비밀번호 입력"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="doctorName">의사 이름</label>
                    <input
                      type="text"
                      className="form-control"
                      id="doctorName"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleChange}
                      placeholder="의사 이름 입력"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dept">부서</label>
                    <select
                      id="dept"
                      className="form-control"
                      name="deptId"
                      value={formData.deptId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">선택하세요</option>
                      {depts.map(dept => (
                        <option key={dept.deptId} value={dept.deptId}>
                          {dept.deptName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">회원가입</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
