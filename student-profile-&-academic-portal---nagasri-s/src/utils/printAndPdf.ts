import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface PrintAndPdfOptions {
  fileName: string;
  title: string;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Clones a DOM element into an off-screen full-width staging area, removes all responsive
 * truncation/horizontal overflow clipping, and renders a complete, unclipped high-resolution PNG.
 * This guarantees that every single table column (marks, credits, grades, status) is 100% visible.
 */
export async function captureFullElementToPng(
  element: HTMLElement,
  customOptions?: {
    pixelRatio?: number;
    quality?: number;
    backgroundColor?: string;
    minWidth?: number;
  }
): Promise<string> {
  const minWidth = customOptions?.minWidth ?? 1120; // Standard unclipped width ensuring all marksheet columns fit

  // Create an off-screen staging container attached to the document body
  const staging = document.createElement('div');
  staging.setAttribute('id', 'print-staging-container');
  staging.setAttribute('aria-hidden', 'true');
  staging.style.position = 'fixed';
  staging.style.left = '-99999px';
  staging.style.top = '0';
  staging.style.width = `${minWidth}px`;
  staging.style.minWidth = `${minWidth}px`;
  staging.style.maxWidth = 'none';
  staging.style.height = 'auto';
  staging.style.maxHeight = 'none';
  staging.style.overflow = 'visible';
  staging.style.zIndex = '-9999';
  staging.style.background = customOptions?.backgroundColor ?? '#ffffff';
  staging.style.boxSizing = 'border-box';

  // Deep clone the source element
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${minWidth}px`;
  clone.style.minWidth = `${minWidth}px`;
  clone.style.maxWidth = 'none';
  clone.style.height = 'auto';
  clone.style.maxHeight = 'none';
  clone.style.overflow = 'visible';
  clone.style.boxSizing = 'border-box';
  clone.style.transform = 'none';

  // Expand all responsive scroll and overflow containers so no columns are clipped
  const scrollContainers = clone.querySelectorAll<HTMLElement>(
    '.overflow-x-auto, .overflow-y-auto, .overflow-hidden, .overflow-auto'
  );
  scrollContainers.forEach((el) => {
    el.style.overflow = 'visible';
    el.style.maxWidth = 'none';
    el.style.width = '100%';
    el.style.height = 'auto';
    el.style.maxHeight = 'none';
  });

  // Expand all tables to full width and ensure generous column spacing
  const tables = clone.querySelectorAll<HTMLElement>('table');
  tables.forEach((table) => {
    table.style.width = '100%';
    table.style.minWidth = `${minWidth - 60}px`;
    table.style.tableLayout = 'auto';
  });

  // Ensure all table headers and cells are visible without clipping
  const tableCells = clone.querySelectorAll<HTMLElement>('th, td');
  tableCells.forEach((cell) => {
    cell.style.overflow = 'visible';
  });

  staging.appendChild(clone);
  document.body.appendChild(staging);

  try {
    // Wait for DOM layout and styling to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    const measuredWidth = Math.max(clone.scrollWidth, clone.offsetWidth, minWidth);
    const measuredHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 400);

    const dataUrl = await toPng(clone, {
      width: measuredWidth,
      height: measuredHeight,
      quality: customOptions?.quality ?? 0.98,
      pixelRatio: customOptions?.pixelRatio ?? 2,
      backgroundColor: customOptions?.backgroundColor ?? '#ffffff',
      skipFonts: true,
      fontEmbedCSS: '',
      cacheBust: false
    });

    return dataUrl;
  } finally {
    if (staging.parentNode) {
      staging.parentNode.removeChild(staging);
    }
  }
}

/**
 * Backward-compatible wrapper that uses captureFullElementToPng to ensure no clipping.
 */
export async function captureElementToPng(
  element: HTMLElement,
  customOptions?: { pixelRatio?: number; quality?: number; backgroundColor?: string; minWidth?: number }
): Promise<string> {
  return captureFullElementToPng(element, customOptions);
}

/**
 * Downloads the target element directly as a formatted A4 PDF file using jsPDF.
 * Covers the entire marksheet with all columns and rows unclipped.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  options: {
    fileName: string;
    title: string;
    orientation?: 'portrait' | 'landscape';
    minWidth?: number;
  }
): Promise<void> {
  const isLandscape = options.orientation === 'landscape';

  // 1. Capture the full unclipped document image
  const dataUrl = await captureFullElementToPng(element, {
    pixelRatio: 2,
    quality: 0.98,
    minWidth: options.minWidth ?? 1120
  });

  // 2. Load the captured image to get exact natural dimensions
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });

  // 3. Setup A4 document in millimeters
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  const imgAspectRatio = imgHeight / imgWidth;

  const totalRenderedHeight = contentWidth * imgAspectRatio;

  if (totalRenderedHeight <= contentHeight) {
    // Single page: Centers document cleanly on the page
    const posY = margin + (contentHeight - totalRenderedHeight) / 2;
    pdf.addImage(dataUrl, 'PNG', margin, posY, contentWidth, totalRenderedHeight, undefined, 'FAST');
  } else {
    // Multi-page document: Slice cleanly across multiple pages using canvas
    const sliceHeightPx = Math.floor((contentHeight / contentWidth) * imgWidth);
    let currentY = 0;
    let pageNum = 0;

    const sliceCanvas = document.createElement('canvas');
    const ctx = sliceCanvas.getContext('2d');

    if (!ctx) {
      // Fallback if 2d context fails: scale to single page
      pdf.addImage(dataUrl, 'PNG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
    } else {
      sliceCanvas.width = imgWidth;

      while (currentY < imgHeight) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const currentSliceH = Math.min(sliceHeightPx, imgHeight - currentY);
        sliceCanvas.height = currentSliceH;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, imgWidth, currentSliceH);
        ctx.drawImage(
          img,
          0,
          currentY,
          imgWidth,
          currentSliceH,
          0,
          0,
          imgWidth,
          currentSliceH
        );

        const sliceDataUrl = sliceCanvas.toDataURL('image/png', 0.98);
        const renderedSliceH = (currentSliceH / imgWidth) * contentWidth;

        pdf.addImage(sliceDataUrl, 'PNG', margin, margin, contentWidth, renderedSliceH, undefined, 'FAST');

        currentY += currentSliceH;
        pageNum++;
      }
    }
  }

  const cleanFileName = options.fileName.endsWith('.pdf') ? options.fileName : `${options.fileName}.pdf`;
  pdf.save(cleanFileName);
}

/**
 * Triggers native browser print dialog for the target element using an unclipped capture.
 * Works seamlessly across both top-level windows and sandboxed iframes.
 */
export async function printOrSaveAsPdf(
  element: HTMLElement,
  options: PrintAndPdfOptions
): Promise<{ success: boolean; method: 'native' | 'popup' | 'pdf-fallback'; message: string }> {
  const orientation = options.orientation || 'portrait';

  // 1. Capture the high-resolution, unclipped rendering of the target element
  let dataUrl = '';
  try {
    dataUrl = await captureFullElementToPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      minWidth: 1120
    });
  } catch (err) {
    console.error('Failed to capture element image for printing:', err);
    // Fallback: invoke downloadElementAsPdf directly
    try {
      await downloadElementAsPdf(element, {
        fileName: options.fileName,
        title: options.title,
        orientation: options.orientation
      });
      return { success: true, method: 'pdf-fallback', message: 'Downloaded PDF document.' };
    } catch {
      window.print();
      return { success: true, method: 'native', message: 'Print invoked.' };
    }
  }

  // 2. Open a dedicated top-level printable window with the document and trigger native print dialog
  let popupSucceeded = false;
  try {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${options.title}</title>
            <style>
              @page {
                size: ${orientation === 'landscape' ? 'landscape' : 'portrait'};
                margin: 8mm;
              }
              * {
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 16px;
                background-color: #f8fafc;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                min-height: 100vh;
              }
              .toolbar {
                width: 100%;
                max-width: 960px;
                background: #0f172a;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              }
              .toolbar-title {
                font-size: 14px;
                font-weight: 700;
              }
              .toolbar-subtitle {
                font-size: 11px;
                color: #94a3b8;
              }
              .btn-print {
                background: #38bdf8;
                color: #0f172a;
                border: none;
                padding: 8px 18px;
                font-size: 13px;
                font-weight: 700;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
              }
              .btn-print:hover {
                background: #7dd3fc;
              }
              .doc-wrapper {
                background: #ffffff;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                max-width: ${orientation === 'landscape' ? '1120px' : '960px'};
                width: 100%;
                padding: 12px;
                display: flex;
                justify-content: center;
              }
              img.doc-image {
                max-width: 100%;
                width: 100%;
                height: auto;
                display: block;
              }
              @media print {
                body {
                  background: #ffffff !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .toolbar {
                  display: none !important;
                }
                .doc-wrapper {
                  border: none !important;
                  box-shadow: none !important;
                  padding: 0 !important;
                  max-width: 100% !important;
                  width: 100% !important;
                }
                img.doc-image {
                  width: 100% !important;
                  max-width: 100% !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="toolbar">
              <div>
                <div class="toolbar-title">${options.title}</div>
                <div class="toolbar-subtitle">Thiagarajar College, Madurai • &quot;அறிவும் அன்பும் சிவம்&quot; • (An Autonomous Institution Affiliated to Madurai Kamaraj University) • Nagasri S (24UCS32)</div>
              </div>
              <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
            </div>
            <div class="doc-wrapper">
              <img class="doc-image" src="${dataUrl}" alt="Academic Document" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 400);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      popupSucceeded = true;
    }
  } catch (err) {
    console.warn('Popup print window was blocked, falling back to direct PDF generation:', err);
  }

  if (popupSucceeded) {
    return {
      success: true,
      method: 'popup',
      message: 'Print dialog opened in document window.'
    };
  }

  // 3. Fallback if popups are blocked: Generate real A4 PDF directly using downloadElementAsPdf
  try {
    await downloadElementAsPdf(element, {
      fileName: options.fileName,
      title: options.title,
      orientation: options.orientation
    });

    return {
      success: true,
      method: 'pdf-fallback',
      message: 'Downloaded official PDF document to your system.'
    };
  } catch (pdfErr) {
    console.error('jsPDF generation failed:', pdfErr);
    window.print();
    return {
      success: true,
      method: 'native',
      message: 'Invoked print.'
    };
  }
}
