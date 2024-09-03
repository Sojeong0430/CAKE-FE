import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/nav/Logo.png';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

const styles = {
  header: {
    width: '100%',
    height: '46.47px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    position: 'relative',
    height: '45px',
    top: '5px',
    left: '10px',
  },
  headerMenu: {
    margin: '0',
    padding: '0',
    width: '100%',
    right: '8px',
    textAlign: 'right',
    listStyleType: 'none',
  },
  menuItem: {
    display: 'inline',
    padding: '0px 6px',
    fontFamily: `'Courier New', Courier, monospace`,
  },
  link: {
    color: '#000000',
    fontSize: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { apiRequest } = useApi();

  const handleLogout = async () => {
    try {
      const response = await apiRequest('/accounts/api/logout/', {
        method: 'POST',
      });

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        const responseData = await response.json();
        console.error('로그아웃 실패:', responseData);
        alert(`로그아웃에 실패했습니다. 오류: ${JSON.stringify(responseData)}`);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      logout();
      navigate('/');
    }
  };

  return (
    <header style={styles.header}>
      <Link to="/" id="logo">
        <img src={Logo} alt="c@ke로고" style={styles.logo} />
      </Link>
      <ul style={styles.headerMenu}>
        <li style={styles.menuItem}>
          <Link to="/${user.username}/partyroom" style={styles.link}>
            마이룸
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/${user.username}/friendlist" style={styles.link}>
            친구목록
          </Link>
        </li>
        <li style={styles.menuItem}>
          {isLoggedIn ? (
            <span onClick={handleLogout} style={styles.link}>
              Logout
            </span>
          ) : (
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default NavBar;