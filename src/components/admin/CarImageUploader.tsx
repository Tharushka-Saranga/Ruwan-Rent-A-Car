import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface CarImageUploaderProps {
  primaryImage: string;
  images: string[];
  onChange: (primaryImage: string, images: string[]) => void;
}

export const CarImageUploader: React.FC<CarImageUploaderProps> = ({
  primaryImage,
  images,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const currentImages: string[] = React.useMemo(() => {
    const list = Array.isArray(images) ? [...images] : [];
    if (primaryImage && !list.includes(primaryImage)) {
      list.unshift(primaryImage);
    }
    return list;
  }, [images, primaryImage]);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      throw new Error(`"${file.name}" has an unsupported format. Please upload JPG, PNG, WEBP, or AVIF.`);
    }

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`"${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 15MB.`);
    }

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsDataURL(file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          data: base64Data,
          type: file.type,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.url;
      }
    } catch {
      // Fallback to client base64 data URL
    }

    return base64Data;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(10);

    try {
      const uploadedUrls: string[] = [];
      const total = fileArray.length;

      for (let i = 0; i < total; i++) {
        const file = fileArray[i];
        const url = await uploadSingleFile(file);
        uploadedUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / total) * 90) + 10);
      }

      if (replacingIndex !== null) {
        const updated = [...currentImages];
        const newUrl = uploadedUrls[0];
        const wasPrimary = updated[replacingIndex] === primaryImage;
        updated[replacingIndex] = newUrl;
        const newPrimary = wasPrimary ? newUrl : primaryImage || newUrl;
        onChange(newPrimary, updated);
        setReplacingIndex(null);
        setSuccessMessage('Vehicle image successfully replaced!');
      } else {
        const updated = [...currentImages, ...uploadedUrls];
        const newPrimary = primaryImage || uploadedUrls[0] || '';
        onChange(newPrimary, updated);
        setSuccessMessage(`Successfully uploaded ${uploadedUrls.length} vehicle image${uploadedUrls.length > 1 ? 's' : ''}!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    } finally {
      setTimeout(() => setUploadProgress(null), 600);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (url: string) => {
    onChange(url, currentImages);
    setSuccessMessage('Main display image updated.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const targetUrl = currentImages[indexToRemove];
    const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
    let newPrimary = primaryImage;
    if (primaryImage === targetUrl) {
      newPrimary = updated.length > 0 ? updated[0] : '';
    }
    onChange(newPrimary, updated);
  };

  const triggerReplace = (index: number) => {
    setReplacingIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    const updated = [...currentImages, url];
    const newPrimary = primaryImage || url;
    onChange(newPrimary, updated);
    setUrlInput('');
    setShowUrlInput(false);
    setSuccessMessage('Image added to vehicle gallery!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-zinc-300 font-semibold text-xs flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vehicle Images (Drag & Drop or Choose Files)</span>
        </label>
        <span className="text-[11px] text-zinc-400">
          {currentImages.length} {currentImages.length === 1 ? 'image' : 'images'} added
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={replaceInputRef}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01] shadow-lg shadow-emerald-950/50'
            : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/60 hover:bg-zinc-900/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/20 scale-110'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isDragging ? 'Drop car images right here' : 'Drag & drop car photos here, or browse'}
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Supports high-resolution JPG, PNG, WEBP, and AVIF up to 15MB each.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-semibold border border-zinc-700 shadow-sm pointer-events-auto min-h-[36px]"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select from Computer
          </button>
        </div>

        {uploadProgress !== null && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 space-y-3 z-10">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-xs text-zinc-300 font-mono">
                <span>Saving to storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-0.5">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-zinc-400 hover:text-emerald-400 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer min-h-[32px]"
        >
          <ExternalLink className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide link input' : 'Or add image via web link / CDN URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
          <input
            type="url"
            placeholder="Paste image URL (e.g. https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Add Image
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {currentImages.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Vehicle Gallery ({currentImages.length})</span>
            <span className="text-[11px] text-zinc-500">Star = main display photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentImages.map((url, idx) => {
              const isMain = url === primaryImage || (idx === 0 && !primaryImage);
              return (
                <div
                  key={`${url}-${idx}`}
                  className={`group relative rounded-xl overflow-hidden border bg-zinc-950 aspect-4/3 transition-all ${
                    isMain
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Car preview ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=75&fm=webp';
                    }}
                  />
                  {isMain && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Main Photo</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 sm:bg-black/75 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-1">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(url)}
                          className="p-1.5 rounded-lg bg-zinc-800/90 hover:bg-emerald-600 text-zinc-200 hover:text-white transition-colors cursor-pointer"
                          title="Set as Main"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => triggerReplace(idx)}
                        className="p-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors cursor-pointer"
                        title="Replace"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-lg bg-red-950/90 hover:bg-red-600 text-red-200 hover:text-white transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
