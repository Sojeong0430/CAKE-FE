import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import NavBar from './components/common/nav';
import Footer from './components/common/footer';
import Main from './pages/main';
import Login from './pages/auth/login';
import Signed from './pages/auth/signed';
import WithdrawalPage from './pages/auth/deleteaccount';
import Agrees from './pages/auth/agrees';
import Infos from './pages/auth/infos';
import Letter from './components/letter/letter';
import FriendList from './components/friendlist/friendlist';
import MessageOpen from './components/letter/messageopen.js';
import Roomowner from './components/room/Roomowner';
import Roomvisitor from './components/room/Roomvisitor';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '430px',
    margin: '0 auto',
    backgroundColor: '#fff',
    position: 'relative',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  pageWrapper: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '20px',
    boxSizing: 'border-box',
  },
};


const PageWrapper = ({ children }) => {
  return <div style={styles.pageWrapper}>{children}</div>;
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


// 새로운 컴포넌트: 로그인한 사용자를 위한 보호된 라우트
const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  {/* if (isLoggedIn && user) {
    return <Navigate to={`/${user.username}/partyroom`} replace />;
  } */}

  return children;
};

const PartyVisitorRoute = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const isOwner = user && user.username === username;
  return isOwner ? (
    <Navigate to={`/${username}/partyroom`} replace />
  ) : (
    <PageWrapper><Roomvisitor /></PageWrapper>
  );
};


function UserRoutes() {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

   // 현재 로그인한 사용자의 username과 URL의 username이 일치하는지 확인
   const isCurrentUser = user && user.username === username;


   return (
    <Routes>
      <Route path="/" element={<Navigate to="partyroom" replace />} />
      <Route 
        path="friendlist" 
        element={
          isCurrentUser ? (
            <PageWrapper><FriendList /></PageWrapper>
          ) : (
            <Navigate to={`/${user.username}/friendlist`} replace />
          )
        } 
      />
      <Route 
        path="partyroom" 
        element={
          isCurrentUser ? (
            <PageWrapper><Roomowner /></PageWrapper>
          ) : (
            <Navigate to={`/${user.username}/partyroom`} replace />
          )
        } 
      />

      <Route 
        path="messageopen" 
        element={
          isCurrentUser ? (
            <PageWrapper><MessageOpen /></PageWrapper>
          ) : (
            <Navigate to={`/${user.username}/messageopen`} replace />
          )
        } 
      />
    </Routes>
  );
}

function AppContent() {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    const viewport = document.createElement('meta');
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(viewport);

    document.body.style.background = 'linear-gradient(to bottom, #FFC3D2, #FFFFFF)';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';

    return () => {
      document.head.removeChild(viewport);
      document.body.style = '';
    };
  }, []);

  return (
    <div style={styles.appContainer}>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<PageWrapper><Main /></PageWrapper>} />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <PageWrapper><Login /></PageWrapper>
            </PublicOnlyRoute>
          } />
          <Route path="/agrees" element={
            <PublicOnlyRoute>
              <PageWrapper><Agrees /></PageWrapper>
            </PublicOnlyRoute>
          } />
          <Route path="/deleteID" element={
            <ProtectedRoute>
              <PageWrapper><WithdrawalPage /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/signed" element={
            <PublicOnlyRoute>
              <PageWrapper><Signed /></PageWrapper>
            </PublicOnlyRoute>
          } />
          <Route path="/infos" element={
            <PublicOnlyRoute>
              <PageWrapper><Infos /></PageWrapper>
            </PublicOnlyRoute>
          } />
          <Route path="/:username/letter" element={<PageWrapper><Letter /></PageWrapper>} />
          <Route path="/:username/partyvisitor" element={<PartyVisitorRoute />} />
          
          <Route 
          path="/:username/*"
            element={
              <ProtectedRoute>
                {user ? <UserRoutes /> : <Navigate to="/login" replace />}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}


    

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;