import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export async function parseCVFile(buffer: Buffer, filename: string): Promise<string> {
  try {
    const fileExt = filename.toLowerCase();
    
    // Detect PDF and DOCX using magic bytes
    const isPdf = buffer.length >= 4 && buffer.slice(0, 4).toString('ascii') === '%PDF';
    const isDocx = buffer.length >= 2 && buffer.slice(0, 2).toString('ascii') === 'PK';

    if (fileExt.endsWith('.pdf') || isPdf) {
      console.log(`Parsing PDF: ${filename} (isPdf: ${isPdf}), Buffer length: ${buffer.length}`);
      
      const PDFParser = require('pdf2json');
      const pdfParser = new (PDFParser.default || PDFParser)(null, 1);

      return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error('pdf2json Error:', errData);
          reject(new Error(errData.parserError || 'PDF parsing failed'));
        });
        
        pdfParser.on("pdfParser_dataReady", () => {
          const text = pdfParser.getRawTextContent();
          console.log('PDF parsed successfully, text length:', text.length);
          
          if (!text || text.trim().length === 0) {
            reject(new Error('PDF appears to be empty or contains only images. Please upload a text-based PDF.'));
          } else {
            resolve(text);
          }
        });

        pdfParser.parseBuffer(buffer);
      });
    }

    if (fileExt.endsWith('.docx') || fileExt.endsWith('.doc') || isDocx) {
      console.log(`Parsing Word document: ${filename} (isDocx: ${isDocx})`);
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        console.log('DOCX parsed, text length:', result.value?.length);
        return result.value || '';
      } catch (e: any) {
        console.error('Mammoth error:', e);
        throw new Error(`Failed to parse Word document: ${e.message}`);
      }
    }

    // Fallback: treat as plain text
    const text = buffer.toString('utf-8');
    console.log('Plain text fallback, length:', text.length);
    return text;

  } catch (error: any) {
    console.error('CV Parsing Error:', error?.message || error);
    throw new Error(`Failed to parse CV: ${error?.message || 'Unknown error'}`);
  }
}
