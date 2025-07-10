import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Space, Row, Col, Typography, Carousel, Tag, Progress, Tooltip } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  InfoCircleOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import './HaLongBayTour.css';

const { Title, Text, Paragraph } = Typography;

// Địa điểm Vịnh Hạ Long
const haLongLocations = [
  {
    id: 1,
    name: 'Hang Sửng Sốt',
    description: 'Hang động lớn nhất và đẹp nhất Vịnh Hạ Long',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    panorama: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=2048',
    category: 'Hang động',
    rating: 4.8,
    visitTime: '45 phút',
    difficulty: 'Dễ',
    coordinates: { lat: 20.9101, lng: 107.1839 }
  },
  {
    id: 2,
    name: 'Đảo Ti Tốp',
    description: 'Đảo nổi tiếng với bãi biển đẹp và view toàn cảnh',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    panorama: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2048',
    category: 'Đảo',
    rating: 4.6,
    visitTime: '2 giờ',
    difficulty: 'Trung bình',
    coordinates: { lat: 20.9089, lng: 107.1847 }
  },
  {
    id: 3,
    name: 'Làng Chài Cửa Vạn',
    description: 'Làng chài truyền thống với cuộc sống ngư dân',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    panorama: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048',
    category: 'Văn hóa',
    rating: 4.4,
    visitTime: '1.5 giờ',
    difficulty: 'Dễ',
    coordinates: { lat: 20.9123, lng: 107.1821 }
  },
  {
    id: 4,
    name: 'Hang Luồn',
    description: 'Hang động thủy sinh độc đáo chỉ có thể đi bằng thuyền',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    panorama: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=2048',
    category: 'Hang động',
    rating: 4.7,
    visitTime: '30 phút',
    difficulty: 'Khó',
    coordinates: { lat: 20.9095, lng: 107.1853 }
  },
  {
    id: 5,
    name: 'Đảo Ngọc Vừng',
    description: 'Đảo ngọc với bãi cát trắng và nước biển trong xanh',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    panorama: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2048',
    category: 'Đảo',
    rating: 4.5,
    visitTime: '3 giờ',
    difficulty: 'Trung bình',
    coordinates: { lat: 20.9078, lng: 107.1865 }
  },
  {
    id: 6,
    name: 'Vịnh Bái Tử Long',
    description: 'Vịnh đẹp ít khách du lịch, hoang sơ và yên tĩnh',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    panorama: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048',
    category: 'Vịnh',
    rating: 4.9,
    visitTime: '4 giờ',
    difficulty: 'Dễ',
    coordinates: { lat: 20.9156, lng: 107.1802 }
  }
];

// Panorama Viewer Component
const PanoramaViewer: React.FC<{ imageUrl: string; isPlaying: boolean }> = ({ imageUrl, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} color="lightblue" />
    </mesh>
  );
};

