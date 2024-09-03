import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../../services/authService';
import CameraImage from '../../assets/login/camera.png';
import ButtonImage from '../../assets/login/button.png';
import { AuthContext } from '../../contexts/AuthContext';

const styles = {
  body: {
    background: '#E5E5E5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  container: {
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  section: {
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  title: {
    fontSize: '14px',
    marginTop: '20px',
  },
  titleSpan: {
    color: '#FF507A',
  },
  form: {
    fontSize: '12px',
    color: '#A3A3A3',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '8px',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #A3A3A3',
    color: '#A3A3A3',
  },
  button: {
    background: `url(${ButtonImage}) no-repeat center center`,
    backgroundSize: 'cover',
    border: 'none',
    color: '#FFFFFF',
    width: '202px',
    height: '43px',
    textAlign: 'center',
    margin: '20px auto 0',
    display: 'block',
    cursor: 'pointer',
  },
  cameraImage: {
    height: '100px',
    width: 'auto',
  },
  errorText: {
    color: 'red',
    fontSize: '10px',
    textAlign: 'left',
    paddingTop: '1%',
    paddingLeft: '3%',
  },
  signupLink: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#A3A3A3',
  },
  link: {
    color: '#FF507A',
    textDecoration: 'none',
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response = await apiLogin(formData.username, formData.password);
      console.log('로그인 성공:', response);
      login(response.user, response.token); // token도 함께 전달
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <section style={styles.section}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img src={CameraImage} alt="카메라" style={styles.cameraImage} />
            <br />
            <b style={styles.title}>
              <span style={styles.titleSpan}>C@KE</span> 로그인
            </b>
          </div>
          <br />
          <br />
          <form className="form" style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <div style={styles.label}>아이디</div>
              <input
                type="text"
                name="username"
                style={styles.input}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <div style={styles.label}>비밀번호</div>
              <input
                type="password"
                name="password"
                style={styles.input}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {error && <div style={styles.errorText}>{error}</div>}
            <button
              type="submit"
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
          <div style={styles.signupLink}>
            처음 오셨나요? <Link to="/agrees" style={styles.link}>회원가입</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;