"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';


const PDFDownloader=({ content, fileName }) => {
  const downloadPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      // Add background
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.93, 0.96, 1),
      });

      // Add content
      page.drawText(content, {
        x: 50,
        y: height - 100,
        size: 12,
        color: rgb(0.1, 0.1, 0.1),
        maxWidth: width - 100,
        lineHeight: 18,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={downloadPDF}
      className="bg-blue-600 text-white py-3 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
    >
      <Download className="w-5 h-5" />
      <span>Download PDF</span>
    </motion.button>
  );
};

export default PDFDownloader;