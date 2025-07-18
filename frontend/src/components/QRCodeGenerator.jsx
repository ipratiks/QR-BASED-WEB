import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value, size = 256 }) => {
  if (!value) {
    return <p>No QR code data available.</p>;
  }

  return (
    <div className="qr-code-container">
      <QRCode value={value} size={size} level="H" />
    </div>
  );
};

export default QRCodeGenerator;