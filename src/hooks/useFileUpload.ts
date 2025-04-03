import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseFileUploadProps {
  accept: string;
  maxSize: number;
  onChange: (url: string) => void;
  onError: (error: string) => void;
}

export function useFileUpload({ accept, maxSize, onChange, onError }: UseFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const fileType = file.type;
    if (!accept.split(',').some(type => fileType.match(type.trim()))) {
      onError('Invalid file type');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('gig-uploads')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gig-uploads')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    isUploading,
    progress
  };
}