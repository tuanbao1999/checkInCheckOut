import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  message,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Radio,
  notification
} from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  LoginOutlined, 
  LogoutOutlined, 
  UndoOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import locale from 'antd/locale/en_US';
import { useUserStore } from '../../store/userStore';
import { getCheckInOutUrl } from '../../config/api';

const { Title, Text } = Typography;
const { Option } = Select;

// Custom DatePicker component to prevent flickering
const StableDatePicker: React.FC<{
  value?: dayjs.Dayjs;
  onChange?: (date: dayjs.Dayjs | null) => void;
  placeholder?: string;
}> = React.memo(({ value, onChange, placeholder }) => {
  return (
    <DatePicker 
      value={value}
      onChange={onChange}
      format="YYYY-MM-DD"
      placeholder={placeholder}
      style={{ width: '100%' }}
      size="large"
      allowClear={false}
      inputReadOnly={false}
      getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      popupStyle={{ zIndex: 1050 }}
    />
  );
});

// Custom TimePicker component to prevent flickering
const StableTimePicker: React.FC<{
  value?: dayjs.Dayjs;
  onChange?: (time: dayjs.Dayjs | null) => void;
  placeholder?: string;
}> = React.memo(({ value, onChange, placeholder }) => {
  return (
    <TimePicker 
      value={value}
      onChange={onChange}
      format="HH:mm:ss"
      placeholder={placeholder}
      style={{ width: '100%' }}
      size="large"
      allowClear={false}
      inputReadOnly={false}
      getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      popupStyle={{ zIndex: 1050 }}
    />
  );
});

