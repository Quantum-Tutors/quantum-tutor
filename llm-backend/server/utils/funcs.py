from datetime import datetime
import uuid, pdfplumber, io
from fastapi import UploadFile, HTTPException


def generate_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:10]}"

def current_timestamp():
    return datetime.now().isoformat() + "Z"

async def extract_text_from_pdf(pdf_file: UploadFile):
    text = ""
    try:
        # Read the file as binary
        pdf_bytes = await pdf_file.read()  
        # Convert to BytesIO to handle it as a file-like object
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""  # Extract text from each page
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")
    return text