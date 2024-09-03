import React, { useState, useContext, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import './Roomvisitor.css';
import messageIcon from '../../assets/room/message.svg';
import paintIcon from '../../assets/room/paint.svg';
import shareIcon from '../../assets/room/share.svg';
import friendIcon from '../../assets/room/friend.svg';
import roomModel from '../../assets/room/room.glb';
import tableModel from '../../assets/room/table.glb';
import chocoWholeCakeModel from '../../assets/room/ChocoWholeCake.glb';
import rollsModel from '../../assets/room/rolls.glb';
import gummybearModel from '../../assets/room/gummybear.glb';
import sprinklesModel from '../../assets/room/sprinkles.glb';
import candlesModel from '../../assets/room/candles.glb';
import Chocodecorate from '../../assets/room/Chocodecorate.glb';
import { AuthContext } from '../../contexts/AuthContext';

const Room = () => {
  const { scene } = useGLTF(roomModel);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.1;
        child.material.roughness = 0.8;
        child.material.envMapIntensity = 1.2;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={[2, 2, 2]}
      position={[0, 0, 0]}
      rotation={[0, -100 * (Math.PI / 180), 0]}
    />
  );
};

const Table = () => {
  const { scene } = useGLTF(tableModel);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.1;
        child.material.roughness = 0.7;
        child.material.envMapIntensity = 1.5;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
      scale={[0.8, 0.8, 0.8]}
    />
  );
};

const Lights = ({ mode }) => {
  switch(mode) {
    case 'bright':
      return (
        <>
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#ffffff" />
        </>
      );
    case 'sunset':
      return (
        <>
          <ambientLight intensity={3} color="#ffd700" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#d46565" />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="##d46565" />
        </>
      );
    case 'night':
      return (
        <>
          <ambientLight intensity={0.5} color="#0000ff" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#4169e1" />
          <pointLight position={[-5, 5, -5]} intensity={0.6} color="#87ceeb" />
        </>
      );
    case 'fantasy':
      return (
        <>
          <ambientLight intensity={1.2} color="#ff69b4" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#9370db" />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="#00ced1" />
        </>
      );
    default:
      return (
        <>
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fffaf0" />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ffe4e1" />
        </>
      );
  }
};

const CakeBase = ({ model }) => {
  const { scene } = useGLTF(model);
  return (
    <primitive
      object={scene}
      position={[0, -0.42, 0]}
      rotation={[0, 0, 0]}
      scale={[0.4, 0.4, 0.4]}
    />
  );
};

const Decoration = ({ model, position }) => {
  const { scene } = useGLTF(model);
  return (
    <primitive
      object={scene}
      position={position}
      rotation={[0, 0, 0]}
      scale={[0.4, 0.4, 0.4]}
    />
  );
};

const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

