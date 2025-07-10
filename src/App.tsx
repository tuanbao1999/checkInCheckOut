import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/en_US';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import CheckInCheckOut from './components/checkin/CheckInCheckOut';
import VirtualViewer from './components/virtual/VirtualViewer';
import HaLongBayTour from './components/virtual/HaLongBayTour';
import VirtualTour360 from './components/virtual/VirtualTour360';
import ThreeDVistaEmbed from './components/virtual/ThreeDVistaEmbed';
import MarzipanoEmbed from './components/virtual/MarzipanoEmbed';
import { useUserStore } from './store/userStore';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, clearUserData, setAuthenticated } = useUserStore();

  const handleLogin = (values: any) => {
    console.log('Login values:', values);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    clearUserData(); // Clear user data from store and localStorage
  };

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Routes>
          {/* Public routes - accessible without login */}
          <Route path="/3dvista-embed/halong-tour" element={<ThreeDVistaEmbed />} />
          <Route path="/marzipano-embed/halong-tour" element={<MarzipanoEmbed />} />
          
          {/* Protected routes - require login */}
          <Route path="/*" element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <MainLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Navigate to="/checkin" replace />} />
                  <Route path="/checkin" element={<CheckInCheckOut />} />
                  {/* <Route path="/virtual" element={<VirtualViewer />} />
                  <Route path="/halong-tour" element={<HaLongBayTour />} />
                  <Route path="/virtual-tour-360" element={<VirtualTour360 />} /> */}
                  <Route path="*" element={<Navigate to="/checkin" replace />} />
                </Routes>
              </MainLayout>
            )
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ConfigProvider>
  );
};

export default App;
