import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from pydantic import BaseModel
from openai import OpenAI
from io import BytesIO

app = FastAPI()

# Allow CORS for frontend access
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store extracted PDF text
pdf_text = ""

# Model for asking multiple questions
class QuestionsRequest(BaseModel):
    questions: list[str]

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

@app.post("/ask-questions")
async def ask_questions(request: QuestionsRequest):
    global pdf_text
    if not pdf_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or processed yet")

    # Initialize OpenAI API
    llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    # Prepare the response JSON
    response = {}

    # Loop through each question
    for question in request.questions:
        # Check for word-to-word match in PDF text
        if question.lower() in pdf_text.lower():
            response[question] = "Exact match found in PDF: " + question
        else:
            # Use OpenAI to generate the answer
            prompt = f"Based on the following document:\n{pdf_text}\n\nAnswer the question: {question}"
            completion = llm.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
            )
            answer = completion.choices[0].message.content

            # Heuristic check for low-confidence answers
            if len(answer.strip()) < 5 or "I don't know" in answer or "unsure" in answer:
                response[question] = "Data Not Available"
            else:
                response[question] = answer

    # Return the structured JSON response
    print(response)
    return response