// Separate component for Undo Form to prevent re-renders
const UndoForm: React.FC<{
  onSubmit: (values: any) => void;
  onCancel: () => void;
}> = React.memo(({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | undefined>(undefined);

  // Function to generate random time for check-in (8:20-8:29)
  const generateRandomCheckInTime = () => {
    const randomMinutes = Math.floor(Math.random() * 10) + 20; // 20-29 minutes
    return dayjs().hour(8).minute(randomMinutes).second(0);
  };

  // Function to generate random time for check-out (18:00-18:30)
  const generateRandomCheckOutTime = () => {
    const randomMinutes = Math.floor(Math.random() * 31); // 0-30 minutes
    return dayjs().hour(18).minute(randomMinutes).second(0);
  };

  const handleActionChange = (actionType: string) => {
    // Always set today's date when action is selected
    const today = dayjs();
    setSelectedDate(today);
    form.setFieldsValue({ selectedDate: today });
    
    if (actionType === 'checkin') {
      const time = generateRandomCheckInTime();
      setSelectedTime(time);
      form.setFieldsValue({ selectedTime: time });
    } else if (actionType === 'checkout') {
      const time = generateRandomCheckOutTime();
      setSelectedTime(time);
      form.setFieldsValue({ selectedTime: time });
    }
  };

  // Sync form values with state when form changes
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    const newDate = date || dayjs();
    setSelectedDate(newDate);
    form.setFieldsValue({ selectedDate: newDate });
  };

  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    const newTime = time || undefined;
    setSelectedTime(newTime);
    form.setFieldsValue({ selectedTime: newTime });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { actionType } = values;
      
      // Manual validation
      if (!selectedDate) {
        message.error('Please select a date!');
        return;
      }
      if (!selectedTime) {
        message.error('Please select a time!');
        return;
      }
      if (!actionType) {
        message.error('Please select an action!');
        return;
      }
      
      // Combine date and time
      const combinedDateTime = selectedDate
        .hour(selectedTime.hour())
        .minute(selectedTime.minute())
        .second(selectedTime.second());
      
      onSubmit({
        selectedDate: combinedDateTime,
        actionType
      });
      
      // Don't reset form or close it - just show success message
      // form.resetFields();
      // setSelectedDate(dayjs());
      // setSelectedTime(undefined);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedDate(dayjs());
    setSelectedTime(undefined);
    onCancel();
  };

  return (
    <div style={{ 
      marginTop: '32px', 
      padding: '16px',
      background: 'rgba(255,255,255,0.1)', 
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      zIndex: 10
    }}>
      <Form form={form} layout="vertical" preserve={false}>
        {/* Action Selection - Top */}
        <Row>
          <Col span={24}>
            <Form.Item
              name="actionType"
              label={<Text style={{ color: 'white' }}>Action</Text>}
            >
              <Radio.Group onChange={(e) => handleActionChange(e.target.value)}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="checkin" style={{ width: '100%', marginBottom: '8px' }}>
                    <Space>
                      <LoginOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ color: 'white' }}>Check In</Text>
                    </Space>
                  </Radio>
                  <Radio value="checkout" style={{ width: '100%' }}>
                    <Space>
                      <LogoutOutlined style={{ color: '#ff4d4f' }} />
                      <Text style={{ color: 'white' }}>Check Out</Text>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Date and Time Selection */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="selectedDate"
              label={<Text style={{ color: 'white' }}>Date</Text>}
            >
              <StableDatePicker 
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="Select date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="selectedTime"
              label={<Text style={{ color: 'white' }}>Time</Text>}
            >
              <StableTimePicker 
                value={selectedTime}
                onChange={handleTimeChange}
                placeholder="Select time"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row gutter={[8, 8]} style={{ marginTop: '16px' }}>
          <Col xs={12}>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              style={{ 
                width: '100%', 
                height: '40px',
                background: '#52c41a',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              Submit
            </Button>
          </Col>
          <Col xs={12}>
            <Button 
              onClick={handleCancel}
              style={{ 
                width: '100%', 
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                color: 'white'
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

const CheckInCheckOut: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<dayjs.Dayjs | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<dayjs.Dayjs | null>(null);
  const [showUndoForm, setShowUndoForm] = useState(false);
  const userStore = useUserStore();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // API call function
  const callCheckInOutAPI = useCallback(async (type: 'checkin' | 'checkout', time?: dayjs.Dayjs) => {
    try {
      const { userData } = userStore;
      
      if (!userData?.etmsId || !userData?.token) {
        toast.error('❌ Thiếu thông tin đăng nhập. Vui lòng đăng nhập lại.');
        return;
      }

      const selectedTime = time || currentTime;
      const dateCheckInOut = selectedTime.format('DD-MM-YYYY HH:mm:ss');
      const typeCheckInOut = type === 'checkin' ? 1 : 2;
      
      const apiUrl = getCheckInOutUrl();

      console.log('Calling API:', apiUrl);
      console.log('API Data:', {
        userId: userData.etmsId,
        typeCheckInOut,
        dateCheckInOut,
        token: userData.token
      });
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          header: {
            userName: userData.username || '',
            token: userData.token
          },
          bodyData: {
            userId: userData.etmsId,
            typeCheckInOut: typeCheckInOut.toString(),
            dateCheckInOut: dateCheckInOut
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Kiểm tra response từ API
      if (result.resultCode === 1) {
        if (type === 'checkin') {
          setCheckInTime(selectedTime);
          setIsCheckedIn(true);
          toast.success(`✅ Check-in thành công lúc ${selectedTime.format('HH:mm:ss DD/MM/YYYY')}! 🎉`);
        } else {
          setCheckOutTime(selectedTime);
          setIsCheckedIn(false);
          toast.success(`✅ Check-out thành công lúc ${selectedTime.format('HH:mm:ss DD/MM/YYYY')}! 👋`);
        }
      } else {
        // API trả về lỗi
        const errorMessage = result.message || 'Thao tác thất bại';
        toast.error(`❌ ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      console.error('API call failed:', error);
      toast.error(`❌ ${type === 'checkin' ? 'Check-in' : 'Check-out'} thất bại. Vui lòng thử lại.`);
    }
  }, [currentTime, userStore]);

  const handleCheckIn = useCallback(async () => {
    // await callCheckInOutAPI('checkin');
  }, [callCheckInOutAPI]);

  const handleCheckOut = useCallback(async () => {
    // await callCheckInOutAPI('checkout');
  }, [callCheckInOutAPI]);

  const handleUndo = useCallback(() => {
    setShowUndoForm(prev => !prev);
  }, []);

  const handleUndoSubmit = useCallback(async (values: any) => {
    const { selectedDate, actionType } = values;
    
    // API call with type and combined datetime
    await callCheckInOutAPI(actionType, selectedDate);
    // Don't close the form - keep it open for further use
    // setShowUndoForm(false);
  }, [callCheckInOutAPI]);

  const handleUndoCancel = useCallback(() => {
    setShowUndoForm(false);
  }, []);

  const getWorkingHours = useMemo(() => {
    if (checkInTime && checkOutTime) {
      const diff = checkOutTime.diff(checkInTime, 'hour', true);
      return diff.toFixed(2);
    }
    return '0.00';
  }, [checkInTime, checkOutTime]);

  // Responsive button styles
  const buttonStyles = useMemo(() => ({
    checkIn: {
      background: '#52c41a',
      border: 'none',
      borderRadius: '8px',
      height: '48px',
      padding: '0 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%'
    },
    checkOut: {
      background: '#ff4d4f',
      border: 'none',
      borderRadius: '8px',
      height: '48px',
      padding: '0 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%'
    },
    undo: {
      background: showUndoForm ? '#1890ff' : '#faad14',
      border: 'none',
      borderRadius: '8px',
      height: '48px',
      padding: '0 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%'
    }
  }), [showUndoForm]);

  return (
    <div style={{ padding: '16px' }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={14} xl={12}>
          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <Title 
                level={2} 
                style={{ 
                  color: 'white', 
                  marginBottom: '16px',
                  fontSize: '20px'
                }}
                className="responsive-title"
              >
                Time Tracking System
              </Title>
              
              {/* User Info Display */}
              {userStore.userData && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '12px'
                }}
                className="responsive-user-info"
                >
                  <Text style={{ color: 'white', fontSize: 'inherit' }}>
                    <strong>User:</strong> {userStore.userData.fullName} ({userStore.userData.username})
                  </Text>
                  <br />
                  <Text style={{ color: 'white', fontSize: 'inherit' }}>
                    <strong>Employee ID:</strong> {userStore.userData.employeeId}
                  </Text>
                  <br />
                  <Text style={{ color: 'white', fontSize: 'inherit' }}>
                    <strong>ETMS ID:</strong> {userStore.userData.etmsId}
                  </Text>
                  <br />
                  <Text style={{ color: 'white', fontSize: 'inherit' }}>
                    <strong>Token:</strong> {userStore.userData.token ? '✓ Có' : '✗ Không có'}
                  </Text>
                </div>
              )}
              
              <div style={{ marginBottom: '24px' }}>
                <ClockCircleOutlined style={{ 
                  fontSize: '24px', 
                  marginRight: '8px'
                }} 
                className="responsive-clock-icon"
                />
                <Text style={{ 
                  color: 'white', 
                  fontSize: '20px', 
                  fontWeight: 'bold'
                }}
                className="responsive-time"
                >
                  {currentTime.format('HH:mm:ss')}
                </Text>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '14px'
                }}
                className="responsive-date"
                >
                  {currentTime.format('dddd, MMMM D, YYYY')}
                </Text>
              </div>

              {/* Responsive Button Layout */}
              <Row gutter={[8, 8]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={handleCheckIn}
                    style={buttonStyles.checkIn}
                    className="responsive-button"
                  >
                    Check In
                  </Button>
                </Col>
                
                <Col xs={24} sm={8}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<LogoutOutlined />}
                    onClick={handleCheckOut}
                    style={buttonStyles.checkOut}
                    className="responsive-button"
                  >
                    Check Out
                  </Button>
                </Col>

                <Col xs={24} sm={8}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<UndoOutlined />}
                    onClick={handleUndo}
                    style={buttonStyles.undo}
                    className="responsive-button"
                  >
                    {showUndoForm ? 'Cancel' : 'Undo'}
                  </Button>
                </Col>
              </Row>

              {/* Undo Form */}
              {showUndoForm && (
                <UndoForm 
                  onSubmit={handleUndoSubmit}
                  onCancel={handleUndoCancel}
                />
              )}

              {/* Status Display */}
              <div style={{ 
                marginTop: '24px', 
                padding: '12px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              className="responsive-status"
              >
                {checkInTime && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ color: 'white', fontSize: 'inherit' }}>
                      <strong>Check-in:</strong> {checkInTime.format('HH:mm:ss DD/MM/YYYY')}
                    </Text>
                  </div>
                )}
                {checkOutTime && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ color: 'white', fontSize: 'inherit' }}>
                      <strong>Check-out:</strong> {checkOutTime.format('HH:mm:ss DD/MM/YYYY')}
                    </Text>
                  </div>
                )}
                {checkInTime && checkOutTime && (
                  <div>
                    <Text style={{ color: 'white', fontSize: 'inherit' }}>
                      <strong>Working Hours:</strong> {getWorkingHours} hours
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckInCheckOut; 