import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  message,
  Checkbox,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  LoginOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useUserStore } from '../../store/userStore';
import { getGetDayDetailUrl, getLoginUrl } from '../../config/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface LoginProps {
  onLogin?: (values: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { setUserData } = useUserStore();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log('Calling login API with:', values);
      
      const response = await fetch(getLoginUrl(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password
        })
      });

      console.log("response", response);
      

      const result = await response.json();
      console.log('Login API response:', result);

      if (result.resultCode === 1) {
        // Lưu toàn bộ data vào store
        setUserData(result.data);
        
        toast.success(`✅ Đăng nhập thành công! Chào mừng ${result.data.fullName}! 🎉`);
        
        if (onLogin) {
          onLogin(values);
          // callGetDayDetailAPI(result.data.token);
        }
      } else {
        toast.error(`❌ ${result.message || 'Đăng nhập thất bại!'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('❌ Lỗi kết nối! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const callGetDayDetailAPI = async (token: string) => {
    const apiUrl = getGetDayDetailUrl();
    const response = await fetch(apiUrl , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        header: {
          token: token
        },
        bodyData: {
          day: "05",
          month: dayjs().format('MM'),
          year:  dayjs().format('YYYY')
        }
      })
    });
    const result = await response.json();
    console.log('API Response:', result);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      className="responsive-login-container"
    >
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={22} md={18} lg={14} xl={10}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}
            className="responsive-login-card"
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }} className="responsive-login-header">
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 6px 12px rgba(102, 126, 234, 0.3)'
                }}
                className="responsive-login-icon"
              >
                <BuildOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
              
              <Title level={2} style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }} className="responsive-login-title">
                Welcome Back
              </Title>
              
              <Text style={{ color: '#7f8c8d', fontSize: '14px' }} className="responsive-login-subtitle">
                Sign in to your Check-in Check-out System
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              className="responsive-login-form"
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please enter your username!' },
                  { min: 3, message: 'Username must be at least 3 characters!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#667eea' }} />}
                  placeholder="Enter your username"
                  style={{
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '14px'
                  }}
                  className="responsive-login-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#667eea' }} />}
                  placeholder="Enter your password"
                  iconRender={(visible) => 
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '14px'
                  }}
                  className="responsive-login-input"
                />
              </Form.Item>

              <Form.Item className="responsive-login-options">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox style={{ color: '#7f8c8d', fontSize: '12px' }} className="responsive-login-checkbox">
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <a 
                    href="#" 
                    style={{ 
                      color: '#667eea', 
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '12px'
                    }}
                    className="responsive-login-forgot"
                  >
                    Forgot password?
                  </a>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                  className="responsive-login-button"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: '20px 0' }} className="responsive-login-divider">
              <Text style={{ color: '#7f8c8d', fontSize: '12px' }}>Or</Text>
            </Divider>

            <Space direction="vertical" style={{ width: '100%' }} className="responsive-login-social">
              <Button
                block
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: '1px solid #e1e8ed',
                  background: 'white',
                  color: '#1da1f2'
                }}
                className="responsive-social-button"
              >
                Continue with Google
              </Button>
              
              <Button
                block
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: '1px solid #e1e8ed',
                  background: 'white',
                  color: '#1877f2'
                }}
                className="responsive-social-button"
              >
                Continue with Facebook
              </Button>
            </Space>

            <div style={{ textAlign: 'center', marginTop: '20px' }} className="responsive-login-footer">
              <Text style={{ color: '#7f8c8d', fontSize: '12px' }}>
                Don't have an account?{' '}
                <a 
                  href="#" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Sign up
                </a>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login; 