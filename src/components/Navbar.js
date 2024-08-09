import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 로직 (예: 토큰 삭제)
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/'); // 홈 화면으로 리디렉션
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">EMR Service</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {user ? (
            <>
              {user.role === 'MEMBER' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reservation-choice">예약하기</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/member/reservations">예약 확인</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/member/prescriptions">처방전 확인</Link>
                  </li>
                </>
              )}
              {user.role === 'DOCTOR' && (
                <>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/reservations">예약 확인</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/prescribe">처방전 입력</Link>
                </li>
                </>
              )}
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>로그아웃</button>
              </li>
              
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/home/loginForm">로그인</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/home/choiceMember">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
