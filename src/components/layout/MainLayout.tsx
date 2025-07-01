import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUserStore } from '../../store/userStore';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { userData } = useUserStore();

  return (
    <Layout style={{ minHeight: '100vh' }} className="responsive-main-layout">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="responsive-layout-content">
        <Header 
          onLogout={onLogout} 
          userName={userData?.fullName || userData?.username || 'User'} 
        />
        <Content
          style={{
            margin: '16px 8px',
            padding: 16,
            background: '#f5f5f5',
            borderRadius: '8px',
            minHeight: 280,
          }}
          className="responsive-content"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 