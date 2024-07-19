import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">EMR Service</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {!isAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/home/loginForm">로그인</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/home/choiceMember">회원가입</Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={logout}>로그아웃</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
