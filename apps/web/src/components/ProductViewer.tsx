'use client';

import { useRef, useState } from 'react';
import { X, Leaf, Factory, Truck, Recycle, CheckCircle, AlertCircle, ExternalLink, Droplet, Flame } from 'lucide-react';

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

const STAGE_META: Record<
  string,
  {
    cardIcon: JSX.Element;
    hotspotEmoji: string;
  }
> = {
  materials: { cardIcon: <Leaf className="w-5 h-5" />, hotspotEmoji: '🌿' },
  manufacturing: { cardIcon: <Factory className="w-5 h-5" />, hotspotEmoji: '⚙️' },
  production: { cardIcon: <Factory className="w-5 h-5" />, hotspotEmoji: '🏭' },
  distribution: { cardIcon: <Truck className="w-5 h-5" />, hotspotEmoji: '🚚' },
  transport: { cardIcon: <Truck className="w-5 h-5" />, hotspotEmoji: '🚚' },
  use: { cardIcon: <Droplet className="w-5 h-5" />, hotspotEmoji: '✨' },
  end_of_life: { cardIcon: <Recycle className="w-5 h-5" />, hotspotEmoji: '♻️' },
  energy: { cardIcon: <Flame className="w-5 h-5" />, hotspotEmoji: '⚡' },
};

const STAGE_POSITIONS: Record<string, string> = {
  materials: '0m 1.1m 0m',
  manufacturing: '-0.55m 0.35m 0m',
  production: '-0.55m 0.35m 0m',
  distribution: '0.55m 0.35m 0m',
  transport: '0.55m 0.35m 0m',
  use: '0m 0.15m 0.65m',
  end_of_life: '0m 0.15m -0.65m',
  energy: '-0.45m 0.35m 0.45m',
};

const FALLBACK_POSITIONS = ['0m 0.6m 0m', '-0.5m 0.3m 0m', '0.5m 0.3m 0m', '0m 0.1m 0.5m', '0m 0.1m -0.5m'];

