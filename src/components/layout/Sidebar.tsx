import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/checkin',
      icon: <ClockCircleOutlined />,
      label: 'Check-in/Check-out',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
      theme="dark"
      className="responsive-sidebar"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div 
        style={{ 
          padding: '12px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '8px'
        }}
        className="responsive-sidebar-header"
      >
        {!collapsed && (
          <Title 
            level={4} 
            style={{ 
              color: 'white', 
              margin: 0,
              fontWeight: 'bold',
              fontSize: '14px'
            }}
            className="responsive-sidebar-title"
          >
            Menu
          </Title>
        )}
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
        }}
        className="responsive-sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar; 