import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file without extension
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, fileName, sheetName = 'Data') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Exports data to PDF format
 * @param {Array} headers - Array of header strings
 * @param {Array} data - Array of arrays representing rows
 * @param {string} fileName - Name of the file without extension
 * @param {string} title - Title to display at the top of the PDF
 */
export const exportToPDF = (headers, data, fileName, title) => {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for more columns
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 25,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold' }, // orange-500
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 25 },
  });

  doc.save(`${fileName}.pdf`);
};
