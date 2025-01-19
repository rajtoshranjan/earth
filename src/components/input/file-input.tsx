import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Icon, IconIdentifier } from '../icon';

interface FileInputProps {
  accept?: string;
  onChange?: (file: File) => void;
  className?: string;
  error?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  accept,
  onChange,
  className,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>();

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      onChange?.(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  return (
    <div
      className={classNames(
        'relative rounded-lg border border-dashed border-gray-600 bg-gray-800/50 p-4 transition-colors',
        {
          'border-blue-500 bg-blue-500/5': isDragging,
          'border-red-400': error,
        },
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Icon
          identifier={IconIdentifier.Upload}
          className="size-8 text-gray-400"
        />
        {fileName ? (
          <div className="text-sm text-gray-300">{fileName}</div>
        ) : (
          <>
            <div className="text-sm text-gray-300">
              Drop your file here, or{' '}
              <span className="text-blue-400">browse</span>
            </div>
            <div className="text-xs text-gray-500">
              Supports GeoJSON files (.geojson, .json)
            </div>
          </>
        )}
      </div>
    </div>
  );
};
