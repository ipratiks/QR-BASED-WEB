import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scannerId = "qr-code-reader";
    // Check if the scanner element exists before initializing
    const scannerElement = document.getElementById(scannerId);
    if (!scannerElement) {
      console.error("QR Code Reader element not found.");
      return;
    }

    const qrCodeScanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: 250, disableFlip: false }, // disableFlip: false is good for mobile
      /* verbose= */ false
    );

    const handleSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      setError(null); // Clear any previous errors
      onScanSuccess(decodedText); // Only call parent success handler on actual success
      // Optional: Stop the scanner after a successful scan to prevent re-scans
      // qrCodeScanner.clear().catch(err => console.error("Failed to clear scanner:", err));
    };

    const handleError = (errorMessage) => {
      // This callback is for scan failures (e.g., no code detected, camera issues)
      // We don't want to call onScanSuccess here.
      setError(errorMessage);
      setScanResult(null); // Clear previous scan result on error
      console.warn(`QR Code scan error: ${errorMessage}`);
    };

    // Render the scanner with distinct success and error callbacks
    qrCodeScanner.render(handleSuccess, handleError);

    // Cleanup function to clear the scanner when the component unmounts
    return () => {
      qrCodeScanner.clear().catch(err => console.error("Failed to clear scanner on unmount:", err));
    };
  }, [onScanSuccess]); // Re-run effect if onScanSuccess prop changes

  return (
    <div>
      <div id="qr-code-reader" style={{ width: '100%', maxWidth: '500px' }}></div>
      {scanResult && <p className="message success">Scanned: {scanResult}</p>}
      {error && <p className="message error">Scan Error: {error}</p>}
      {/* Add a button to restart scan if needed, or rely on auto-restart */}
      {/* <button onClick={() => window.location.reload()}>Restart Scanner</button> */}
    </div>
  );
};

export default QRCodeScanner;
