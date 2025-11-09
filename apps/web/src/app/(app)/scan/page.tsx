'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Camera, X, AlertCircle } from 'lucide-react';
import ProductViewer from '@/components/ProductViewer';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  qr_code: string;
  name: string;
  brand: string;
  description: string;
  green_score: number;
  carbon_kg: number;
  scoring_version: string;
  model_url: string;
  lifecycle_stages: LifecycleStage[];
  claims: Claim[];
}

interface LifecycleStage {
  stage: string;
  title: string;
  description: string;
  hotspot_position?: string;
  metrics?: {
    score?: number;
    carbon_kg?: number;
    details?: string;
  };
}

interface Claim {
  type: string;
  value: string;
  verified: boolean;
  verifier?: string;
  evidence_url?: string;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep the active MediaStream here so we can bind it after the <video> mounts
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [insecureContext, setInsecureContext] = useState(false);
  const searchParams = useSearchParams();

  // Local sample products as a fallback when API isn't available
  const getLocalSample = (code: string): Product | null => {
    const samples: Record<string, Product> = {
      'PROD-001': {
        id: 'PROD-001',
        qr_code: 'PROD-001',
        name: 'Bình Nước Tái Chế',
        brand: 'GreenLife',
        description:
          'Bình nước làm từ nhựa tái chế 100% với quy trình sản xuất tiết kiệm năng lượng.',
        green_score: 85,
        carbon_kg: 1.2,
        scoring_version: 'v1.0',
        model_url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        lifecycle_stages: [
          {
            stage: 'materials',
            title: 'Nguyên liệu',
            description: 'Nhựa PET tái chế từ rác thải sau tiêu dùng.',
            hotspot_position: '0m 0.55m 0.18m',
            metrics: { score: 90, carbon_kg: 0.3, details: 'Tỷ lệ tái chế cao.' },
          },
          {
            stage: 'manufacturing',
            title: 'Sản xuất',
            description: 'Ép phun tiết kiệm điện với nguồn năng lượng xanh 30%.',
            hotspot_position: '-0.35m 0.18m 0.15m',
            metrics: { score: 80, carbon_kg: 0.5 },
          },
          {
            stage: 'distribution',
            title: 'Vận chuyển',
            description: 'Vận chuyển nội địa tối ưu tuyến đường.',
            hotspot_position: '0.35m 0.18m 0.15m',
            metrics: { score: 88, carbon_kg: 0.2 },
          },
          {
            stage: 'use',
            title: 'Sử dụng',
            description: 'Tái sử dụng nhiều lần, giảm nhu cầu chai nhựa mới.',
            hotspot_position: '0m -0.1m 0.4m',
            metrics: { score: 92, carbon_kg: 0.1 },
          },
        ],
        claims: [
          { type: 'recycled_content', value: '100%', verified: true, verifier: 'EcoCert' },
          { type: 'bpa_free', value: 'Yes', verified: true, verifier: 'LabX' },
        ],
      },
      'PROD-002': {
        id: 'PROD-002',
        qr_code: 'PROD-002',
        name: 'Túi Vải Hữu Cơ',
        brand: 'LeafBag',
        description: 'Túi vải cotton hữu cơ, bền và tái sử dụng.',
        green_score: 72,
        carbon_kg: 2.7,
        scoring_version: 'v1.0',
        model_url: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
        lifecycle_stages: [
          {
            stage: 'materials',
            title: 'Nguyên liệu',
            description: 'Bông hữu cơ giảm sử dụng thuốc trừ sâu.',
            hotspot_position: '0m 0.52m 0.16m',
            metrics: { score: 75, carbon_kg: 1.1 },
          },
          {
            stage: 'manufacturing',
            title: 'Sản xuất',
            description: 'Dệt nhuộm hạn chế nước thải.',
            hotspot_position: '-0.33m 0.14m 0.15m',
            metrics: { score: 68, carbon_kg: 1.3 },
          },
          {
            stage: 'distribution',
            title: 'Vận chuyển',
            description: 'Vận chuyển quốc tế đường biển.',
            hotspot_position: '0.33m 0.14m 0.15m',
            metrics: { score: 70, carbon_kg: 0.3 },
          },
          {
            stage: 'use',
            title: 'Sử dụng',
            description: 'Tái sử dụng thay cho túi nilon.',
            hotspot_position: '0m -0.1m 0.38m',
            metrics: { score: 80, carbon_kg: 0.0 },
          },
        ],
        claims: [
          { type: 'organic', value: 'GOTS', verified: true, verifier: 'GOTS' },
        ],
      },
      'PROD-003': {
        id: 'PROD-003',
        qr_code: 'PROD-003',
        name: 'Ống Hút Tre',
        brand: 'BambooNow',
        description: 'Ống hút tre tự nhiên, phân hủy sinh học.',
        green_score: 45,
        carbon_kg: 0.9,
        scoring_version: 'v1.0',
        model_url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
        lifecycle_stages: [
          {
            stage: 'materials',
            title: 'Nguyên liệu',
            description: 'Tre thu hoạch địa phương.',
            hotspot_position: '0m 0.5m 0.15m',
            metrics: { score: 50, carbon_kg: 0.2 },
          },
          {
            stage: 'manufacturing',
            title: 'Sản xuất',
            description: 'Gia công đơn giản, ít năng lượng.',
            hotspot_position: '-0.32m 0.14m 0.15m',
            metrics: { score: 48, carbon_kg: 0.4 },
          },
          {
            stage: 'distribution',
            title: 'Vận chuyển',
            description: 'Phân phối nội địa.',
            hotspot_position: '0.32m 0.14m 0.15m',
            metrics: { score: 55, carbon_kg: 0.2 },
          },
          {
            stage: 'use',
            title: 'Sử dụng',
            description: 'Tái sử dụng và phân hủy sinh học.',
            hotspot_position: '0m -0.12m 0.4m',
            metrics: { score: 60, carbon_kg: 0.1 },
          },
        ],
        claims: [
          { type: 'biodegradable', value: 'Yes', verified: false },
        ],
      },
    };
    return samples[code] ?? null;
  };

