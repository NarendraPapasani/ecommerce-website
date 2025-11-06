import React, { useRef, useState } from "react";

export default function ImageUploader({
  onFilesSelected,
  images = [],
  onRemove,
  disabled,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    onFilesSelected && onFilesSelected(arr);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dt = e.dataTransfer;
    handleFiles(dt.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div>
      <div
        className={`w-full border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-150 cursor-pointer ${
          dragging
            ? "border-blue-500 bg-blue-900/30"
            : "border-zinc-700 bg-zinc-800/40"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
        onClick={() => inputRef.current && inputRef.current.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <p className="text-sm text-white">
          Drag & drop images here, or click to select files
        </p>
        <p className="text-xs text-white/70 mt-1">Max 5MB per image</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {images && images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`img-${i}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onRemove && onRemove(i);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
