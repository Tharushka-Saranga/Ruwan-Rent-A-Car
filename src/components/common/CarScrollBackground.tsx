import React, { useEffect, useRef, useState, useCallback } from 'react';
import JSZip from 'jszip';
import {
  Upload,
  CheckCircle2,
  Film,
  Sliders,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  saveZipToIndexedDB,
  getZipFromIndexedDB,
  clearZipFromIndexedDB,
} from '../../utils/frameStorage';

interface CarScrollBackgroundProps {
  className?: string;
  showEngineControls?: boolean;
}

const SETTINGS_KEY = 'ruwan_scroll_animation_settings';

export const CarScrollBackground: React.FC<CarScrollBackgroundProps> = ({
  className = '',
  showEngineControls = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved settings from localStorage
  const savedSettings = useRef<{ backgroundDim?: number; activeFileName?: string } | null>(null);
  if (savedSettings.current === null && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) savedSettings.current = JSON.parse(raw);
    } catch {}
  }

  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(
    savedSettings.current?.activeFileName || 'ezgif-1e2ea1fba47432e6-jpg'
  );
  const [isProcessingZip, setIsProcessingZip] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(false);

  // Persisted contrast / dim level
  const [backgroundDim, setBackgroundDim] = useState<number>(
    typeof savedSettings.current?.backgroundDim === 'number'
      ? savedSettings.current.backgroundDim
      : 0.55
  );
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);
  const [loadedFrameCount, setLoadedFrameCount] = useState<number>(0);

  // Debug toggle (e.g. Alt+E or ?show_engine=1 in URL)
  const [isDebugEngineVisible, setIsDebugEngineVisible] = useState<boolean>(() => {
    if (showEngineControls) return true;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('engine') === 'true' || urlParams.get('show_engine') === '1';
    }
    return false;
  });

  // Save current settings to localStorage whenever changed
  useEffect(() => {
    try {
      const settingsPayload = {
        backgroundDim,
        activeFileName: activeFileName || 'ezgif-1e2ea1fba47432e6-jpg',
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsPayload));
    } catch {}
  }, [backgroundDim, activeFileName]);

  // Keyboard shortcut (Alt+E) to toggle engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        setIsDebugEngineVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Performance-optimized references
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastRenderedIndexRef = useRef<number>(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);

  // 1. Core Frame Rendering to Canvas - Optimized for high 60fps & low memory
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Clamp DPR to prevent mobile texture overload (max 1.5x on retina)
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const targetPixelW = Math.round(width * dpr);
      const targetPixelH = Math.round(height * dpr);

      if (canvas.width !== targetPixelW || canvas.height !== targetPixelH) {
        canvas.width = targetPixelW;
        canvas.height = targetPixelH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep dark base
      ctx.fillStyle = '#020302';
      ctx.fillRect(0, 0, width, height);

      // Look up target frame or nearest loaded frame
      const images = imagesRef.current;
      let img = images[frameIndex];
      if (!img && images.length > 0) {
        for (let offset = 1; offset < images.length; offset++) {
          if (frameIndex - offset >= 0 && images[frameIndex - offset]) {
            img = images[frameIndex - offset];
            break;
          }
          if (frameIndex + offset < images.length && images[frameIndex + offset]) {
            img = images[frameIndex + offset];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        const naturalW = img.naturalWidth || 1600;
        const naturalH = img.naturalHeight || 900;
        const scale = Math.max(width / naturalW, height / naturalH);
        const drawW = naturalW * scale;
        const drawH = naturalH * scale;
        const drawX = (width - drawW) / 2;
        const drawY = (height - drawH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      ctx.restore();
      lastRenderedIndexRef.current = frameIndex;
    },
    []
  );

  // 2. Load Frame URLs with Progressive Preloading
  useEffect(() => {
    if (frameUrls.length === 0) {
      imagesRef.current = [];
      setLoadedFrameCount(0);
      return;
    }

    let isMounted = true;
    imagesRef.current = new Array(frameUrls.length).fill(null);
    let loaded = 0;

    // Load key frames first (first 5 and last frame), then the rest
    const loadIndices = Array.from({ length: frameUrls.length }, (_, i) => i);
    // Sort so frame 0, 1, 2, 3 load first
    loadIndices.sort((a, b) => {
      if (a < 5 && b >= 5) return -1;
      if (b < 5 && a >= 5) return 1;
      return a - b;
    });

    loadIndices.forEach((index) => {
      const url = frameUrls[index];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.src = url;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[index] = img;
        loaded++;
        setLoadedFrameCount(loaded);
        if (index === 0 || lastRenderedIndexRef.current === -1) {
          renderFrame(0);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedFrameCount(loaded);
      };
    });

    return () => {
      isMounted = false;
    };
  }, [frameUrls, renderFrame]);

  // 3. Process Zip Extraction
  const processZipFile = async (file: Blob, fileName: string) => {
    try {
      setIsProcessingZip(true);
      setErrorMsg(null);
      setActiveFileName(fileName);
      const zip = await JSZip.loadAsync(file);
      const entries: { name: string; file: JSZip.JSZipObject }[] = [];
      zip.forEach((relPath, entry) => {
        if (!entry.dir && !relPath.includes('__MACOSX') && !entry.name.startsWith('.')) {
          if (/\.(jpe?g|png|webp|avif|svg)$/i.test(entry.name)) {
            entries.push({ name: entry.name, file: entry });
          }
        }
      });
      if (entries.length === 0) {
        throw new Error('No image frames (.jpg, .png, .webp) found in this zip file.');
      }
      entries.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );
      const blobUrls: string[] = [];
      for (const entry of entries) {
        const blob = await entry.file.async('blob');
        const url = URL.createObjectURL(blob);
        blobUrls.push(url);
      }
      await saveZipToIndexedDB(file, fileName);
      try {
        fetch('/api/upload-frames-zip', {
          method: 'POST',
          body: file,
          headers: { 'Content-Type': 'application/zip' },
        }).catch(() => {});
      } catch {}
      setFrameUrls(blobUrls);
      setIsCustomLoaded(true);
      targetFrameRef.current = 0;
      currentFrameRef.current = 0;
      lastRenderedIndexRef.current = -1;
      setToastMessage(`Activated ${entries.length} scroll frames from "${fileName}"!`);
      setTimeout(() => setToastMessage(null), 5000);
      wakeAnimationLoop();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract images from zip file.');
    } finally {
      setIsProcessingZip(false);
    }
  };

  // 4. Initial Bootstrap: IndexedDB -> /api/frames
  useEffect(() => {
    let isMounted = true;
    async function initFrames() {
      try {
        const cached = await getZipFromIndexedDB();
        if (cached && isMounted) {
          await processZipFile(cached.blob, cached.name);
          return;
        }
      } catch {}
      try {
        const res = await fetch('/api/frames');
        if (res.ok) {
          const data = await res.json();
          if (data.frames && data.frames.length > 0 && isMounted) {
            setFrameUrls(data.frames);
            setActiveFileName('ezgif-1e2ea1fba47432e6-jpg (default sequence)');
            return;
          }
        }
      } catch {}
      if (isMounted) {
        setFrameUrls([]);
      }
    }
    initFrames();
    return () => {
      isMounted = false;
    };
  }, []);

  // 5. Intelligent Sleep/Wake Animation Loop (0% idle CPU!)
  const wakeAnimationLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    let isReducedMotion = false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const tick = () => {
      const maxCount = frameUrls.length > 0 ? frameUrls.length - 1 : 59;
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (isReducedMotion) {
        currentFrameRef.current = targetFrameRef.current;
      } else if (Math.abs(diff) > 0.05) {
        // High-responsiveness smoothing lerp
        currentFrameRef.current += diff * 0.28;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const safeIndex = Math.min(
        Math.max(Math.round(currentFrameRef.current), 0),
        maxCount
      );

      if (safeIndex !== lastRenderedIndexRef.current) {
        setCurrentFrameIndex(safeIndex);
        renderFrame(safeIndex);
      }

      // Check if settled to sleep loop
      if (Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.01) {
        currentFrameRef.current = targetFrameRef.current;
        isLoopRunningRef.current = false;
        animFrameIdRef.current = null;
        return; // SLEEP: stop looping when at rest!
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
  }, [frameUrls.length, renderFrame]);

  // 6. Window Scroll Listener with Passive Throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          const totalScrollableDistance =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalScrollableDistance > 0) {
            const rawProgress = Math.max(0, Math.min(1, scrollY / totalScrollableDistance));
            setScrollProgress(rawProgress);
            const maxCount = frameUrls.length > 0 ? frameUrls.length - 1 : 59;
            targetFrameRef.current = Math.floor(rawProgress * maxCount);
            wakeAnimationLoop();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [frameUrls.length, wakeAnimationLoop]);

  // 7. Window-Level Drag & Drop Support
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const onDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsDragOver(false);
      }
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.zip') || file.type.includes('zip')) {
          processZipFile(file, file.name);
        }
      }
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  const handleResetToDefault = async () => {
    await clearZipFromIndexedDB();
    setIsCustomLoaded(false);
    try {
      const res = await fetch('/api/frames');
      if (res.ok) {
        const data = await res.json();
        if (data.frames && data.frames.length > 0) {
          setFrameUrls(data.frames);
          setActiveFileName('ezgif-1e2ea1fba47432e6-jpg (default sequence)');
        }
      }
    } catch {}
    setToastMessage('Reset to default cinematic scroll animation.');
    setTimeout(() => setToastMessage(null), 3500);
    wakeAnimationLoop();
  };

  return (
    <>
      {/* Pinned Fullscreen Background Canvas */}
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block will-change-transform"
        />

        {/* High-Performance GPU-Composited Scrim Overlays (Replaces 2D Canvas per-frame gradients) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,${backgroundDim * 0.2}) 0%, rgba(0,0,0,${backgroundDim * 0.65}) 50%, rgba(0,0,0,${Math.min(0.96, backgroundDim + 0.28)}) 100%)`,
          }}
        />
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/95 to-transparent pointer-events-none" />
      </div>

      {/* Fullscreen Drag & Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-emerald-500 m-4 rounded-3xl pointer-events-none animate-in fade-in duration-200">
          <div className="p-6 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
            <Upload className="w-12 h-12" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Drop ezgif-1e2ea1fba47432e6-jpg.zip Here</h3>
          <p className="text-sm text-zinc-300">
            Drop your zip file to activate the custom scrolling drive sequence!
          </p>
        </div>
      )}

      {/* Floating Scroll Animation Engine Controls (Toggleable via Alt+E) */}
      {isDebugEngineVisible && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/15 px-3.5 py-2 rounded-2xl shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Film className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>ezgif Scroll Animation</span>
                {isCustomLoaded && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px]">
                    Custom Active
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Frame {currentFrameIndex + 1}/{frameUrls.length || 60} · {Math.round(scrollProgress * 100)}% Scroll
              </span>
            </div>
            <div className="h-4 w-px bg-white/15 mx-1" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Upload ezgif zip file"
            >
              <Upload className="w-3 h-3" aria-hidden="true" />
              <span>Upload Zip</span>
            </button>
            <button
              onClick={() => setIsControlsOpen(!isControlsOpen)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Animation Options"
            >
              <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsDebugEngineVisible(false)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Hide Engine Controls"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Expanded Drawer */}
          {isControlsOpen && (
            <div className="w-72 bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Scroll Engine Settings</span>
                </span>
                <button
                  onClick={() => setIsControlsOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Active Archive</span>
                <p className="text-xs font-mono text-emerald-300 truncate font-bold">
                  {activeFileName || 'ezgif-1e2ea1fba47432e6-jpg'}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                  <span>Loaded: {loadedFrameCount}/{frameUrls.length} frames</span>
                  <span>Battery Saver Active</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-300">Background Contrast / Dim</span>
                  <span className="font-mono text-zinc-400">{Math.round(backgroundDim * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.85"
                  step="0.05"
                  value={backgroundDim}
                  onChange={(e) => setBackgroundDim(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingZip}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isProcessingZip ? 'Extracting...' : 'Select Zip File'}</span>
                </button>
                {isCustomLoaded && (
                  <button
                    onClick={handleResetToDefault}
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
                    title="Reset to default sequence"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/95 border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="fixed top-20 right-6 z-50 bg-red-950/95 border border-red-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <span className="text-xs font-semibold">{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-zinc-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessingZip && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-white">
            Unpacking ezgif drive animation frames...
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processZipFile(e.target.files[0], e.target.files[0].name);
          }
        }}
      />
    </>
  );
};
