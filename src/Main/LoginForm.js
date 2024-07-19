import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // 로그인 처리 로직 추가
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white text-center">
              <h3>로그인</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">아이디</label>
                  <input type="text" className="form-control" id="username" name="username" placeholder="아이디" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="password" className="form-control" id="password" name="password" placeholder="비밀번호" required />
                </div>
                <button type="submit" className="btn btn-dark btn-block">로그인</button>
              </form>
            </div>
            <div className="card-footer text-center">
              <Link to="/home/choiceMember" className="btn btn-outline-info">회원가입</Link>
              <div className="mt-3">
                <a href="/api/v1/auth/oauth2/google" className="btn btn-outline-dark mx-1">Google</a>
                <a href="/api/v1/auth/oauth2/naver" className="btn btn-outline-dark mx-1">Naver</a>
                <a href="/api/v1/auth/oauth2/kakao" className="btn btn-outline-dark mx-1">Kakao</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
