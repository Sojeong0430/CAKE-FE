import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

const WithdrawalPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const { apiRequest } = useApi();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiRequest('/accounts/api/userdelete/', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      if (response.message === "탈퇴 완료") {
        logout();
        navigate('/');
        // 필요하다면 여기에 성공 메시지를 추가할 수 있습니다.
      } else {
        setError('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원탈퇴 중 오류 발생:', error);
      setError('비밀번호가 올바르지 않거나 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      color: '#000000',
    },
    h1: {
      color: '#FF507A',
      marginBottom: '20px',
    },
    container: {
      backgroundColor: '#FFF0F5',
      borderRadius: '20px',
      padding: '20px',
      width: '300px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    warning: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '10px',
      marginBottom: '10px',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    warningError: {
      color: '#FF507A',
    },
    highlight: {
      color: '#FF507A',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #FF507A',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    button: {
      width: '80%',
      padding: '12px',
      backgroundColor: '#FF507A',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'block',
      margin: '0 auto',
      boxShadow: '0 2px 4px rgba(255, 80, 122, 0.3)',
    },
    error: {
      color: '#FF507A',
      textAlign: 'center',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>회원탈퇴</h1>
      <div style={styles.container}>
        <p style={{ textAlign: 'center' }}>
          <span style={styles.highlight}>잠깐!</span><br />
          <span style={styles.highlight}>C@KE</span>를 탈퇴하기 전에,<br />
          확인해주세요
        </p>
        <div style={{ ...styles.warning, ...styles.warningError }}>
          회원탈퇴시 계정을 <span style={styles.highlight}>되돌릴 수 없어요.</span> ✘
        </div>
        <div style={styles.warning}>
          내가 받은 <span style={styles.highlight}>축하 메시지들이 모두 삭제</span>되어요. 🎂
        </div>
        <div style={styles.warning}>
          탈퇴 회원의 정보는 <span style={styles.highlight}>모두 삭제</span>되어<br />
          <span style={styles.highlight}>처음부터 다시 가입</span>해야해요. 🥺
        </div>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          style={styles.input}
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '처리 중...' : '계정삭제'}
        </button>
      </div>
    </div>
  );
};

export default WithdrawalPage;