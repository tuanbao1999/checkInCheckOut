import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Upload, message, Space, Select, Slider, Row, Col, Typography, Divider } from 'antd';
import { UploadOutlined, PlayCircleOutlined, PauseCircleOutlined, RotateLeftOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import './VirtualViewer.css';

const { Option } = Select;
const { Title, Text } = Typography;

// 3D Model Component
const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  
  useFrame((state) => {
    scene.rotation.y += 0.005;
  });

  return <primitive object={scene} />;
};

// 360° Panorama Component
const PanoramaViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
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

interface VirtualViewerProps {
  mode?: '3d' | 'panorama' | 'vr';
}

// Sample 3D Models for Vietnam
const sampleModels = [
  {
    name: 'Chùa Một Cột',
    description: 'Kiến trúc chùa truyền thống Việt Nam',
    url: 'https://sketchfab.com/models/chua-mot-cot-hanoi-vietnam',
    category: 'Kiến trúc'
  },
  {
    name: 'Nhà Phố Hà Nội',
    description: 'Nhà phố cổ Hà Nội',
    url: 'https://sketchfab.com/models/hanoi-old-quarter-house',
    category: 'Kiến trúc'
  },
  {
    name: 'Áo Dài Việt Nam',
    description: 'Trang phục truyền thống',
    url: 'https://sketchfab.com/models/vietnamese-ao-dai',
    category: 'Văn hóa'
  },
  {
    name: 'Nón Lá',
    description: 'Nón lá truyền thống',
    url: 'https://sketchfab.com/models/vietnamese-conical-hat',
    category: 'Văn hóa'
  }
];

const VirtualViewer: React.FC<VirtualViewerProps> = ({ mode = '3d' }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');

  const handleFileUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setFileList(info.fileList);
      setCurrentModel(URL.createObjectURL(info.file.originFileObj));
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange: handleFileUpload,
    accept: currentMode === '3d' ? '.glb,.gltf' : '.jpg,.jpeg,.png',
  };

  const renderViewer = () => {
    switch (currentMode) {
      case '3d':
        return (
          <div style={{ height: '500px', width: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              {currentModel ? (
                <Model url={currentModel} />
              ) : (
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="orange" />
                </mesh>
              )}
              <OrbitControls />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        );
      
      case 'panorama':
        return (
          <div style={{ height: '500px', width: '100%' }}>
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              {currentModel ? (
                <PanoramaViewer imageUrl={currentModel} />
              ) : (
                <mesh>
                  <sphereGeometry args={[500, 60, 40]} />
                  <meshBasicMaterial color="lightblue" side={THREE.BackSide} />
                </mesh>
              )}
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        );
      
      case 'vr':
        return (
          <div style={{ height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ textAlign: 'center' }}>
              <h3>VR Mode</h3>
              <p>VR functionality requires WebXR support</p>
              <Button type="primary" disabled>
                Enter VR
              </Button>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="virtual-viewer-container">
      <Card title="Virtual Viewer - Xem Mô Hình 3D" className="virtual-viewer-card" style={{ margin: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="control-panel">
            <Space>
              <Select
                value={currentMode}
                onChange={setCurrentMode}
                className="mode-selector"
              >
                <Option value="3d">3D Model</Option>
                <Option value="panorama">360° Panorama</Option>
                <Option value="vr">VR Mode</Option>
              </Select>
              
              <Button
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 'Tạm dừng' : 'Phát'}
              </Button>
              
              <Button icon={<RotateLeftOutlined />}>
                Đặt lại
              </Button>
            </Space>
          </div>

          {currentMode !== 'vr' && (
            <Upload {...uploadProps} fileList={fileList}>
              <Button icon={<UploadOutlined />} className="upload-button">
                Tải lên {currentMode === '3d' ? 'Mô hình 3D' : 'Ảnh Panorama'}
              </Button>
            </Upload>
          )}

          {currentMode === '3d' && (
            <div>
              <label>Tốc độ xoay:</label>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={rotationSpeed}
                onChange={setRotationSpeed}
                style={{ width: 200, marginLeft: 10 }}
              />
            </div>
          )}

          <div className="canvas-container">
            {renderViewer()}
          </div>

          {currentMode === '3d' && (
            <>
              <Divider />
              <div>
                <Title level={4}>📥 Nguồn tải 3D Model miễn phí:</Title>
                <Row gutter={[16, 16]}>
                  {sampleModels.map((model, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                      <Card size="small" hoverable>
                        <Title level={5}>{model.name}</Title>
                        <Text type="secondary">{model.description}</Text>
                        <br />
                        <Text code>{model.category}</Text>
                        <br />
                        <Button 
                          type="link" 
                          icon={<DownloadOutlined />}
                          onClick={() => window.open(model.url, '_blank')}
                        >
                          Xem mẫu
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
                
                <Divider />
                <Card size="small" style={{ background: '#f0f8ff' }}>
                  <Title level={5}>🔗 Các trang web tải 3D Model miễn phí:</Title>
                  <ul>
                    <li><strong>Sketchfab:</strong> <a href="https://sketchfab.com" target="_blank" rel="noopener">sketchfab.com</a> - Cộng đồng lớn, nhiều model chất lượng</li>
                    <li><strong>TurboSquid:</strong> <a href="https://www.turbosquid.com" target="_blank" rel="noopener">turbosquid.com</a> - Chuyên nghiệp, nhiều model game/architecture</li>
                    <li><strong>Free3D:</strong> <a href="https://free3d.com" target="_blank" rel="noopener">free3d.com</a> - Hoàn toàn miễn phí</li>
                    <li><strong>CGTrader:</strong> <a href="https://www.cgtrader.com" target="_blank" rel="noopener">cgtrader.com</a> - Nhiều model game và architecture</li>
                  </ul>
                  <Text type="secondary">
                    💡 <strong>Lưu ý:</strong> Tìm kiếm với từ khóa "vietnam", "asian", "chinese temple" để có model phù hợp với văn hóa Việt Nam
                  </Text>
                </Card>
              </div>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default VirtualViewer; 