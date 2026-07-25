'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Image as ImageIcon, Loader2 } from '@/constants/icons';

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  uploading: boolean;
  error?: string;
}

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept = 'image/*,.pdf,.dwg,.cdr,.ai,.eps',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  disabled,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const remaining = maxFiles - files.length;
      if (remaining <= 0) return;

      const incomingArray = Array.from(incoming);
      const newFiles = incomingArray.slice(0, remaining).map((file) => ({
        file,
        preview: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
        progress: 0,
        uploading: false,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      onUpload?.(incomingArray.slice(0, remaining));
    },
    [files.length, maxFiles, onUpload],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const file = prev[index];
      if (file.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      addFiles(e.dataTransfer.files);
    },
    [addFiles, disabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-muted/50',
          isDragOver && 'border-primary bg-primary/5',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Arraste arquivos ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground">
          Formatos: {accept} | Máx: {maxFiles} arquivos | {maxSize / 1024 / 1024}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border bg-background px-3 py-2"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <File className="h-10 w-10 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {file.uploading && (
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
