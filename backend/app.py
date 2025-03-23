from flask import Flask, request, jsonify
from flask_cors import CORS  # Fixes CORS error
import pdfplumber
import docx
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Allow frontend requests

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Hardcoded API Key (Replace with your actual key)
API_KEY = "AIzaSyDM55Vf4SxkxE_Qd4E8xScdPY3rcp2dPTA"

# Configure Gemini API
genai.configure(api_key=API_KEY)

def extract_text(file_path):
    """Extract text from PDF or DOCX resume files"""
    text = ""
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted_text = page.extract_text()
                if extracted_text:  
                    text += extracted_text + "\n"
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    return text.strip()

def generate_questions(resume_text):
    """Generate interview questions based on extracted resume text"""
    prompt = f"Generate 10 interview questions based on this resume:\n{resume_text}"

    # Use correct Gemini model name
    model = genai.GenerativeModel("gemini-1.5-pro-latest")

    try:
        response = model.generate_content(prompt)
        return response.text.split("\n")[:10]  # Return top 10 questions
    except Exception as e:
        print(f"❌ Error generating questions: {e}")
        return ["Error: Failed to generate questions. Check API key & model availability."]

@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    """API endpoint to handle resume upload and return interview questions"""
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    resume = request.files["resume"]
    file_path = os.path.join(UPLOAD_FOLDER, resume.filename)
    resume.save(file_path)

    resume_text = extract_text(file_path)
    if not resume_text:
        return jsonify({"error": "Failed to extract text from resume"}), 400

    questions = generate_questions(resume_text)
    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