  const startCamera = async () => {
    try {
      if (!('mediaDevices' in navigator)) {
        setError('Trình duyệt không hỗ trợ camera (mediaDevices).');
        return;
      }

      // Prefer environment camera if available; fallback to first video input
      let constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' } },
        audio: false,
      };

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        // Fallback to any camera
        console.warn('getUserMedia with env/facingMode failed, falling back to default video', e);
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      // Store stream and activate camera UI first; bind to <video> in an effect
      if (stream) {
        streamRef.current = stream;
        setCameraActive(true);
        setScanning(true);
        setError(null);
      }

      // Populate device list for switching
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = all.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (!deviceId && videoInputs.length > 0) {
        setDeviceId(videoInputs[videoInputs.length - 1]?.deviceId || videoInputs[0].deviceId);
      }
    } catch (err: any) {
      let message = 'Không thể truy cập camera. ';
      if (err?.name === 'NotAllowedError') message += 'Bạn đã từ chối quyền truy cập.';
      else if (err?.name === 'NotFoundError') message += 'Không tìm thấy thiết bị camera.';
      else if (err?.name === 'NotReadableError') message += 'Camera đang được ứng dụng khác sử dụng.';
      else if (!window.isSecureContext) message += 'Cần HTTPS hoặc localhost để mở camera.';
      else message += 'Vui lòng kiểm tra cài đặt quyền.';
      setError(message);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    const stream = streamRef.current || (videoRef.current?.srcObject as MediaStream | null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    streamRef.current = null;
    setCameraActive(false);
    setScanning(false);
  };

  const fetchProduct = useCallback(async (qrCode: string) => {
    // Try API first
    try {
      const res = await fetch(`/api/products/by-qr/${qrCode}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setError(null);
        return;
      }
      // Not OK -> fallthrough to local sample
      console.warn('API trả về non-OK, dùng dữ liệu mẫu local', res.status);
    } catch (err) {
      console.warn('API không khả dụng, dùng dữ liệu mẫu local', err);
    }

    // Local fallback for quick AR tests
    const local = getLocalSample(qrCode);
    if (local) {
      setProduct(local);
      setError(null);
    } else {
      setError('Không tìm thấy sản phẩm với mã QR này. Thử PROD-001, PROD-002, hoặc PROD-003.');
    }
  }, []);

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR detected:', code.data);
        fetchProduct(code.data);
        stopCamera();
      }
    }
  }, [scanning, fetchProduct]);

  useEffect(() => {
    if (scanning && cameraActive) {
      const interval = setInterval(scanQRCode, 300);
      return () => clearInterval(interval);
    }
  }, [scanning, cameraActive, scanQRCode]);

  // Ensure camera is released whenever a product is loaded by any means (QR, test buttons, deep-link)
  useEffect(() => {
    if (product) {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Bind the stream to the <video> element once the camera UI is rendered
  useEffect(() => {
    const attach = async () => {
      if (cameraActive && videoRef.current && streamRef.current) {
        // Bind stream and try to play
        if (videoRef.current.srcObject !== streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        try {
          await videoRef.current.play();
        } catch {
          // ignore
        }
      }
    };
    attach();
  }, [cameraActive]);

  // If user changes device while camera is active, restart with the new device
  useEffect(() => {
    const restartForDevice = async () => {
      if (!cameraActive) return;
      try {
        // Stop current stream if any
        const current = streamRef.current;
        current?.getTracks().forEach((t) => t.stop());
        // Start a new stream with selected device
        let constraints: MediaStreamConstraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' } },
          audio: false,
        };
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        streamRef.current = stream;
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch {}
        }
      } catch (e) {
        console.error('Failed to switch camera device', e);
      }
    };
    restartForDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  // Auto-fetch when navigated with /scan?code=PROD-001
  useEffect(() => {
    const code = searchParams?.get('code');
    if (code && !product) {
      fetchProduct(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Warn when context is not secure (HTTPS/localhost required for camera in most browsers)
  useEffect(() => {
    setInsecureContext(!window.isSecureContext);
  }, []);

  const resetScan = () => {
    setProduct(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {!product ? (
        <>
          <div className="scroll-reveal visible">
            <h1 className="text-3xl font-extrabold gradient-text mb-2">Quét Sản Phẩm AR</h1>
            <p className="text-slate-600">Hướng camera vào mã QR trên sản phẩm để xem chi tiết WebAR</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {!cameraActive ? (
              <div className="text-center">
                <Camera className="w-20 h-20 text-teal-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Bắt Đầu Quét QR</h2>
                <p className="text-slate-600 mb-6">
                  Hướng camera vào mã QR trên sản phẩm để xem thông tin môi trường chi tiết.
                </p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-white transition ripple"
                >
                  Mở Camera
                </button>

                {/* Device select & context hint */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  {devices.length > 1 && (
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      value={deviceId ?? ''}
                      onChange={(e) => setDeviceId(e.target.value)}
                      aria-label="Chọn camera"
                    >
                      {devices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label || `Camera ${d.deviceId.slice(0, 4)}...`}
                        </option>
                      ))}
                    </select>
                  )}
                  {insecureContext && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      Lưu ý: Trình duyệt yêu cầu chạy trên HTTPS hoặc localhost để sử dụng camera.
                    </p>
                  )}
                </div>

                {/* Test buttons */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Hoặc test nhanh với:</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => fetchProduct('PROD-001')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition"
                    >
                      PROD-001 (Score 85)
                    </button>
                    <button
                      onClick={() => fetchProduct('PROD-002')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition"
                    >
                      PROD-002 (Score 72)
                    </button>
                    <button
                      onClick={() => fetchProduct('PROD-003')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition"
                    >
                      PROD-003 (Score 45)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="mt-4 text-center">
                  <p className="text-teal-600 animate-pulse">Đang quét QR code...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <ProductViewer product={product} onBack={resetScan} />
      )}
    </div>
  );
}
