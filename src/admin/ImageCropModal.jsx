import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "../components";

// Aspect ratio preset choices matching exact application display frames
const PRESETS = [
  { id: "4-5", label: "4:5 (Profil Hero)", ratio: 4 / 5 },
  { id: "16-10", label: "16:10 (Proyek)", ratio: 16 / 10 },
  { id: "16-9", label: "16:9 (Dokumentasi)", ratio: 16 / 9 },
  { id: "1-1", label: "1:1 (Persegi)", ratio: 1 / 1 },
  { id: "4-3", label: "4:3 (Standar)", ratio: 4 / 3 },
  { id: "free", label: "Asli (Penuh)", ratio: null },
];

// Interactive image cropper modal component
export default function ImageCropModal({
  file,
  aspectRatio = 16 / 9,
  title = "Sesuaikan & Potong Foto",
  description = "Geser dan atur perbesaran foto sesuai frame tampilan.",
  onConfirm,
  onCancel,
}) {
  const containerRef = useRef(null);
  const imgWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [activeRatio, setActiveRatio] = useState(aspectRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    typeof file === "string" ? file : null
  );
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pendingPanRef = useRef({ x: 0, y: 0 });
  const pendingZoomRef = useRef(1);
  const [containerSize, setContainerSize] = useState({ width: 500, height: 350 });

  // Keep pendingZoomRef synced
  useEffect(() => {
    pendingZoomRef.current = zoom;
  }, [zoom]);

  // Read file or URL as persistent Data URL to prevent revocation issues
  useEffect(() => {
    let isSubscribed = true;
    if (!file) return;

    if (typeof file === "string") {
      if (file.startsWith("http")) {
        fetch(file)
          .then((res) => res.blob())
          .then((blob) => {
            if (!isSubscribed) return;
            const reader = new FileReader();
            reader.onload = () => {
              if (isSubscribed && typeof reader.result === "string") {
                setImageSrc(reader.result);
              }
            };
            reader.readAsDataURL(blob);
          })
          .catch(() => {
            // Keep default imageSrc
          });
      }
      return;
    }

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isSubscribed && typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    return () => {
      isSubscribed = false;
    };
  }, [file]);

  // Track container dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Compute crop box dimensions based on chosen ratio
  const getCropBoxSize = useCallback(() => {
    const maxW = Math.max(containerSize.width - 48, 120);
    const maxH = Math.max(containerSize.height - 48, 120);

    const effectiveRatio =
      activeRatio !== null
        ? activeRatio
        : naturalSize.width / naturalSize.height;

    let w = maxW;
    let h = w / effectiveRatio;

    if (h > maxH) {
      h = maxH;
      w = h * effectiveRatio;
    }

    return { width: Math.round(w), height: Math.round(h) };
  }, [containerSize, activeRatio, naturalSize]);

  const cropBox = getCropBoxSize();

  // Compute base display dimensions that cover crop box at 1x
  const scaleToCover = Math.max(
    cropBox.width / naturalSize.width,
    cropBox.height / naturalSize.height
  );
  const baseW = naturalSize.width * scaleToCover;
  const baseH = naturalSize.height * scaleToCover;

  // Pointer drag event handlers for mouse and touch
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsTransitioning(false);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    pendingPanRef.current = { x: pan.x, y: pan.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const nextPanX = dragStartRef.current.panX + dx;
    const nextPanY = dragStartRef.current.panY + dy;
    pendingPanRef.current = { x: nextPanX, y: nextPanY };

    if (imgWrapperRef.current) {
      imgWrapperRef.current.style.transform = `translate3d(${nextPanX}px, ${nextPanY}px, 0px) scale(${pendingZoomRef.current}) rotate(${rotation}deg)`;
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setPan(pendingPanRef.current);
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture errors
      }
    }
  };

  // Silky smooth wheel and trackpad pinch zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    setIsTransitioning(false);
    const zoomFactor = 1 - Math.min(Math.max(e.deltaY * 0.002, -0.12), 0.12);
    const targetZoom = Math.min(
      Math.max(pendingZoomRef.current * zoomFactor, 1),
      3
    );
    const roundedZoom = Number(targetZoom.toFixed(3));
    pendingZoomRef.current = roundedZoom;
    setZoom(roundedZoom);

    if (imgWrapperRef.current) {
      imgWrapperRef.current.style.transform = `translate3d(${pendingPanRef.current.x}px, ${pendingPanRef.current.y}px, 0px) scale(${roundedZoom}) rotate(${rotation}deg)`;
    }
  };

  // Rotate 90 degrees clockwise with smooth animation
  const handleRotate = () => {
    setIsTransitioning(true);
    setRotation((prev) => (prev + 90) % 360);
    setTimeout(() => setIsTransitioning(false), 220);
  };

  // Reset positioning and zoom with smooth animation
  const handleReset = () => {
    setIsTransitioning(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    pendingPanRef.current = { x: 0, y: 0 };
    pendingZoomRef.current = 1;
    setRotation(0);
    setTimeout(() => setIsTransitioning(false), 220);
  };

  // Export cropped canvas to File and persistent Data URL
  const handleApply = async () => {
    if (isProcessing || !imageSrc) return;
    setIsProcessing(true);

    try {
      // Decode image cleanly before drawing onto canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Gagal membaca data gambar."));
        img.src = imageSrc;
      });

      const nw = img.naturalWidth || naturalSize.width;
      const nh = img.naturalHeight || naturalSize.height;
      if (nw <= 0 || nh <= 0) {
        throw new Error("Dimensi gambar belum siap.");
      }

      // High-DPI crop output capped for optimal performance & storage
      const targetW = Math.min(
        Math.max(Math.round(cropBox.width * 2), 600),
        850
      );
      const targetH = Math.round(targetW * (cropBox.height / cropBox.width));

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("Gagal menginisialisasi canvas.");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const S = targetW / cropBox.width;
      ctx.save();
      ctx.translate(targetW / 2 + pan.x * S, targetH / 2 + pan.y * S);
      ctx.rotate((rotation * Math.PI) / 180);

      const drawW = baseW * S * zoom;
      const drawH = baseH * S * zoom;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      const fileName =
        file && typeof file === "object" && file.name
          ? file.name.replace(/\.[^/.]+$/, "") + "-cropped.jpg"
          : "cropped-photo.jpg";

      // Convert data URL to Blob and File for cloud upload
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const croppedFile = new File([blob], fileName, { type: "image/jpeg" });

      onConfirm(croppedFile, dataUrl);
    } catch (err) {
      console.error("Gagal memotong gambar:", err);
      onConfirm(file, imageSrc);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border-2 p-5 sm:p-6 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "6px 6px 0 var(--shadow-color)",
        }}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b-2 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue)",
                  borderColor: "var(--google-blue)",
                }}
              >
                <Icon name="crop" size={15} />
              </span>
              <h3
                className="text-base sm:text-lg font-extrabold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] mt-1">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup jendela pemotong"
            className="p-1.5 rounded-lg border-2 hover:bg-[var(--surface-alt)] cursor-pointer text-[var(--ink)]"
            style={{ borderColor: "var(--border)" }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Aspect ratio selector bar */}
        <div className="mb-3">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--ink-secondary)] mb-1.5">
            Rasio Format Tampilan:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const isSelected =
                (p.ratio === null && activeRatio === null) ||
                (p.ratio !== null &&
                  Math.abs((activeRatio || 0) - p.ratio) < 0.02);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setActiveRatio(p.ratio);
                    setPan({ x: 0, y: 0 });
                    setTimeout(() => setIsTransitioning(false), 220);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono border cursor-pointer transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--google-blue)"
                      : "var(--surface-alt)",
                    color: isSelected ? "#ffffff" : "var(--ink)",
                    borderColor: isSelected
                      ? "var(--border)"
                      : "transparent",
                    boxShadow: isSelected
                      ? "2px 2px 0 var(--shadow-color)"
                      : "none",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive canvas viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-full h-[280px] sm:h-[360px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border-2 flex items-center justify-center touch-none"
          style={{
            backgroundColor: "#080c12",
            borderColor: "var(--border)",
          }}
          title="Geser gambar untuk memilih area potongan"
        >
          {/* Base image being transformed */}
          {imageSrc && (
            <div
              ref={imgWrapperRef}
              className={`absolute pointer-events-none ${
                isTransitioning ? "transition-transform duration-200 ease-out" : ""
              }`}
              style={{
                width: `${baseW}px`,
                height: `${baseH}px`,
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source preview"
                onLoad={(e) => {
                  if (e.currentTarget.naturalWidth && e.currentTarget.naturalHeight) {
                    setNaturalSize({
                      width: e.currentTarget.naturalWidth,
                      height: e.currentTarget.naturalHeight,
                    });
                  }
                }}
                className="w-full h-full object-fill select-none pointer-events-none"
                draggable={false}
              />
            </div>
          )}

          {/* Darkened mask overlay outside the crop box */}
          <div
            className="absolute pointer-events-none rounded-lg"
            style={{
              width: `${cropBox.width}px`,
              height: `${cropBox.height}px`,
              border: "2px solid #ffffff",
              boxShadow: "0 0 0 9999px rgba(8, 12, 18, 0.72)",
            }}
          >
            {/* Rule of thirds grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* Corner alignment markers */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--google-blue)]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--google-blue)]" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--google-blue)]" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--google-blue)]" />
          </div>

          {/* Interactive hint badge */}
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="neo-badge text-[10px] font-mono font-bold px-2 py-0.5 bg-black/80 text-white border border-white/20 backdrop-blur-xs">
              Tahan & Geser Foto
            </span>
          </div>
        </div>

        {/* Bottom controls: zoom slider, rotate, and reset */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsTransitioning(true);
                setZoom((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 1));
                setTimeout(() => setIsTransitioning(false), 200);
              }}
              disabled={zoom <= 1}
              aria-label="Perkecil zoom"
              className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-[var(--surface-alt)] disabled:opacity-40"
              style={{ borderColor: "var(--border)" }}
            >
              <Icon name="minus" size={14} />
            </button>

            <div className="flex items-center gap-1.5 flex-1 sm:w-36">
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => {
                  setIsTransitioning(false);
                  setZoom(parseFloat(e.target.value));
                }}
                className="w-full accent-[var(--google-blue)] cursor-pointer"
                aria-label="Tingkat perbesaran foto"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsTransitioning(true);
                setZoom((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3));
                setTimeout(() => setIsTransitioning(false), 200);
              }}
              disabled={zoom >= 3}
              aria-label="Perbesar zoom"
              className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-[var(--surface-alt)] disabled:opacity-40"
              style={{ borderColor: "var(--border)" }}
            >
              <Icon name="plus" size={14} />
            </button>

            <span className="text-xs font-mono font-bold w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate and Reset tools */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleRotate}
              className="neo-btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
            >
              <Icon name="rotate" size={13} />
              Putar 90 Deg
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="neo-btn-secondary text-xs font-bold py-1.5 px-3"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Modal actions */}
        <div className="mt-5 pt-4 border-t-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="neo-btn-secondary text-xs sm:text-sm font-bold py-2 px-4"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing}
            className="neo-btn-primary text-xs sm:text-sm font-bold py-2 px-5 flex items-center gap-1.5"
          >
            <Icon name={isProcessing ? "loader" : "check"} size={16} />
            {isProcessing ? "Menyimpan Foto..." : "Gunakan Foto Ini"}
          </button>
        </div>
      </div>
    </div>
  );
}
