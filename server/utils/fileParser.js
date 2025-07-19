import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResume = async (file) => {
  try {
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      // Parse PDF
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse resume file');
  }
};