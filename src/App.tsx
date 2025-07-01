import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/en_US';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import CheckInCheckOut from './components/checkin/CheckInCheckOut';
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

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
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
      </>
    );
  }

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
        <MainLayout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/checkin" replace />} />
            <Route path="/checkin" element={<CheckInCheckOut />} />
            <Route path="*" element={<Navigate to="/checkin" replace />} />
          </Routes>
        </MainLayout>
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
