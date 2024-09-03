import React, { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../services/api';

// 이미지 import
import letterStrawberryCut from '../../assets/letter/letter-strawberry-cut.png';
import iconTextImage from '../../assets/letter/icon-text.png';
import iconAlignImage from '../../assets/letter/icon-align.png';
import iconCustomImage from '../../assets/letter/icon-custom.png';
import iconStrawberryImage from '../../assets/letter/icon-strawberry.png';
import iconCheeseImage from '../../assets/letter/icon-cheese.png';
import iconFruitsImage from '../../assets/letter/icon-fruits.png';
import iconCameraImage from '../../assets/letter/icon-camera.png';
import iconBlueberryImage from '../../assets/letter/icon-blueberry.png';
import iconChocoImage from '../../assets/letter/icon-choco.png';
import goback from '../../assets/letter/goback.png';
import send from '../../assets/letter/send.png';

// 편지지 이미지 import
import letterBluberryCut from '../../assets/letter/letter-blueberry-cut.png';
import letterCheeseCut from '../../assets/letter/letter-cheese-cut.png';
import letterChocoCut from '../../assets/letter/letter-choco-cut.png';
import letterFruitsCut from '../../assets/letter/letter-fruits-cut.png';

// 스타일 객체
const styles = {
  container: {
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  sectionContainer: {
    background: '#4A4848',
    height: '100%',
    width: '100%',
    paddingTop: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  link: {
    textDecoration: 'none',
  },
  letterImageContainer: {
    position: 'relative',
    width: '313px',
    height: '406px',
    margin: '0 auto',
  },
  letterImage: {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    filter: 'opacity(85%)',
    boxShadow: '0px 15px 3px 3px #2c2a2aa3',
  },
  letterContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '70%',
    background: 'transparent',
    border: 'none',
    resize: 'none',
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '10px',
    boxSizing: 'border-box',
    zIndex: 10,
  },
  iconsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '5px',
    justifyItems: 'center',
    marginTop: '30px',
    padding: '0 10px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  optionButton: {
    padding: '8px',
    margin: '3px',
    border: 'none',
    borderRadius: '5px',
    background: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sendButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  sendImage: {
    height: '23px',
    display: 'block',
  },
};

// 아이콘 컴포넌트
const Icon = ({ src, alt, onClick, height }) => (
  <button onClick={onClick} style={styles.iconButton}>
    <img src={src} alt={alt} style={{ height }} />
  </button>
);

const Letter = () => {
  const [letterImage, setLetterImage] = useState(letterStrawberryCut);
  const [selectedOption, setSelectedOption] = useState('custom');
  const [content, setContent] = useState('');
  const [sentBy, setSentBy] = useState('');
  const [font, setFont] = useState('1');
  const [align, setAlign] = useState('1');
  const [background, setBackground] = useState('1');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { username } = useParams();
  const { apiRequest } = useApi();
  


  const backgroundMapping = {
    [letterStrawberryCut]: '1',
    [letterBluberryCut]: '2',
    [letterCheeseCut]: '3',
    [letterChocoCut]: '4',
    [letterFruitsCut]: '5',
  };

  // 편지지 이미지 변경 함수
  const changeImage = (src) => {
    setLetterImage(src);
    setBackground(backgroundMapping[src] || '6');  // 사용자 이미지의 경우 '6'
  };

  // 이미지 업로드 처리 함수
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLetterImage(e.target.result);
        setBackground('6');  // 사용자 이미지는 '6'으로 설정
      };
      reader.readAsDataURL(file);
    }
  };

  // 폰트 변경 함수
  const changeFont = (newFont) => {
    setFont(newFont);
  };

  // 정렬 변경 함수
  const changeAlign = (newAlign) => {
    setAlign(newAlign);
  };

  // 전송 함수
  const handleSend = async () => {
    const letterData = {
      message_content: content,
      sent_by: sentBy,
      font,
      matrix: align,
      background,
    };

    try {
      console.log('Sending letter data:', letterData);
      console.log('Username from URL:', username);
      
      const response = await apiRequest(`/cakes/api/createmessage/${username}/`, {
        method: 'POST',
        body: JSON.stringify(letterData),
      });

      console.log('API response:', response);
      
      alert(response.message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error sending letter:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        alert(`편지 전송 실패: ${error.response.data.error || '알 수 없는 오류가 발생했습니다.'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        alert('편지 전송 중 오류가 발생했습니다.');
      }
    }
  };

  // 아이콘 데이터
  const icons = [
    { src: iconTextImage, alt: 'Text', height: '38px', onClick: () => setSelectedOption('text') },
    { src: iconAlignImage, alt: 'Align', height: '60px', onClick: () => setSelectedOption('align') },
    { src: iconCustomImage, alt: 'Custom', height: '38px', onClick: () => setSelectedOption('custom') },
    { src: iconBlueberryImage, alt: 'Blueberry', height: '50px', onClick: () => changeImage(letterBluberryCut) },
    { src: iconCheeseImage, alt: 'Cheese', height: '50px', onClick: () => changeImage(letterCheeseCut) },
    { src: iconChocoImage, alt: 'Chocolate', height: '50px', onClick: () => changeImage(letterChocoCut) },
    { src: iconFruitsImage, alt: 'Fruits', height: '50px', onClick: () => changeImage(letterFruitsCut) },
    { src: iconStrawberryImage, alt: 'Strawberry', height: '50px', onClick: () => changeImage(letterStrawberryCut) },
    { src: iconCameraImage, alt: 'Camera', height: '50px', onClick: () => fileInputRef.current.click() },
  ];

  const renderOptions = () => {
    switch (selectedOption) {
      case 'text':
        return (
          <div style={styles.iconsGrid}>
            <button style={styles.optionButton} onClick={() => changeFont('1')}>폰트1</button>
            <button style={styles.optionButton} onClick={() => changeFont('2')}>폰트2</button>
            <button style={styles.optionButton} onClick={() => changeFont('3')}>폰트3</button>
          </div>
        );
      case 'align':
        return (
          <div style={styles.iconsGrid}>
            <button style={styles.optionButton} onClick={() => changeAlign('1')}>좌측</button>
            <button style={styles.optionButton} onClick={() => changeAlign('2')}>중앙</button>
            <button style={styles.optionButton} onClick={() => changeAlign('3')}>우측</button>
          </div>
        );
      case 'custom':
      default:
        return (
          <div style={styles.iconsGrid}>
            {icons.slice(3).map((icon, index) => (
              <Icon key={index} {...icon} />
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sectionContainer}>
        <div style={styles.header}>
          <Link to="/" style={styles.link}>
            <img src={goback} alt="취소" style={{ height: '23px' }} />
          </Link>
          <button onClick={handleSend} style={styles.sendButton}>
            <img src={send} alt="전송" style={styles.sendImage} />
          </button>
        </div>

        <div style={styles.letterImageContainer}>
          <img src={letterImage} alt="편지" style={styles.letterImage} />
          <input
            value={sentBy}
            onChange={(e) => setSentBy(e.target.value)}
            style={{
              ...styles.letterContent,
              top: '15%',
              height: '10%',
              fontFamily: `font${font}`,
              textAlign: align === '1' ? 'left' : (align === '2' ? 'center' : 'right'),
              fontSize: '14px',
            }}
            placeholder="보내는 사람"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              ...styles.letterContent,
              top: '60%',
              height: '80%',
              fontFamily: `font${font}`,
              textAlign: align === '1' ? 'left' : (align === '2' ? 'center' : 'right'),
              fontSize: '16px',
            }}
            placeholder="편지 내용을 입력하세요"
          />
        </div>

        <div style={styles.iconsGrid}>
          {icons.slice(0, 3).map((icon, index) => (
            <Icon key={index} {...icon} />
          ))}
        </div>

        {renderOptions()}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default Letter;