const Roomvisitor = () => {
  const [isDecorating, setIsDecorating] = useState(false);
  const [activeTab, setActiveTab] = useState('cakeBase');
  const [cakeBase, setCakeBase] = useState(chocoWholeCakeModel);
  const [decorations, setDecorations] = useState([]);
  const [lightMode, setLightMode] = useState('default');
  const [cameraProps, setCameraProps] = useState({
    position: [0, 2, 5],
    fov: 50,
    rotation: [0, 0, 0]
  });
  const { user } = useContext(AuthContext);
  const [dDay, setDDay] = useState(null);

  // 방문자 뷰 설정
  const isVisitorView = true;

  useEffect(() => {
    if (user && user.birthday) {
      const today = new Date();
      const birthday = new Date(user.birthday);
      birthday.setFullYear(today.getFullYear());
      
      if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
      }
      
      const timeDiff = birthday.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setDDay(dayDiff);
    }
  }, [user]);

  const toggleDecorating = () => {
    if (!isVisitorView) {
      setIsDecorating(!isDecorating);
      if (!isDecorating) {
        setCameraProps({
          position: [0, 1, 2],
          fov: 40,
          rotation: [-Math.PI / 12, 0, 0]
        });
      } else {
        setCameraProps({
          position: [0, 2, 5],
          fov: 50,
          rotation: [0, 0, 0]
        });
      }
    }
  };

  const handleCakeBaseChange = (newBase) => {
    if (!isVisitorView) {
      setCakeBase(newBase);
    }
  };

  const handleDecorationToggle = (decoration) => {
    if (!isVisitorView) {
      setDecorations(prev => 
        prev.includes(decoration)
          ? prev.filter(d => d !== decoration)
          : [...prev, decoration]
      );
    }
  };

  const handleLightingChange = (mode) => {
    if (!isVisitorView) {
      setLightMode(mode);
    }
  };

  const handleTabChange = (tab) => {
    if (!isVisitorView) {
      setActiveTab(tab);
      switch (tab) {
        case 'cakeBase':
        case 'decoration':
          setCameraProps({
            position: [0, 4, 2],
            fov: 60,
            rotation: [-Math.PI/3, 0, 0]
          });
          break;
        case 'lighting':
          setCameraProps({
            position: [0, 2, 5],
            fov: 50,
            rotation: [0, 0, 0]
          });
          break;
        default:
          break;
      }
    }
  };

  const { cameraPosition, cameraFov, cameraRotation } = useSpring({
    cameraPosition: cameraProps.position,
    cameraFov: cameraProps.fov,
    cameraRotation: cameraProps.rotation,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <div className="roomvisitor">
      <div className="banner">
        <div className="party-room">{user ? `${user.username}님의 파티룸` : '파티룸'}</div>
        <div className="countdown">
          <span className="icon">🎂</span>
          {dDay !== null ? `D-${dDay}` : 'D-day'}
        </div>
      </div>
      <main className="main-content">
        <div className="canvas-container">
          <Canvas>
            <AnimatedPerspectiveCamera
              makeDefault
              position={cameraPosition}
              fov={cameraFov}
              rotation={cameraRotation}
            />
            <Lights mode={lightMode} />
            <Room />
            <Table />
            <CakeBase model={cakeBase} />
            {decorations.map((decoration, index) => (
              <Decoration 
                key={index} 
                model={decoration.model} 
                position={decoration.position} 
              />
            ))}
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minAzimuthAngle={-Math.PI / 2}
              maxAzimuthAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
            <Environment preset="sunset" intensity={0.8} />
          </Canvas>
          {!isVisitorView && (
            <div className="icon-container">
              <div className="icon-wrapper">
                <img src={messageIcon} alt="Message" className="icon" />
              </div>
              <div className="icon-wrapper" onClick={toggleDecorating}>
                <img src={paintIcon} alt="Paint" className="icon" />
              </div>
              <div className="icon-wrapper">
                <img src={shareIcon} alt="Share" className="icon" />
              </div>
              <div className="icon-wrapper">
                <img src={friendIcon} alt="Friend" className="icon" />
              </div>
            </div>
          )}
          {!isVisitorView && isDecorating && (
            <div className="decorating-panel">
              <h3>케이크 꾸미기</h3>
              <div className="tab-container">
                <button 
                  className={`tab-button ${activeTab === 'cakeBase' ? 'active' : ''}`}
                  onClick={() => handleTabChange('cakeBase')}
                >
                  케이크 시트
                </button>
                <button 
                  className={`tab-button ${activeTab === 'decoration' ? 'active' : ''}`}
                  onClick={() => handleTabChange('decoration')}
                >
                  데코레이션
                </button>
                <button 
                  className={`tab-button ${activeTab === 'lighting' ? 'active' : ''}`}
                  onClick={() => handleTabChange('lighting')}
                >
                  조명
                </button>
              </div>
              <div className="decorating-options">
                {activeTab === 'cakeBase' && (
                  <div className="option-group">
                    <button 
                      className="option-button" 
                      onClick={() => handleCakeBaseChange(chocoWholeCakeModel)}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/cake-icon.svg`} alt="Choco Whole Cake" />
                    </button>
                    {/* 추가 케이크 시트 옵션을 위한 공간 */}
                  </div>
                )}
                {activeTab === 'decoration' && (
                  <div className="option-group">
                    <button 
                      className="option-button" 
                      onClick={() => handleDecorationToggle({ model: rollsModel, position: [0, -0.4, 0] })}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/rolls-icon.svg`} alt="Rolls" />
                    </button>
                    <button 
                      className="option-button" 
                      onClick={() => handleDecorationToggle({ model: Chocodecorate, position: [0, -0.4, 0] })}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/Chocodecorate-icon.svg`} alt="Chocodecorate" />
                    </button>
                    <button 
                      className="option-button" 
                      onClick={() => handleDecorationToggle({ model: gummybearModel, position: [0, -0.4, 0] })}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/gummybear-icon.svg`} alt="Gummy Bear" />
                    </button>
                    <button 
                      className="option-button" 
                      onClick={() => handleDecorationToggle({ model: sprinklesModel, position: [0, -0.7, 0] })}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/sprinkles-icon.svg`} alt="Sprinkles" />
                    </button>
                    <button 
                      className="option-button" 
                      onClick={() => handleDecorationToggle({ model: candlesModel, position: [0, -0.4, 0] })}
                    >
                      <img src={`${process.env.PUBLIC_URL}/assets/room/candles-icon.svg`} alt="Candles" />
                    </button>
                  </div>
                )}
                {activeTab === 'lighting' && (
                  <div className="option-group">
                    <button onClick={() => handleLightingChange('bright')}>밝은 조명</button>
                    <button onClick={() => handleLightingChange('sunset')}>노을 조명</button>
                    <button onClick={() => handleLightingChange('night')}>밤 조명</button>
                    <button onClick={() => handleLightingChange('fantasy')}>환상적인 조명</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Roomvisitor;
