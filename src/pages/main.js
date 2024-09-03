import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link를 추가로 import 했습니다.
import './Main.css';
import cakeLogo from '../assets/main/C@KE,.png';
import pinkCake from '../assets/main/PinkCake.png';
import confetti from '../assets/main/Confetti.png';
import { AuthContext } from '../contexts/AuthContext';

const Main = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/partyroom');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="main-container">
      <img src={cakeLogo} alt="C@KE Logo" className="logo" />
      <div className="content">
        <div className="text-content">
          <h1 className="main-title">
            우리가 함께 만들어가는 특별한 생일,
          </h1>
          <h2 className="sub-title">C@KE,</h2>
          <button onClick={handleStart} className="start-button">
            {isLoggedIn ? "파티룸 가기 ▶" : "시작하기 ▶"}
          </button>
        </div>
        <div className="image-container">
          <img src={confetti} alt="Confetti" className="confetti-image" />
          <img src={pinkCake} alt="Birthday Cake" className="cake-image" />
        </div>
      </div>
      
      <div className="process-section">
        <h2 className="process-title">C@KE</h2>
        <p className="process-subtitle">3단계로 끝나는 특별한 생일파티 🎂</p>
        <div className="steps-container">
          <div className="step">
            <h3>Step1.</h3>
          </div>
          <div className="step">
            <h3>Step2.</h3>
          </div>
          <div className="step">
            <h3>Step3.</h3>
          </div>
        </div>
      </div>
      
      {/* 회원탈퇴 링크 */}
      <div className="delete-account-section">
        <Link to="/deleteID" className="delete-account-link">회원탈퇴</Link>
      </div>
    </div>
  );
};

export default Main;
