const pdfParse = require('pdf-parse');

/**
 * PdfService is responsible for extracting raw text from PDF files.
 * Single Responsibility: only handles PDF text extraction.
 */
class PdfService {
  /**
   * Extract text content from a PDF buffer.
   * @param {Buffer} buffer - The PDF file buffer.
   * @returns {Promise<string>} - The extracted text.
   */
  async extractText(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
  }
}

module.exports = new PdfService();
