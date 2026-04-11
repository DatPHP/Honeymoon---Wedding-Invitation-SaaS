import { useState, useRef } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = 'Ảnh (URL)', className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs text-slate-400 font-semibold">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            // Reset input so the same file could be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition-colors"
          type="button"
          title="Tải ảnh lên hệ thống"
        >
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {isUploading ? 'Đang tải...' : 'Tải lên'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
