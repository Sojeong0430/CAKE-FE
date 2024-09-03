import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


export const useApi = () => {
  const { getAccessToken, logout } = useContext(AuthContext);

  const apiRequest = async (url, options = {}) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        const newToken = await getAccessToken();
        if (!newToken) {
          logout();
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }

        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });

        if (retryResponse.status === 401) {
          logout();
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }

        return retryResponse.json();
      }

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      return response.json();
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      throw error;
    }
  };

  return { apiRequest };
};

// api 객체 제거