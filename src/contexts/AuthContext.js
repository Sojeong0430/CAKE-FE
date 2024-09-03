import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  getAccessToken: () => {},  // 이 부분이 있는지 확인
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const hasAccessToken = document.cookie.split(';').some((item) => item.trim().startsWith('access='));
      console.log('Has access token:', hasAccessToken);
      setIsLoggedIn(hasAccessToken);

      if (hasAccessToken && !user) {
        // 사용자 정보를 로컬 스토리지에서 가져오거나 API를 통해 fetch
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    checkAuth();
  }, [user]);

  const login = useCallback((userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // 클라이언트 측에서 쿠키 설정 (서버에서 설정하지 않는 경우)
    document.cookie = `access=${token.access}; path=/; max-age=3600; SameSite=Strict`;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    document.cookie = 'access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/api/auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함시킵니다.
      });

      if (response.ok) {
        // 새 액세스 토큰은 서버에서 쿠키로 설정되므로 여기서는 별도의 처리가 필요 없습니다.
        return true;
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류 발생:', error);
      logout();
      return false;
    }
  }, [logout]);

  const getAccessToken = useCallback(async () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access') {
        return value;
      }
    }
    // 액세스 토큰이 없으면 리프레시를 시도합니다.
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // 리프레시 후 다시 액세스 토큰을 찾습니다.
      for (let cookie of document.cookie.split(';')) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access') {
          return value;
        }
      }
    }
    return null;
  }, [refreshAccessToken]);


  

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};