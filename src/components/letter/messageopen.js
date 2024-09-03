import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './messageopen.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

// 편지지 이미지 import
import letterStrawberryCut from '../../assets/letter/letter-strawberry-cut.png';
import letterBluberryCut from '../../assets/letter/letter-blueberry-cut.png';
import letterCheeseCut from '../../assets/letter/letter-cheese-cut.png';
import letterChocoCut from '../../assets/letter/letter-choco-cut.png';
import letterFruitsCut from '../../assets/letter/letter-fruits-cut.png';

//뒤로가기, 삭제 버튼 import
import BackIcon from '../../assets/letter/back.png';
import DeleteIcon from '../../assets/letter/delete.png';

const MessageOpen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { apiRequest } = useApi();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchMessages();
    }
  }, [isLoggedIn, navigate]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiRequest('/cakes/api/messagelist');
      setMessages(response);
    } catch (error) {
      console.error('메시지 목록을 가져오는 중 오류 발생:', error);
      setError(error.message || '메시지를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = async (messageId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiRequest(`/cakes/api/messageretrieve/${messageId}/`);
      setSelectedMessage(response);
    } catch (error) {
      console.error('메시지 상세 정보를 가져오는 중 오류 발생:', error);
      setError('메시지 상세 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiRequest(`http://127.0.0.1:8000/cakes/api/deletemessage/${messageId}/`, { method: 'DELETE' });
      setMessages(messages.filter(message => message.pk !== messageId));
      setSelectedMessage(null);
    } catch (error) {
      console.error('메시지 삭제 중 오류 발생:', error);
      alert('메시지 삭제에 실패했습니다.');
    }
  };

  const onDeleteClick = () => {
    if (selectedMessage) {
      handleDeleteMessage(selectedMessage.pk);
    }
  };


  const getBackgroundImage = (background) => {
    switch(background) {
      case 1: return `url(${letterStrawberryCut})`;
      case 2: return `url(${letterBluberryCut})`;
      case 3: return `url(${letterCheeseCut})`;
      case 4: return `url(${letterChocoCut})`;
      case 5: return `url(${letterFruitsCut})`;
      default: return `url(${letterStrawberryCut})`;
    }
  };

  const getFontFamily = (font) => {
    switch(font) {
      case 1: return 'Noto Sans KR, sans-serif';
      case 2: return 'Nanum Myeongjo, serif';
      case 3: return 'Gaegu, cursive';
      default: return 'Noto Sans KR, sans-serif';
    }
  };

  const getTextAlign = (align) => {
    switch(align) {
      case 1: return 'left';
      case 2: return 'center';
      case 3: return 'right';
      default: return 'left';
    }
  };

  if (isLoading) {
    return <div className="messageopen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="messageopen">
        <p>{error}</p>
        <button onClick={fetchMessages}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="messageopen">
      <div className="container">
        {!selectedMessage ? (
          <div className="message-grid">
            {messages.map((message) => (
              <div
                key={message.pk}
                className="message-preview"
                onClick={() => handleMessageClick(message.pk)}
                style={{
                  backgroundImage: getBackgroundImage(message.background),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  fontFamily: getFontFamily(message.font),
                  textAlign: getTextAlign(message.matrix)
                }}
              >
                <p className="message-sender">{message.sent_by}</p>
                <p className="message-content">{message.message_content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="message-detail">
            <div className="message-card"
              style={{
                backgroundImage: getBackgroundImage(selectedMessage.background),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: getFontFamily(selectedMessage.font),
                textAlign: getTextAlign(selectedMessage.matrix),
                position: 'relative'
              }}
            >
              <div className="back-button" onClick={() => setSelectedMessage(null)}>
                <img src={BackIcon} alt="뒤로가기" /> 돌아가기
              </div>
              <div className="sender-name">from.{selectedMessage.sent_by}</div>
              <p className="message-content">{selectedMessage.message_content}</p>
              <div className="delete-button" onClick={onDeleteClick}>
                <img src={DeleteIcon} alt="삭제하기" /> 삭제하기
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default MessageOpen;