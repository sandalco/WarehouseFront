"use client";

import { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from "@zxing/library";

interface ZXingBarcodeScannerProps {
  onResult: (result: string | null) => void;
  onError?: (error: any) => void;
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

export function ZXingBarcodeScanner({
  onResult,
  onError,
  width = 350,
  height = 250,
  facingMode = "environment"
}: ZXingBarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    let mounted = true;

    const startScanning = async () => {
      if (!videoRef.current) return;

      try {
        setError(null);
        setIsScanning(true);

        // ZXing reader yaradırıq
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.ITF,
          BarcodeFormat.CODABAR,
        ]);

        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        // Kamera icazəsi və görüntü alırıq
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: width },
            height: { ideal: height },
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          // Barkod oxuma döngüsü
          reader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
            if (result) {
              onResult(result.getText());
            }
            if (error && onError) {
              // Error çox olur, yalnız vacib olanları göndər
              if (error.name !== "NotFoundException") {
                onError(error);
              }
            }
          });
        }
      } catch (err: any) {
        console.error("Kamera açılarkən xəta:", err);
        setError("Kamera açıla bilmədi: " + err.message);
        if (onError) onError(err);
      }
    };

    startScanning();

    return () => {
      mounted = false;
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsScanning(false);
    };
  }, [onResult, onError, width, height, facingMode]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: "cover",
          borderRadius: "8px",
        }}
        playsInline
        muted
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-700 text-sm p-2 rounded">
          {error}
        </div>
      )}
      {!isScanning && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 text-sm">
          Kamera başladılır...
        </div>
      )}
      {/* Barkod frame göstəricisi */}
      <div className="absolute inset-0 border-2 border-red-500 border-dashed opacity-50 rounded pointer-events-none" />
    </div>
  );
}
