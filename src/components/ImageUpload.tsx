import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Link } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>(value?.startsWith('data:') ? 'upload' : 'url');
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      // Resize image to reduce storage size
      const resized = await resizeImage(dataUrl, 800, 600);
      setPreview(resized);
      onChange(resized);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'url'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'upload'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>

      {/* URL Mode */}
      {mode === 'url' && (
        <input
          type="url"
          value={preview.startsWith('data:') ? '' : preview}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-white font-medium">Drop image here or click to upload</p>
                <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, GIF, WebP (max 5MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative rounded-xl overflow-hidden border border-white/10"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {preview.startsWith('data:') && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-gray-300">
                Uploaded image ({Math.round(preview.length * 0.75 / 1024)} KB)
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
