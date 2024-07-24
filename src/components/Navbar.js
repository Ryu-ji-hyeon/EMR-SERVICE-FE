import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user } = useAuth(); // AuthContext에서 사용자 정보 가져오기

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">EMR Service</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {user && ( // 사용자가 로그인된 경우에만 버튼을 표시
            <li className="nav-item">
              <Link className="nav-link" to="/Voice/VoiceReservationSystem">예약하기</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;