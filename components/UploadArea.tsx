
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface UploadAreaProps {
  id: string;
  onImageUpload: (file: File) => void;
  previewSrc: string | null;
  mainText: string;
  subText?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ id, onImageUpload, previewSrc, mainText, subText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-lime-500');
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-lime-500');
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-lime-500');
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div
      className="upload-area relative w-full h-32 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-gray-600 transition-colors duration-200"
      onClick={handleAreaClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {previewSrc ? (
        <img src={previewSrc} alt="Preview" id={`${id}Preview`} className="image-preview absolute inset-0 w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <UploadIcon />
          <span className="mt-2 font-semibold">{mainText}</span>
          {subText && <span className="upload-text text-xs">{subText}</span>}
        </div>
      )}
    </div>
  );
};

export default UploadArea;
