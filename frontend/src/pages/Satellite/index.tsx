import { useQuery } from '@tanstack/react-query';
import { getSatelliteDetections } from '../../api/satellite';
import { PageHeader, LoadingSkeleton, EmptyState } from '../../components/ui/SharedUI';
import { formatTimeAgo, formatCoordinates } from '../../utils/formatters';
import { Satellite as SatIcon, Eye, MapPin, Maximize2, Radio, Target, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function SatelliteView() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: satDetections = [], isLoading } = useQuery({
    queryKey: ['satellite'],
    queryFn: getSatelliteDetections
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Satellite Reconnaissance"
          subtitle={`${satDetections.length} orbital detection feeds across maritime surveillance grid`}
        />

        <div className="flex items-center gap-3 px-4 py-2 bg-bg-surface border border-bg-border rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-status-danger animate-pulse" />
          <Radio className="w-3.5 h-3.5 text-status-danger" />
          <span className="text-[10px] font-black text-text-primary tracking-[0.2em] uppercase">Orbital_Feed: Active</span>
          <div className="w-px h-4 bg-bg-border mx-1" />
          <span className="text-[10px] font-mono text-text-muted font-bold uppercase">SAT-4A / SAT-7B</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-bg-surface/50 border border-bg-border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-status-danger/10 border border-status-danger/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-status-danger" />
          </div>
          <div>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Total Detections</p>
            <p className="text-lg font-black font-mono text-text-primary">{satDetections.length}</p>
          </div>
        </div>
        <div className="w-px h-10 bg-bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-accent-glow border border-accent-primary/20 flex items-center justify-center">
            <SatIcon className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Sensor Mode</p>
            <p className="text-xs font-black text-accent-primary uppercase tracking-wider">Multi-Spectral Imaging</p>
          </div>
        </div>
        <div className="w-px h-10 bg-bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-status-safe/10 border border-status-safe/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-status-safe" />
          </div>
          <div>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Resolution</p>
            <p className="text-xs font-black text-status-safe uppercase tracking-wider">0.5m GSD</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      ) : satDetections.length === 0 ? (
        <EmptyState message="No orbital detections in current sweep window" icon={<SatIcon className="w-16 h-16 text-accent-primary/10" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {satDetections.map((det, i) => {
              const [lon, lat] = det.geometry.coordinates;
              const isSelected = selectedId === det.id;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  key={det.id}
                  onClick={() => setSelectedId(isSelected ? null : det.id)}
                  className={clsx(
                    "rounded-lg border overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] group glass-panel",
                    isSelected
                      ? "border-accent-primary/50 shadow-[0_0_25px_rgba(0,212,255,0.15)]"
                      : "border-bg-border hover:border-text-muted"
                  )}
                >
                  {/* Satellite Image Area */}
                  <div className="relative h-44 bg-bg-base overflow-hidden">
                    {/* Simulated satellite imagery */}
                    <div className="absolute inset-0 grid-pattern" />
                    <div className="absolute inset-0" style={{
                      background: `
                        radial-gradient(ellipse at ${30 + (i * 17) % 40}% ${35 + (i * 11) % 30}%, rgba(0,212,255,0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at ${60 + (i * 7) % 30}% ${50 + (i * 13) % 30}%, rgba(255,51,102,0.06) 0%, transparent 40%)
                      `,
                    }} />

                    {/* Radar grid lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border border-accent-primary/10" />
                      <div className="absolute w-20 h-20 rounded-full border border-accent-primary/10" />
                      <div className="absolute w-44 h-44 rounded-full border border-accent-primary/5" />
                    </div>

                    {/* Detection marker */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-status-danger shadow-[0_0_12px_rgba(255,51,102,0.6)]" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-status-danger animate-ping opacity-50" />
                      </div>
                    </div>

                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-px h-full bg-accent-primary" />
                      <div className="absolute w-full h-px bg-accent-primary" />
                    </div>

                    {/* Top bar */}
                    <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg-base/80 border border-bg-border backdrop-blur-sm">
                        <Eye className="w-3 h-3 text-status-danger" />
                        <span className="text-[9px] font-black text-status-danger uppercase tracking-widest">SAT_DETECT</span>
                      </div>
                      <div className="p-1.5 rounded bg-bg-base/80 border border-bg-border backdrop-blur-sm group-hover:border-accent-primary/50 transition-colors">
                        <Maximize2 className="w-3 h-3 text-text-muted group-hover:text-accent-primary transition-colors" />
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg-base/90 to-transparent">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-text-muted uppercase">FRAME_{String(det.id).padStart(4, '0')}</span>
                        <span className="text-[9px] font-mono font-bold text-accent-primary">{formatTimeAgo(det.properties.timestamp)}</span>
                      </div>
                    </div>

                    {/* Selected glow */}
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-accent-primary/40 rounded-t-lg pointer-events-none" />
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="p-4 space-y-3 bg-bg-surface">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-status-danger" />
                        <span className="text-xs font-black text-text-primary font-mono tracking-tight">{det.properties.mmsi}</span>
                      </div>
                      <span className={clsx(
                        "text-[9px] font-black px-2 py-0.5 rounded border tracking-widest",
                        "bg-status-danger/5 border-status-danger/20 text-status-danger"
                      )}>
                        SATELLITE
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted font-bold">
                      <MapPin className="w-3 h-3 text-accent-primary" />
                      {formatCoordinates(lat, lon)}
                    </div>

                    {det.properties.eta_minutes && (
                      <div className="flex items-center justify-between p-2.5 rounded bg-bg-base border border-bg-border/50">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">ETA Predicted</span>
                        <span className="text-sm font-black font-mono text-accent-primary">{Math.round(det.properties.eta_minutes)} min</span>
                      </div>
                    )}

                    {/* Expanded details when selected */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-3 border-t border-bg-border space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-bg-base border border-bg-border/50">
                                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Source</p>
                                <p className="text-[10px] font-black text-text-primary">ORBITAL-SAT-4A</p>
                              </div>
                              <div className="p-2 rounded bg-bg-base border border-bg-border/50">
                                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">Confidence</p>
                                <p className="text-[10px] font-black text-status-safe">94.2%</p>
                              </div>
                            </div>
                            <button className="w-full py-2 bg-accent-primary/10 border border-accent-primary/20 rounded text-[9px] font-black text-accent-primary uppercase tracking-widest hover:bg-accent-primary/20 transition-all">
                              [INVESTIGATE_VECTOR]
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
