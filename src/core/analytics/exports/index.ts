import type { ExportRequest, ExportFormat } from '../types';

interface ExportedFile {
  filename: string;
  content: string;
  mimeType: string;
}

const mimeTypes: Record<ExportFormat, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
};

function escapeCsv(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateCsv(columns: { key: string; label: string }[], data: Record<string, unknown>[]): string {
  const header = columns.map((c) => escapeCsv(c.label)).join(',');
  const rows = data.map((row) => columns.map((c) => escapeCsv(row[c.key])).join(','));
  return [header, ...rows].join('\n');
}

function generateHtmlTable(columns: { key: string; label: string }[], data: Record<string, unknown>[], title: string): string {
  const header = columns.map((c) => `<th style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">${c.label}</th>`).join('');
  const rows = data.map((row) =>
    `<tr>${columns.map((c) => `<td style="padding:8px;border:1px solid #ddd">${row[c.key] ?? ''}</td>`).join('')}</tr>`,
  ).join('');
  return `
    <html><head><meta charset="utf-8"></head><body>
      <h2 style="color:#333;margin-bottom:16px">${escapeCsv(title)}</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px">
        <thead><tr>${header}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body></html>
  `;
}

export async function exportData(request: ExportRequest): Promise<ExportedFile> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeTitle = request.title.replace(/[^a-zA-Z0-9]/g, '_');

  switch (request.format) {
    case 'csv': {
      const content = generateCsv(request.columns, request.data);
      return { filename: `${safeTitle}_${timestamp}.csv`, content, mimeType: mimeTypes.csv };
    }
    case 'xlsx': {
      const html = generateHtmlTable(request.columns, request.data, request.title);
      return { filename: `${safeTitle}_${timestamp}.xlsx`, content: html, mimeType: mimeTypes.xlsx };
    }
    case 'pdf': {
      const html = generateHtmlTable(request.columns, request.data, request.title);
      return { filename: `${safeTitle}_${timestamp}.pdf`, content: html, mimeType: mimeTypes.pdf };
    }
  }
}

export function downloadFile(file: ExportedFile): void {
  const blob = new Blob([file.content], { type: file.mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
