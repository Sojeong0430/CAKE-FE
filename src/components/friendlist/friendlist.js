import React, { useState, useEffect, useContext } from 'react';
import { useApi } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

// 친구 ID 입력 컴포넌트
const FriendIdInput = ({ onAddFriend }) => {
  const [friendId, setFriendId] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFriendId(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    if (friendId.trim()) {
      try {
        await onAddFriend(friendId);
        setFriendId('');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '400px',
      marginBottom: '24px'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
        <input
          type="text"
          value={friendId}
          onChange={handleInputChange}
          placeholder="추가하고싶은 친구의 ID"
          style={{
            width: '100%',
            padding: '8px 40px 8px 16px',
            fontSize: '14px',
            color: '#333',
            backgroundColor: 'white',
            border: '1px solid #ff9999',
            borderRadius: '20px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            backgroundColor: '#ff4081',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          +
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </div>
  );
};

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { apiRequest } = useApi();
  const { isLoggedIn } = useContext(AuthContext);


  useEffect(() => {
    if (isLoggedIn) {
      fetchFriends();
    }
  }, [isLoggedIn]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('http://127.0.0.1:8000/contacts/api/friends-list/');
      setFriends(data);
      setLoading(false);
    } catch (error) {
      console.error('친구 목록을 가져오는 중 오류 발생:', error);
      setError('친구 목록을 불러오는데 실패했습니다. 상세 오류: ' + error.message);
      setLoading(false);
    }
  };

  const addFriend = async (username) => {
    try {
      const response = await apiRequest('http://127.0.0.1:8000/contacts/api/add-friend/', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      
      // 응답 내용 로깅
      console.log('친구 추가 API 응답:', response);

      if (response.success) {
        await fetchFriends(); // 친구 목록 새로고침
        return response.success;
      } else {
        throw new Error(response.error || '친구 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('친구 추가 중 오류 발생:', error);
      throw new Error(error.message || '친구 추가에 실패했습니다. 서버 응답을 확인해주세요.');
    }
  };

  const calculateDaysLeft = (birthday) => {
    const today = new Date();
    const nextBirthday = new Date(birthday);
    nextBirthday.setFullYear(today.getFullYear());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const timeDiff = nextBirthday.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const containerStyle = {
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    marginRight: '15px',
  };

  const nameStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const infoStyle = {
    textAlign: 'right',
  };

  const dDayStyle = {
    color: '#ff4081',
    fontWeight: 'bold',
    fontSize: '18px',
  };

  const birthdayStyle = {
    color: '#757575',
    fontSize: '14px',
  };

  const buttonStyle = {
    backgroundColor: '#ffd54f',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 15px',
    marginTop: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',  // 링크 밑줄 제거
    color: '#333',  // 링크 색상 변경
    display: 'inline-block', 
  };

  if (loading) {
    return <div>친구 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <FriendIdInput onAddFriend={addFriend} />
      {friends.map((friend) => {
        const daysLeft = calculateDaysLeft(friend.birthday);
        return (
          <div key={friend.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={avatarStyle}></div>
              <span style={nameStyle}>{friend.username}</span>
            </div>
            <div style={infoStyle}>
              <div style={dDayStyle}>D-{daysLeft}</div>
              <div style={birthdayStyle}>{friend.birthday}</div>
              <a href={friend.party_room_address} style={buttonStyle}>파티룸 방문하기</a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;