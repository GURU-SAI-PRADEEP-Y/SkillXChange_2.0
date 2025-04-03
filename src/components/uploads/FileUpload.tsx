import React from 'react';
import { Upload, X } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';

interface FileUploadProps {
  accept: string;
  value?: string;
  onChange: (url: string) => void;
  onError: (error: string) => void;
  maxSize?: number; // in MB
  label: string;
}

export function FileUpload({ accept, value, onChange, onError, maxSize = 5, label }: FileUploadProps) {
  const { 
    isDragging, 
    handleDragEnter, 
    handleDragLeave, 
    handleDrop, 
    handleFileSelect,
    isUploading,
    progress
  } = useFileUpload({
    accept,
    maxSize,
    onChange,
    onError
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {value ? (
        <div className="relative rounded-lg border-2 border-gray-300 p-4">
          {accept.includes('image') ? (
            <img src={value} alt="Preview" className="w-full h-48 object-cover rounded" />
          ) : (
            <video src={value} className="w-full h-48 object-cover rounded" controls />
          )}
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Upload a file
              </span>{' '}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              {accept.split(',').join(', ')} up to {maxSize}MB
            </p>
          </div>
          
          {isUploading && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}