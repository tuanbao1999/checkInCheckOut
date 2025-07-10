import React, { useState } from 'react';
import { Card, Input, Button } from 'antd';

const DEFAULT_PATH = '/marzipano-tour/index.html'; // Đổi thành đường dẫn thực tế nếu khác

const MarzipanoEmbed: React.FC = () => {
  const [tourPath, setTourPath] = useState(DEFAULT_PATH);
  const [inputPath, setInputPath] = useState(DEFAULT_PATH);

  const handleSetPath = () => {
    setTourPath(inputPath);
  };

  return (
    <Card title="Nhúng Marzipano Tour 360°" style={{ margin: 24 }}>
      {/* <div style={{ marginBottom: 16 }}>
        <Input
          value={inputPath}
          onChange={e => setInputPath(e.target.value)}
          placeholder="Nhập đường dẫn tới index.html của tour (ví dụ: /marzipano-tour/index.html)"
          style={{ width: 400, maxWidth: '100%', marginRight: 8 }}
        />
        <Button type="primary" onClick={handleSetPath}>Xem tour</Button>
      </div> */}
      <div style={{ width: '100%', height: '70vh', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <iframe
          src={tourPath}
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: 400 }}
          allowFullScreen
          title="Marzipano Virtual Tour"
        />
      </div>
    </Card>
  );
};

export default MarzipanoEmbed; 