export default function ProductViewer({
  product,
  onBack,
}: {
  product: Product;
  onBack: () => void;
}) {
  const [selectedHotspot, setSelectedHotspot] = useState<LifecycleStage | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);
  const viewerRef = useRef<any>(null);
  const [showAllStages, setShowAllStages] = useState(false);
  const [showMoreDesc, setShowMoreDesc] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const activeStage = selectedHotspot ?? product.lifecycle_stages[0];

  return (
    <div className="space-y-4">
      {/* Main layout: AR left, details right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: AR + Stages */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <div className="rounded-2xl p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-teal-600">AR Green Journey</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
                  onClick={() => setViewerKey((k) => k + 1)}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? 'Thu nhỏ' : 'Mở rộng'}
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
                  onClick={() => {
                    const anyViewer = viewerRef.current as any;
                    if (anyViewer?.activateAR) anyViewer.activateAR();
                  }}
                >
                  Xem AR
                </button>
              </div>
            </div>
            <div className={`relative w-full ${expanded ? 'h-[70vh]' : 'h-[360px]'} bg-slate-900 rounded-lg overflow-hidden`}>
              <model-viewer
                key={viewerKey}
                ref={viewerRef}
                src={`${product.model_url}?v=${Date.now()}`}
                alt={product.name}
                auto-rotate
                camera-controls
                ar
                ar-modes="webxr quick-look scene-viewer"
                style={{ width: '100%', height: '100%' }}
              >
                {(() => {
                  // Arrange hotspots on a front-facing arc: top-center (belly), left 30°, bottom-center (under feet forward), right 30°
                  const PRIORITY = ['materials', 'manufacturing', 'production', 'distribution', 'transport', 'use', 'end_of_life'];
                  const sorted = [...product.lifecycle_stages].sort((a, b) =>
                    (PRIORITY.indexOf(a.stage) === -1 ? 999 : PRIORITY.indexOf(a.stage)) -
                    (PRIORITY.indexOf(b.stage) === -1 ? 999 : PRIORITY.indexOf(b.stage))
                  );
                  const stages = sorted.slice(0, 4);

                  // Arc layout (meters)
                  // Custom layout requested:
                  // 1) Head (top center), 2) Left arm, 3) Right arm, 4) Under feet (center)
                  // Keep a small forward offset (z) to avoid intersecting the model.
                  const positions = [
                    { x: -0.45, y: -0.3, z: 0.25 }, // head top (higher)
                    { x: -0.45, y: 0.40, z: 0.25 }, // left arm (higher)
                    { x: 0.45,  y: 0.40, z: 0.25 }, // right arm (higher)
                    { x: 0.45,  y: -0.3, z: 0.25 }, // feet (center)
                  ];

                  return stages.map((stage, i) => {
                    const meta = STAGE_META[stage.stage] ?? STAGE_META.materials;
                    const p = positions[i] ?? positions[positions.length - 1];
                    const pos = `${p.x.toFixed(2)}m ${p.y.toFixed(2)}m ${p.z.toFixed(2)}m`;
                    return (
                      <button
                        key={i}
                        className="hotspot"
                        slot={`hotspot-${i}`}
                        data-position={pos}
                        data-normal="0m 1m 0m"
                        data-stage={stage.stage}
                        data-icon={meta.hotspotEmoji}
                        onClick={() => setSelectedHotspot(stage)}
                      />
                    );
                  });
                })()}
              </model-viewer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Chạm vào các điểm hotspot để xem chi tiết từng giai đoạn lifecycle
            </p>
          </div>

          {/* Lifecycle list */}
          <div className="rounded-2xl p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-teal-600">Lifecycle Stages</h3>
              <button
                type="button"
                className="text-sm text-teal-700 hover:underline"
                onClick={() => setShowAllStages((v) => !v)}
              >
                {showAllStages ? 'Thu gọn' : 'Xem tất cả'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {(showAllStages ? product.lifecycle_stages : product.lifecycle_stages.slice(0, 4)).map((stage, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  onClick={() => setSelectedHotspot(stage)}
                >
                  <div className="text-teal-600 mt-1">{(STAGE_META[stage.stage] ?? STAGE_META.materials).cardIcon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-0.5">{stage.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{stage.description}</p>
                  </div>
                  {stage.metrics?.score !== undefined && (
                    <div className={`text-sm font-semibold ${getScoreColor(stage.metrics.score)}`}>
                      {stage.metrics.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sticky details + metrics */}
  <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-4 space-y-3">
          {/* Compact product header moved to sidebar */}
          <div className="rounded-xl p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">{product.name}</h2>
                <p className="text-teal-700 text-sm font-medium">{product.brand}</p>
              </div>
              <button
                onClick={onBack}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 text-slate-600 text-sm">
              <p className={showMoreDesc ? '' : 'line-clamp-3'}>{product.description}</p>
              <button
                type="button"
                onClick={() => setShowMoreDesc((v) => !v)}
                className="mt-1 text-teal-700 hover:underline text-xs"
              >
                {showMoreDesc ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          </div>

          <div className={`rounded-xl p-4 border ${getScoreBg(product.green_score)} shadow-sm`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-600 text-sm font-medium">GreenScore</span>
              <span className="text-xs text-slate-500">{product.scoring_version}</span>
            </div>
            <div className={`text-4xl font-extrabold ${getScoreColor(product.green_score)}`}>
              {product.green_score}
              <span className="text-2xl text-slate-400">/100</span>
            </div>
          </div>
          <div className="rounded-xl p-4 border border-slate-200 bg-white shadow-sm">
            <span className="text-slate-600 text-sm font-medium block mb-1">Carbon Footprint</span>
            <div className="text-4xl font-extrabold text-orange-500">
              {product.carbon_kg}
              <span className="text-2xl text-slate-400"> kg</span>
            </div>
            <span className="text-xs text-slate-500">CO₂e</span>
          </div>

          {activeStage && (
            <div className="rounded-xl p-4 border border-teal-200 bg-teal-50">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-teal-600 mt-1">{(STAGE_META[activeStage.stage] ?? STAGE_META.materials).cardIcon}</div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-900 mb-1">{activeStage.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{activeStage.description}</p>
                </div>
                {selectedHotspot && (
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-slate-500 hover:text-slate-700 transition"
                    aria-label="Đóng chi tiết"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {activeStage.metrics && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-teal-200">
                  {activeStage.metrics.score !== undefined && (
                    <div>
                      <span className="text-xs text-slate-500 block">Score</span>
                      <span className={`text-xl font-bold ${getScoreColor(activeStage.metrics.score)}`}>
                        {activeStage.metrics.score}
                      </span>
                    </div>
                  )}
                  {activeStage.metrics.carbon_kg !== undefined && (
                    <div>
                      <span className="text-xs text-slate-500 block">Carbon</span>
                      <span className="text-xl font-bold text-orange-600">
                        {activeStage.metrics.carbon_kg} kg
                      </span>
                    </div>
                  )}
                  {activeStage.metrics.details && (
                    <div className="col-span-3">
                      <span className="text-xs text-slate-500 block mb-1">Details</span>
                      <span className="text-xs text-slate-600">{activeStage.metrics.details}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Mẹo: Dùng chuột để xoay/zoom mô hình. Nhấn “Mở rộng” để xem toàn màn hình hơn hoặc “Xem AR” trên thiết bị hỗ trợ.
          </div>
        </aside>
      </div>

      {/* Claims (full width) */}
      <div className="rounded-2xl p-4 border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-teal-600">Environmental Claims</h3>
        {product.claims.length > 0 ? (
          <div className="space-y-3">
            {product.claims.map((claim, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  claim.verified
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {claim.verified ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-1">{claim.value}</p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        Type: <span className="text-slate-700">{claim.type}</span>
                      </p>
                      {claim.verifier && (
                        <p>
                          Verifier: <span className="text-slate-700">{claim.verifier}</span>
                        </p>
                      )}
                      {claim.evidence_url && (
                        <a
                          href={claim.evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 transition"
                        >
                          Evidence <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      claim.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {claim.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No claims available</p>
        )}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong> GreenScore và Carbon Footprint là ước tính (v1.0) dựa trên rule-based model {product.scoring_version}. Không thay thế kiểm toán độc lập hoặc chứng nhận bên thứ ba.
          </p>
        </div>
      </div>
    </div>
  );
}
