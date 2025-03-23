from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

genai.configure(api_key="AIzaSyDM55Vf4SxkxE_Qd4E8xScdPY3rcp2dPTA")  # Replace with your API key

# Temporary storage for user scores (resets after restart)
user_scores = {}

# 📄 Extract text from PDF/DOCX
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
        return None

    return text.strip() if text.strip() else None  

# 🎤 Generate interview questions from resume
def generate_questions(resume_text):
    prompt = f"Generate 10 concise and technical interview questions based on this resume:\n{resume_text}"
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    response = model.generate_content(prompt)
    questions = response.text.split("\n")
    questions = [q.strip() for q in questions if q.strip()]
    return questions[:10] if len(questions) >= 10 else questions

# 🎯 Grade AI-generated response
def grade_response(question, answer_text):
    prompt = f"""
    Question: {question}
    Candidate Answer: {answer_text}
    
    Provide a score (1-10) and a brief evaluation.
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
    
    # Generate unique session ID
    session_id = os.urandom(8).hex()
    user_scores[session_id] = {"scores": [], "feedback": []}  

    return jsonify({"session_id": session_id, "questions": questions})

# 📊 Answer Evaluation API
@app.route("/grade-answer", methods=["POST"])
def grade_answer():
    data = request.json
    session_id = data.get("session_id")
    question = data.get("question")
    answer_text = data.get("answer")

    if not session_id or not question or not answer_text:
        return jsonify({"error": "Missing session ID, question, or answer"}), 400

    evaluation = grade_response(question, answer_text)

    try:
        score = int(evaluation.split("Score:")[1].split("/")[0].strip())
    except:
        score = 5  

    user_scores[session_id]["scores"].append(score)
    user_scores[session_id]["feedback"].append(evaluation)

    total_answers = len(user_scores[session_id]["scores"])
    
    if total_answers == 10:  
        final_score = sum(user_scores[session_id]["scores"]) / 10
        feedback_summary = "\n".join(user_scores[session_id]["feedback"])
        return jsonify({
            "status": "completed",
            "final_score": final_score,
            "feedback": feedback_summary,
            "message": "Interview Completed!"
        })

    return jsonify({
        "status": "in-progress",
        "evaluation": evaluation,
        "progress": total_answers,
        "message": f"Answer {total_answers}/10 recorded."
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
