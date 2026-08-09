import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/** Full-screen pan / pinch / wheel zoom image viewer. */
export function ZoomViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stateRef = useRef({ zoom, offset });
  stateRef.current = { zoom, offset };

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; zoom: number; cx: number; cy: number } | null>(null);

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const zoomAt = useCallback((next: number, px: number, py: number) => {
    const { zoom: z, offset: o } = stateRef.current;
    const clamped = clamp(next, MIN_ZOOM, MAX_ZOOM);
    const k = clamped / z;
    const nx = px - (px - o.x) * k;
    const ny = py - (py - o.y) * k;
    setZoom(clamped);
    setOffset(clamped === 1 ? { x: 0, y: 0 } : { x: nx, y: ny });
  }, []);

  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const { zoom: z } = stateRef.current;
      zoomAtRef.current(z * Math.exp(-dy * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (a && b) {
        pinchRef.current = {
          dist: Math.hypot(a.x - b.x, a.y - b.y),
          zoom: stateRef.current.zoom,
          cx: (a.x + b.x) / 2,
          cy: (a.y + b.y) / 2,
        };
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - (rect?.left ?? 0);
      const cy = (a.y + b.y) / 2 - (rect?.top ?? 0);
      zoomAt((pinchRef.current.zoom * dist) / pinchRef.current.dist, cx, cy);
      return;
    }

    if (pointers.current.size === 1 && stateRef.current.zoom > 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
  };

  const center = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    return { x: (rect?.width ?? 0) / 2, y: (rect?.height ?? 0) / 2 };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground/95">
      <div className="flex items-center justify-between gap-2 p-3">
        <Button variant="secondary" size="icon" aria-label="بستن" onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="بزرگ‌نمایی"
            onClick={() => {
              const c = center();
              zoomAt(stateRef.current.zoom * 1.4, c.x, c.y);
            }}
          >
            <Plus className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="کوچک‌نمایی"
            onClick={() => {
              const c = center();
              zoomAt(stateRef.current.zoom / 1.4, c.x, c.y);
            }}
          >
            <Minus className="h-5 w-5" aria-hidden />
          </Button>
          <Button variant="secondary" size="icon" aria-label="بازنشانی" onClick={reset}>
            <RotateCcw className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 touch-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          const px = e.clientX - (rect?.left ?? 0);
          const py = e.clientY - (rect?.top ?? 0);
          zoomAt(stateRef.current.zoom > 1.2 ? 1 : 2.5, px, py);
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute left-0 top-0 h-full w-full select-none object-contain"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        />
      </div>

      <p className="flex items-center justify-center gap-2 p-3 text-xs text-background">
        <Maximize2 className="h-4 w-4" aria-hidden />
        برای بزرگ‌نمایی دو انگشتی یا دابل‌تپ کنید
      </p>
    </div>
  );
}
