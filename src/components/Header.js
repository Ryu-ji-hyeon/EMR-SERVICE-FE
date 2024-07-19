import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <Link className="navbar-brand" to="/">
      EMR Service
    </Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/home/loginForm">로그인</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/home/choiceMember">회원가입</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/home/logout">로그아웃</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Header;
