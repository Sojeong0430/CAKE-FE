import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteImage from '../../assets/login/Group 1681.png';
import BackgroundImage from '../../assets/login/Rectangle 102.png';
import ButtonImage from '../../assets/login/Rectangle65.png';

const styles = {
  body: {
    background: '#E5E5E5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  container: {
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  section: {
    textAlign: 'center',
    paddingBottom: '50px',
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    paddingTop: '70px',
  },
  divStyle: {
    color: '#FF507A',
    fontSize: '25px',
  },
  span: {
    color: '#FF507A',
  },
  button: {
    backgroundImage: `url(${ButtonImage})`,
    border: 'none',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    fontSize: '15px',
    color: '#FFFFFF',
    padding: '17px 100px',
    cursor: 'pointer',
  },
  spacing: {
    marginTop: '10px',
  },
};

const Signed = () => {
  const navigate = useNavigate();

  const handleConfirmClick = () => {
    navigate('/');
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <section style={styles.section}>
          <div>
            <br />
            <br />
            <img src={CompleteImage} alt="회원가입 완료" />
            <div style={styles.divStyle}>회원가입 완료</div>
            <div style={styles.spacing}>
              지금 바로 <span style={styles.span}>C@KE</span>를 이용해 보실 수 있어요!
            </div>
            <br />
            <br />
            <br />
            <button style={styles.button} onClick={handleConfirmClick}>
              확인
            </button>
            <br />
            <br />
            <br />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signed;