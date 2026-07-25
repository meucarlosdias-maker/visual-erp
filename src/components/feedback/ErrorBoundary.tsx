'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from '@/constants/icons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="font-medium text-foreground">Algo deu errado</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {this.state.error?.message ?? 'Ocorreu um erro inesperado.'}
          </p>
          <Button variant="outline" onClick={this.handleRetry} className="mt-2">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
