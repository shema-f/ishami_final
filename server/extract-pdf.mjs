import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

const pdfPath = path.resolve('D:/ishami docs/amategeko-yumuhanda.pdf');

async function extractPdf() {
  try {
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF not found at:', pdfPath);
      return;
    }
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const uint8Array = new Uint8Array(dataBuffer);
    const pdf = new PDFParse(uint8Array);
    await pdf.load();
    
    const textResult = await pdf.getText();
    const pages = textResult.pages;
    console.log(`Total pages extracted: ${pages.length}`);
    
    let allText = '';
    for (const page of pages) {
      allText += `\n\n=== PAGE ${page.num} ===\n${page.text}`;
    }
    
    console.log('\n=== FULL EXTRACTED TEXT (first 80000 chars) ===');
    console.log(allText.substring(0, 80000));
    console.log('\n=== TOTAL LENGTH ===');
    console.log(allText.length);
    
    // Save full text to file
    const outputPath = path.resolve('ishami/server/uploads/extracted-pdf-text.txt');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, allText, 'utf-8');
    console.log('\nSaved to:', outputPath);
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  }
}

extractPdf();
