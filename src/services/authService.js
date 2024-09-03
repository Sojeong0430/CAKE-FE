const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchData(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    console.log('Sending request to:', url);
    console.log('Request options:', options);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',

    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('Response text:', text);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Invalid JSON in response');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.message === 'Failed to fetch') {
      console.error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
    }
    throw error;
  }
}

export async function signup(userData) {
  try {
    console.log('Signup data:', userData);
    const data = await fetchData('/accounts/api/signup/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    console.log('Signup response:', data);
    return data;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
}

export async function login(username, password) {
  try {
    console.log('Login attempt for username:', username);
    const data = await fetchData('/accounts/api/auth/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    console.log('Login response:', data);
    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
}

export async function logout() {
  try {
    console.log('Logout attempt');
    await fetchData('/accounts/api/logout/', {
      method: 'DELETE',
    });
    console.log('Logout successful');
  } catch (error) {
    console.error('로그아웃 에러:', error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    console.log('Token refresh attempt');
    const data = await fetchData('/accounts/api/auth/refresh/', {
      method: 'POST',
    });
    console.log('Token refresh response:', data);
    return data.access;
  } catch (error) {
    console.error('토큰 갱신 에러:', error);
    throw error;
  }
}

export async function isAuthenticated() {
  try {
    console.log('Authentication check');
    const response = await fetchData('/accounts/api/retrieveuser/');
    console.log('Authentication check response:', response);
    return true;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
}

export async function testConnection() {
  try {
    await fetch(API_BASE_URL);
    console.log('서버 연결 성공');
    return true;
  } catch (error) {
    console.error('서버 연결 실패:', error);
    return false;
  }
}