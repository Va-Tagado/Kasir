'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCamera, FiCameraOff } from 'react-icons/fi';

export default function BarcodeScanner({ onScan, enabled }: { onScan: (barcode: string) => void; enabled: boolean }) {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScan = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('reader');
    }
    try {
      setScanning(true);
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          onScan(decodedText);
          stopScan();
        },
        () => {} // ignore scan error
      );
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current && scanning) {
      await scannerRef.current.stop();
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => { stopScan(); };
  }, []);

  if (!enabled) return null;

  return (
    <div className="mb-3">
      {!scanning ? (
        <button onClick={startScan} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
          <FiCamera /> Scan Barcode
        </button>
      ) : (
        <div>
          <div id="reader" className="w-full max-w-xs" />
          <button onClick={stopScan} className="mt-1 flex items-center gap-1 text-red-500 text-sm">
            <FiCameraOff /> Stop Scan
          </button>
        </div>
      )}
    </div>
  );
}
