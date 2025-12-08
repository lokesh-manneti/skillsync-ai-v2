import io
from fastapi import UploadFile
from PyPDF2 import PdfReader

async def parse_pdf(file: UploadFile) -> str:
    """
    Reads a PDF file from memory and extracts text.
    """
    # Read the file bytes
    content = await file.read()
    
    # Create a PDF Object
    pdf = PdfReader(io.BytesIO(content))
    
    text_content = ""
    
    # Loop through pages and extract text
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            text_content += text + "\n"
            
    # Reset cursor position in case we need to read it again later
    await file.seek(0)
    
    return text_content.strip()