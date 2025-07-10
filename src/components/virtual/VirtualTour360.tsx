import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Upload, message, Space } from 'antd';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
// import PANOLENS from 'panolens'; // Bỏ import này

const demoImages = [
  {
    name: 'Demo 1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2048&q=80',
    hotspots: [
      {
        pitch: 0,
        yaw: 90,
        text: 'Đi tới Demo 2',
        target: 1
      }
    ]
  },
  {
    name: 'Demo 2',
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2048&q=80',
    hotspots: [
      {
        pitch: 0,
        yaw: -90,
        text: 'Quay lại Demo 1',
        target: 0
      }
    ]
  }
];

const VirtualTour360: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [images, setImages] = useState(demoImages);
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);

  // Lấy PANOLENS từ window
  const PANOLENS = (window as any).PANOLENS;

  // Tạo panorama và hotspot
  useEffect(() => {
    if (!containerRef.current || !PANOLENS) return;
    containerRef.current.innerHTML = '';
    const viewer = new PANOLENS.Viewer({ container: containerRef.current, autoHideInfospot: false });
    viewerRef.current = viewer;
    const panoramas = images.map((img, idx) => {
      const pano = new PANOLENS.ImagePanorama(img.url);
      if (img.hotspots) {
        img.hotspots.forEach(h => {
          const infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
          infospot.position.setFromSphericalCoords(500, (90 - h.pitch) * Math.PI / 180, h.yaw * Math.PI / 180);
          infospot.addHoverText(h.text);
          infospot.addEventListener('click', () => setCurrent(h.target));
          pano.add(infospot);
        });
      }
      return pano;
    });
    panoramas.forEach(p => viewer.add(p));
    viewer.setPanorama(panoramas[current]);
    return () => { viewer.dispose(); };
  }, [images, current, PANOLENS]);

  // Xử lý upload ảnh 360
  const handleUpload = (info: any) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const url = URL.createObjectURL(info.file.originFileObj);
      setImages(prev => ([
        ...prev,
        {
          name: info.file.name,
          url,
          hotspots: []
        }
      ]));
      setFileList(info.fileList);
      message.success('Tải ảnh thành công!');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Virtual Tour 360° - Upload hoặc chọn ảnh mẫu" style={{ marginBottom: 24 }}>
        <Space>
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
            fileList={fileList}
            accept=".jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>Tải lên ảnh 360°</Button>
          </Upload>
          <Button icon={<PlusCircleOutlined />} onClick={() => setCurrent(0)} disabled={current === 0}>Demo 1</Button>
          <Button icon={<PlusCircleOutlined />} onClick={() => setCurrent(1)} disabled={current === 1}>Demo 2</Button>
        </Space>
      </Card>
      <div ref={containerRef} style={{ width: '100%', height: '70vh', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} />
    </div>
  );
};

export default VirtualTour360; 