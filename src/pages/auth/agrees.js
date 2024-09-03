import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonImage from '../../assets/login/button.png';

const styles = {
  container: {
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    margin: 'auto',
    justifyContent: 'flex-start',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  titulo: {
    fontSize: '19px',
    textAlign: 'left',
    color: '#000000',
    letterSpacing: '-0.5px',
  },
  pinkText: {
    color: '#ff507a',
  },
  cakeImage: {
    height: '64px',
    width: '64px',
    marginLeft: '16px',
  },
  agreementText: {
    fontSize: '12px',
    lineHeight: '1.6',
    border: '2px solid #ff507a',
    borderRadius: '12px',
    padding: '8px',
    marginBottom: '16px',
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
  leftAlignText: {
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  button: {
    background: `url(${ButtonImage}) no-repeat center center`,
    backgroundSize: 'cover',
    border: 'none',
    color: '#FFFFFF',
    width: '202px',
    height: '43px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.3s',
  },
  buttonActive: {
    opacity: 1,
  },
};

const Agrees = () => {
  const navigate = useNavigate();
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  const handleButtonClick = () => {
    if (agree1 && agree2) {
      navigate('/infos');
    }
  };

  const allAgreed = agree1 && agree2;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titulo}>
          <span style={styles.pinkText}>C@KE</span> 에 오신 걸<br />
          환영합니다!
        </div>
        <img
          className="cake"
          src={require('../../assets/login/Vector.png')}
          alt="케이크 이미지"
          style={styles.cakeImage}
        />
      </div>
      <div style={styles.leftAlignText}>1. C@KE 이용약관</div>
      <p style={styles.agreementText}>
        가. 홈페이지 회원가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지·통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
      </p>
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agree1"
          checked={agree1}
          onChange={(e) => setAgree1(e.target.checked)}
        />
        <label htmlFor="agree1" style={{marginLeft: '8px'}}>동의합니다</label>
      </div>
      
      <div style={styles.leftAlignText}>2. 개인정보처리방침</div>
      <p style={styles.agreementText}>
        가. 홈페이지 회원가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지·통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
      </p>
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agree2"
          checked={agree2}
          onChange={(e) => setAgree2(e.target.checked)}
        />
        <label htmlFor="agree2" style={{marginLeft: '8px'}}>동의합니다</label>
      </div>
      
      <div style={styles.buttonContainer}>
        <div 
          style={{...styles.button, ...(allAgreed ? styles.buttonActive : {})}}
          onClick={handleButtonClick}
        >
          다음
        </div>
      </div>
    </div>
  );
};

export default Agrees;