'use client';

import { useRef } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField } from '../FormField';
import { Upload, X, File } from '@/constants/icons';

interface UploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function UploadField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  accept,
  multiple,
  disabled,
}: UploadFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const files = field.value ? (Array.isArray(field.value) ? field.value : [field.value]) : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (multiple) {
      field.onChange([...files, ...selectedFiles]);
    } else {
      field.onChange(selectedFiles[0]);
    }
  };

  const removeFile = (index: number) => {
    const next = files.filter((_: unknown, i: number) => i !== index);
    field.onChange(multiple ? next : null);
  };

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <Upload className="mr-2 h-4 w-4" />
        Selecionar arquivo
      </Button>
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file: File, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{file.name}</span>
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
    </FormField>
  );
}
