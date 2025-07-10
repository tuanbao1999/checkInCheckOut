import React from 'react';
import { Card, Input, Button } from 'antd';

interface ThreeDVistaEmbedProps {
  url?: string;
}

const DEFAULT_URL = 'https://vietnam.travel/sites/default/files/360Tour/HaLong/index.htm'; // Thay bằng link tour thực tế của bạn

const ThreeDVistaEmbed: React.FC<ThreeDVistaEmbedProps> = ({ url }) => {
  const [tourUrl, setTourUrl] = React.useState(url || DEFAULT_URL);
  const [inputUrl, setInputUrl] = React.useState(tourUrl);

  const handleSetUrl = () => {
    setTourUrl(inputUrl);
  };

  return (
    <Card title="Nhúng 3DVista Tour" style={{ margin: 24 }}>
      {/* <div style={{ marginBottom: 16 }}>
        <Input
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          placeholder="Nhập URL tới index.html của tour 3DVista"
          style={{ width: 400, maxWidth: '100%', marginRight: 8 }}
        />
        <Button type="primary" onClick={handleSetUrl}>Xem tour</Button>
      </div> */}
      <div style={{ width: '100%', height: '70vh', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <iframe
          src={tourUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: 400 }}
          allowFullScreen
          title="3DVista Virtual Tour"
        />
      </div>
    </Card>
  );
};

export default ThreeDVistaEmbed; 