const HaLongBayTour: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);

  const currentSpot = haLongLocations[currentLocation];

  const nextLocation = () => {
    setCurrentLocation((prev) => (prev + 1) % haLongLocations.length);
  };

  const prevLocation = () => {
    setCurrentLocation((prev) => (prev - 1 + haLongLocations.length) % haLongLocations.length);
  };

  const goToLocation = (index: number) => {
    setCurrentLocation(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    setTourProgress((currentLocation / (haLongLocations.length - 1)) * 100);
  }, [currentLocation]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'green';
      case 'Trung bình': return 'orange';
      case 'Khó': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className={`ha-long-tour-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <Card title="🏝️ Virtual Tour Vịnh Hạ Long" className="tour-card">
        <Row gutter={[24, 24]}>
          {/* Main Viewer */}
          <Col xs={24} lg={16}>
            <div className="viewer-container">
              <div className="viewer-header">
                <Space>
                  <Button 
                    icon={<LeftOutlined />} 
                    onClick={prevLocation}
                    disabled={currentLocation === 0}
                  >
                    Trước
                  </Button>
                  <Button 
                    icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? 'Tạm dừng' : 'Tự động xoay'}
                  </Button>
                  <Button 
                    icon={<RightOutlined />} 
                    onClick={nextLocation}
                    disabled={currentLocation === haLongLocations.length - 1}
                  >
                    Tiếp
                  </Button>
                  <Button 
                    icon={<FullscreenOutlined />}
                    onClick={toggleFullscreen}
                  >
                    Toàn màn hình
                  </Button>
                </Space>
                
                <div className="location-info">
                  <Title level={4} style={{ margin: 0 }}>
                    {currentSpot.name}
                  </Title>
                  <Text type="secondary">{currentSpot.description}</Text>
                </div>
              </div>

              <div className="panorama-container">
                <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                  <PanoramaViewer 
                    imageUrl={currentSpot.panorama} 
                    isPlaying={isPlaying}
                  />
                  <OrbitControls enableZoom={false} />
                  <Environment preset="sunset" />
                </Canvas>
              </div>

              <div className="tour-progress">
                <Progress 
                  percent={tourProgress} 
                  format={() => `${currentLocation + 1}/${haLongLocations.length}`}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Location Details */}
          <Col xs={24} lg={8}>
            <div className="location-details">
              <Card size="small" title="📍 Thông tin địa điểm">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Địa điểm:</Text> {currentSpot.name}
                  </div>
                  <div>
                    <Text strong>Mô tả:</Text> {currentSpot.description}
                  </div>
                  <div>
                    <Text strong>Danh mục:</Text> 
                    <Tag color="blue">{currentSpot.category}</Tag>
                  </div>
                  <div>
                    <Text strong>Đánh giá:</Text> 
                    <span style={{ color: '#faad14' }}>★ {currentSpot.rating}</span>
                  </div>
                  <div>
                    <Text strong>Thời gian tham quan:</Text> {currentSpot.visitTime}
                  </div>
                  <div>
                    <Text strong>Độ khó:</Text> 
                    <Tag color={getDifficultyColor(currentSpot.difficulty)}>
                      {currentSpot.difficulty}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Tọa độ:</Text> 
                    <Text code>{currentSpot.coordinates.lat}, {currentSpot.coordinates.lng}</Text>
                  </div>
                </Space>
              </Card>

              <Card size="small" title="🗺️ Bản đồ địa điểm" style={{ marginTop: 16 }}>
                <div className="map-container">
                  <img 
                    src="https://maps.googleapis.com/maps/api/staticmap?center=20.9101,107.1839&zoom=10&size=400x200&maptype=roadmap&markers=color:red%7C20.9101,107.1839&key=YOUR_API_KEY" 
                    alt="Bản đồ Vịnh Hạ Long"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Location Gallery */}
        <Card title="🏞️ Tất cả địa điểm" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {haLongLocations.map((location, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={location.id}>
                <Card 
                  hoverable 
                  cover={
                    <img 
                      alt={location.name} 
                      src={location.image}
                      style={{ height: 150, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => goToLocation(index)}
                  className={currentLocation === index ? 'active-location' : ''}
                >
                  <Card.Meta
                    title={location.name}
                    description={
                      <div>
                        <Text type="secondary">{location.description}</Text>
                        <br />
                        <Tag color="blue">{location.category}</Tag>
                        <span style={{ color: '#faad14', marginLeft: 8 }}>★ {location.rating}</span>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Tour Tips */}
        <Card title="💡 Mẹo tham quan" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="tip-item">
                <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={5}>Thời gian tốt nhất</Title>
                <Text>Tháng 3-5 và 9-11, tránh mùa mưa từ tháng 6-8</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="tip-item">
                <CameraOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Title level={5}>Chụp ảnh đẹp</Title>
                <Text>Bình minh và hoàng hôn là thời điểm lý tưởng</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="tip-item">
                <InfoCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Title level={5}>Lưu ý quan trọng</Title>
                <Text>Mang theo kem chống nắng và nước uống</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default HaLongBayTour; 