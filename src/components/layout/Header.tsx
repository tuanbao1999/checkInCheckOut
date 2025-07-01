import React from 'react';
import { Layout, Button, Typography, Space, Avatar, message } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userName = 'User' }) => {
  const handleLogout = () => {
    message.success('Đăng xuất thành công! 👋');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <AntHeader 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      className="responsive-header"
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title 
          level={3} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontSize: '16px'
          }}
          className="responsive-header-title"
        >
          🏢 Check-in Check-out System
        </Title>
      </div>

      {/* User Info with Logout Icon */}
      <Space style={{ alignItems: 'center' }} className="responsive-header-user">
        <Avatar 
          size="default" 
          icon={<UserOutlined />}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
          className="responsive-header-avatar"
        />
        <span style={{ 
          color: 'white', 
          fontWeight: 500,
          fontSize: '12px'
        }}
        className="responsive-header-username"
        >
          {userName}
        </span>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            color: 'white',
            fontSize: '14px',
            padding: '4px 6px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="responsive-header-logout"
          title="Đăng xuất"
        />
      </Space>
    </AntHeader>
  );
};

export default Header; 