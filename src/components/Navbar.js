import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">EMR Service</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {role === 'DOCTOR' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/appointments/doctor">진료 확인</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/doctor/updatePassword">개인정보 수정</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/doctor/delete">회원 탈퇴</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">로그아웃</Link>
              </li>
            </>
          )}
          {role === 'MEMBER' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/member/book">진료 예약</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/appointments/my">진료 확인</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/member/delete">회원 탈퇴</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/member/updatePassword">개인정보 수정</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">로그아웃</Link>
              </li>
            </>
          )}
          {role === 'ADMIN' && (
            <li className="nav-item">
              <Link className="nav-link" to="/appointments/check">진료 확인</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
