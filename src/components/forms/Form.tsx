'use client';

import {
  useForm,
  FormProvider,
  type UseFormProps,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodTypeAny } from 'zod';

interface FormProps<T extends FieldValues> {
  schema?: ZodTypeAny;
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
