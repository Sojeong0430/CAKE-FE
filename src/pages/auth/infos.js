import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CameraImage from '../../assets/login/camera.png';
import ButtonImage from '../../assets/login/button.png';
import { signup } from '../../services/authService';

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
  },
  cameraImage: {
    height: '100px',
  },
  errorText: {
    color: 'red',
    fontSize: '10px',
    textAlign: 'left',
    paddingTop: '1%',
    paddingLeft: '3%',
  },
};

const Infos = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    birthday: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
      form: '',
    }));
  };

  const handleDateChange = (date) => {
    setDate(date);
    setFormData((prevFormData) => ({
      ...prevFormData,
      birthday: date.toISOString().split('T')[0],
    }));
    setIsCalendarOpen(false);
    setErrors((prevErrors) => ({
      ...prevErrors,
      birthday: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = '아이디를 입력해 주세요';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해 주세요';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = '이메일을 입력해 주세요';
      isValid = false;
    }
    if (!formData.birthday) {
      newErrors.birthday = '생년월일을 선택해 주세요';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        birthday: formData.birthday
      };

      try {
        const response = await signup(dataToSend);
        console.log('회원가입 성공:', response);
        alert('회원가입이 성공적으로 완료되었습니다.');
        navigate('/'); // 메인 페이지로 리다이렉트
      } catch (error) {
        console.error('회원가입 실패:', error);
        if (error.message.includes('username')) {
          setErrors(prevErrors => ({ ...prevErrors, username: '이미 사용 중인 아이디입니다.' }));
        } else if (error.message.includes('email')) {
          setErrors(prevErrors => ({ ...prevErrors, email: '이미 사용 중인 이메일입니다.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, form: '회원가입에 실패했습니다. 입력 정보를 확인해 주세요.' }));
        }
        
      }
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <section style={styles.section}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img className="cake" src={CameraImage} alt="카메라" style={styles.cameraImage} />
            <br />
            <b style={styles.title}>
              <span style={styles.titleSpan}>C@KE</span> 계정 만들기
            </b>
          </div>
          <br />
          <br />
          <form className="form" style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <div style={styles.label}>아이디</div>
              <input type="text" name="username" style={styles.input} value={formData.username} onChange={handleChange} />
              {errors.username && <div style={styles.errorText}>{errors.username}</div>}
            </div>
            <div style={styles.formGroup}>
              <div style={styles.label}>비밀번호</div>
              <input type="password" name="password" style={styles.input} value={formData.password} onChange={handleChange} />
              {errors.password && <div style={styles.errorText}>{errors.password}</div>}
            </div>
            <div style={styles.formGroup}>
              <div style={styles.label}>비밀번호 확인</div>
              <input type="password" name="confirmPassword" style={styles.input} value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
            </div>
            <div style={styles.formGroup}>
              <div style={styles.label}>이메일</div>
              <input type="email" name="email" style={styles.input} value={formData.email} onChange={handleChange} />
              {errors.email && <div style={styles.errorText}>{errors.email}</div>}
            </div>
            <div style={styles.formGroup}>
              <div style={styles.label}>생년월일</div>
              <input type="text" name="birthday" style={styles.input} value={formData.birthday} onClick={() => setIsCalendarOpen(!isCalendarOpen)} readOnly />
              {errors.birthday && <div style={styles.errorText}>{errors.birthday}</div>}
              {isCalendarOpen && <Calendar onChange={handleDateChange} value={date} />}
            </div>
            {errors.form && <div style={styles.errorText}>{errors.form}</div>}
            <input id="join" className="button" type="submit" value="join" style={styles.button} />
          </form>
        </section>
      </div>
    </div>
  );
};

export default Infos;