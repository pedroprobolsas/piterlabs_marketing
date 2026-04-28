import { useRef, useState } from 'react';
import { Upload, ImageIcon, VideoIcon, X } from 'lucide-react';

export default function MediaUpload({ media, onMediaChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return;
    const url = URL.createObjectURL(file);
    onMediaChange({ url, type: isImage ? 'image' : 'video', name: file.name, file });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleClear = () => {
    if (media?.url) URL.revokeObjectURL(media.url);
    onMediaChange(null);
  };

  return (
    <div className="bg-white border border-border rounded-[14px] p-[20px_22px]">
      <label className="font-jetbrains text-[0.7rem] text-text2 uppercase tracking-[1.5px] font-bold block mb-[12px]">
        Archivo de Media
      </label>

      {media ? (
        <div className="flex items-center gap-[10px] bg-bg-soft border border-border rounded-[10px] p-[10px_14px]">
          {media.type === 'image'
            ? <ImageIcon size={16} className="text-magenta shrink-0" />
            : <VideoIcon size={16} className="text-violet shrink-0" />}
          <span className="font-jetbrains text-[0.68rem] text-text-main flex-1 truncate">{media.name}</span>
          <button
            onClick={handleClear}
            className="text-muted hover:text-magenta transition-colors cursor-pointer"
            title="Quitar archivo"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[12px] p-[28px_20px] flex flex-col items-center gap-[8px] cursor-pointer transition-all
            ${dragging
              ? 'border-magenta bg-magenta/5'
              : 'border-border hover:border-magenta/50 hover:bg-bg-soft'}`}
        >
          <Upload size={22} className={dragging ? 'text-magenta' : 'text-muted'} />
          <div className="font-jetbrains text-[0.68rem] text-muted text-center leading-relaxed">
            Arrastra una foto o video<br />
            <span className="text-magenta">o haz clic para seleccionar</span>
          </div>
          <div className="font-jetbrains text-[0.58rem] text-muted/60">
            JPG, PNG, MP4, MOV
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
