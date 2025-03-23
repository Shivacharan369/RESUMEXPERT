from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

genai.configure(api_key="AIzaSyDM55Vf4SxkxE_Qd4E8xScdPY3rcp2dPTA")  # Replace with your Gemini API key

# 📄 Extract text from PDF or DOCX
def extract_text(file_path):
    text = ""
    try:
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
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None  # Return None if extraction fails

    return text.strip() if text.strip() else None  # Ensure extracted text is valid

# 🎤 Generate interview questions from resume
def generate_questions(resume_text):
    prompt = f"Generate 10 concise and technical interview questions based on this resume:\n{resume_text}"
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    response = model.generate_content(prompt)
    questions = response.text.split("\n")

    # Ensure only 10 clear questions
    questions = [q.strip() for q in questions if q.strip()]
    return questions[:10] if len(questions) >= 10 else questions

# 🎯 Grade answer based on AI evaluation
def grade_response(question, answer_text):
    prompt = f"""
    Question: {question}
    Candidate Answer: {answer_text}
    
    Provide a score (1-10) and a brief evaluation of the response.
    Example Output: "Score: 8/10 - Strong technical understanding but could improve clarity."
    """
    
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return response.text.strip()

# 📤 Resume Upload & Question Generation API
@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    resume = request.files["resume"]
    if not (resume.filename.endswith(".pdf") or resume.filename.endswith(".docx")):
        return jsonify({"error": "Unsupported file format. Upload a PDF or DOCX file."}), 400

    file_path = os.path.join(UPLOAD_FOLDER, resume.filename)
    resume.save(file_path)

    resume_text = extract_text(file_path)
    if not resume_text:
        return jsonify({"error": "Failed to extract text from resume. Please upload a clear document."}), 400

    questions = generate_questions(resume_text)
    return jsonify({"questions": questions})

# 📊 Answer Evaluation API
@app.route("/grade-answer", methods=["POST"])
def grade_answer():
    data = request.json
    question = data.get("question")
    answer_text = data.get("answer")

    if not question or not answer_text:
        return jsonify({"error": "Missing question or answer"}), 400

    evaluation = grade_response(question, answer_text)
    return jsonify({"evaluation": evaluation})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
