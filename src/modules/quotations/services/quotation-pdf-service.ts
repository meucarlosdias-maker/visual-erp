import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quotation } from '../types';
import { QUOTATION_STATUS_LABELS, DISCOUNT_TYPE_LABELS } from '../validators';

interface JsPDFWithTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

export class QuotationPdfService {
  async generate(quotation: Quotation): Promise<Blob> {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;

    const companyName = 'Visual ERP';
    const title = quotation.title;
    const number = quotation.number;
    const version = quotation.version;
    const status = QUOTATION_STATUS_LABELS[quotation.status] ?? quotation.status;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, marginLeft, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestão Visual', marginLeft, 31);

    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, 35, pageWidth - marginRight, 35);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, marginLeft, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const headerLines = [
      { label: 'Nº', value: number },
      { label: 'Versão', value: `v${version}` },
      { label: 'Status', value: status },
      { label: 'Data de Criação', value: quotation.createdAt.toLocaleDateString('pt-BR') },
      { label: 'Validade', value: quotation.validUntil ? quotation.validUntil.toLocaleDateString('pt-BR') : 'Sem data' },
    ];

    let yPos = 52;
    const lineH = 6;
    const labelW = 40;

    for (const line of headerLines) {
      doc.setFont('helvetica', 'bold');
      doc.text(line.label + ':', marginLeft, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(line.value, marginLeft + labelW, yPos);
      yPos += lineH;
    }

    if (quotation.description) {
      yPos += 2;
      doc.setFont('helvetica', 'bold');
      doc.text('Descrição:', marginLeft, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(quotation.description, contentWidth);
      for (const dl of descLines) {
        doc.text(dl as string, marginLeft, yPos);
        yPos += 5;
      }
    }

    yPos += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Itens do Orçamento', marginLeft, yPos);
    yPos += 5;

    const tableBody = quotation.items.map((item, idx) => [
      String(idx + 1),
      item.description,
      String(item.quantity),
      item.unit,
      `R$ ${item.unitPrice.toFixed(2)}`,
      `R$ ${item.totalPrice.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Descrição', 'Qtd', 'Un', 'Valor Unit.', 'Total']],
      body: tableBody,
      margin: { left: marginLeft, right: marginRight },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 12, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' },
      },
    });

    const finalY = (doc as JsPDFWithTable).lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    const totalsX = pageWidth - marginRight - 60;

    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsX, finalY);
    doc.text(`R$ ${quotation.subtotal.toFixed(2)}`, totalsX + 25, finalY, { align: 'right' });

    if (quotation.discount > 0) {
      const discountLabel = quotation.discountType
        ? DISCOUNT_TYPE_LABELS[quotation.discountType] ?? ''
        : '';
      const discountValue = quotation.discountType === 'PERCENTAGE'
        ? `${quotation.discount}%`
        : `R$ ${quotation.discount.toFixed(2)}`;
      doc.text(`Desconto (${discountLabel}):`, totalsX, finalY + 6);
      doc.text(discountValue, totalsX + 25, finalY + 6, { align: 'right' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', totalsX, finalY + 14);
    doc.text(`R$ ${quotation.total.toFixed(2)}`, totalsX + 25, finalY + 14, { align: 'right' });

    if (quotation.notes) {
      const notesY = finalY + 25;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Observações:', marginLeft, notesY);
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(quotation.notes, contentWidth);
      let ny = notesY + 5;
      for (const nl of noteLines) {
        doc.text(nl as string, marginLeft, ny);
        ny += 5;
      }
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Gerado por Visual ERP em ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`,
        marginLeft,
        doc.internal.pageSize.getHeight() - 10,
      );
    }

    return doc.output('blob');
  }
}

export const quotationPdfService = new QuotationPdfService();
