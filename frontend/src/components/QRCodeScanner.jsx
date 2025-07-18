import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the scanner element exists before initializing
    const scannerElement = document.getElementById('qr-code-reader');
    if (!scannerElement) {
      console.error("QR Code Reader element not found.");
      return;
    }

    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-code-reader",
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    );

    const handleScanSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      onScanSuccess(decodedText);
      // Optional: Stop the scanner after a successful scan
      qrCodeScanner.clear().catch(err => console.error("Failed to clear scanner:", err));
    };

    const handleScanFailure = (errorMessage) => {
      setError(errorMessage);
      console.warn(`QR Code scan error: ${errorMessage}`);
    };

    qrCodeScanner.render(handleScanSuccess, handleScanFailure);

    // Cleanup function to clear the scanner when the component unmounts
    return () => {
      qrCodeScanner.clear().catch(err => console.error("Failed to clear scanner on unmount:", err));
    };
  }, [onScanSuccess]);

  return (
    <div>
      <div id="qr-code-reader" style={{ width: '100%', maxWidth: '500px' }}></div>
      {scanResult && <p className="message success">Scanned: {scanResult}</p>}
      {error && <p className="message error">Scan Error: {error}</p>}
    </div>
  );
};

export default QRCodeScanner;