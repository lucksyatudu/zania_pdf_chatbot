import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from langchain.llms import OpenAI
from io import BytesIO
from pydantic import BaseModel

class QuestionRequest(BaseModel):
    question: str

# Initialize OpenAI API
openai_api_key = os.getenv('OPENAI_API_KEY')

app = FastAPI()

# Allow CORS for frontend access
origins = ["http://localhost:3000"]  # Frontend origin (React app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store extracted PDF text globally (in-memory storage for demo purposes)
pdf_text = ""

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # Read the PDF file
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        global pdf_text
        pdf_text = ""
        for page in reader.pages:
            pdf_text += page.extract_text()

        return {"message": "PDF uploaded and processed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/ask-question")
async def ask_question(request: QuestionRequest):
    question = request.question
    if not pdf_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or processed yet")

    # Use Langchain with OpenAI to process the question and generate an answer
    try:
        llm = OpenAI(openai_api_key=openai_api_key)
        prompt = f"Based on the document, {pdf_text} answer the question: {question}"
        answer = llm(prompt)

        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")