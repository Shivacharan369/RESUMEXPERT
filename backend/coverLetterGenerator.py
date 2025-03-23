import os
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
import PyPDF2
import re
from datetime import date

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Configure Gemini API
genai.configure(api_key="AIzaSyBy4or9JNLoAD1oIih25Hhge6v4klh9268")  # Replace with your Gemini API key
model = genai.GenerativeModel('gemini-1.5-pro')

# Function to extract text from PDF resume
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

# Function to extract important features from resume text
def extract_features(resume_text):
    features = {
        "name": "",
        "contact_info": {"email": "", "phone": "", "linkedin": "", "github": ""},
        "skills": [],
        "experience": [],
        "education": [],
        "projects": [],
    }

    # Extract name (assume the first line is the name)
    lines = resume_text.split("\n")
    if lines:
        features["name"] = lines[0].strip()

    # Extract contact info
    email = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", resume_text)
    phone = re.findall(r"(?:\+?\d{1,2}\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}", resume_text)
    linkedin = re.findall(r"linkedin\.com\/in\/[a-zA-Z0-9_-]+", resume_text)
    github = re.findall(r"github\.com\/[a-zA-Z0-9_-]+", resume_text)

    if email:
        features["contact_info"]["email"] = email[0]
    if phone:
        features["contact_info"]["phone"] = phone[0]
    if linkedin:
        features["contact_info"]["linkedin"] = "linkedin.com/" + linkedin[0] if "linkedin.com" not in linkedin[0] else linkedin[0]
    if github:
        features["contact_info"]["github"] = "github.com/" + github[0] if "github.com" not in github[0] else github[0]

    # Use more flexible pattern matching for sections
    # Skills section
    skills_pattern = re.compile(r"(?:SKILLS|Technical Skills|TECHNICAL SKILLS)(.*?)(?:EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|\Z)", re.DOTALL | re.IGNORECASE)
    skills_match = skills_pattern.search(resume_text)
    if skills_match:
        skills_text = skills_match.group(1).strip()
        # Extract skills using bullet points, commas, or new lines as separators
        skills_list = re.split(r'[•⋅◦⚫·,\n]', skills_text)
        features["skills"] = [skill.strip() for skill in skills_list if skill.strip()]

    # Education section
    education_pattern = re.compile(r"(?:EDUCATION|Academic Background)(.*?)(?:EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|\Z)", re.DOTALL | re.IGNORECASE)
    education_match = education_pattern.search(resume_text)
    if education_match:
        education_text = education_match.group(1).strip()
        # Split by double newlines to separate different education entries
        education_entries = re.split(r'\n\s*\n', education_text)
        features["education"] = [entry.replace('\n', ' ').strip() for entry in education_entries if entry.strip()]

    # Projects section
    projects_pattern = re.compile(r"(?:PROJECTS|Project Experience)(.*?)(?:EXPERIENCE|SKILLS|EDUCATION|CERTIFICATIONS|ACHIEVEMENTS|\Z)", re.DOTALL | re.IGNORECASE)
    projects_match = projects_pattern.search(resume_text)
    if projects_match:
        projects_text = projects_match.group(1).strip()
        # Try to identify project titles (often in bold or followed by dates)
        project_titles = re.findall(r'(?:^|\n)([A-Za-z0-9\s&\-\'\"]+)(?:\s*[-–|]\s*|\s*\(|\s*:|\n)', projects_text)
        if project_titles:
            features["projects"] = [title.strip() for title in project_titles if title.strip()]
        else:
            # Fallback: split by double newlines or bullet points
            project_entries = re.split(r'(?:\n\s*\n|(?:^|\n)\s*[•⋅◦⚫·])', projects_text)
            features["projects"] = [entry.replace('\n', ' ').strip() for entry in project_entries if entry.strip()]

    # Experience section
    experience_pattern = re.compile(r"(?:EXPERIENCE|Work Experience|Professional Experience)(.*?)(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|\Z)", re.DOTALL | re.IGNORECASE)
    experience_match = experience_pattern.search(resume_text)
    if experience_match:
        experience_text = experience_match.group(1).strip()
        # Try to identify company names or job titles
        experience_entries = re.split(r'\n\s*\n', experience_text)
        features["experience"] = [entry.replace('\n', ' ').strip() for entry in experience_entries if entry.strip()]

    return features

# Function to generate cover letter using Gemini API
def generate_cover_letter(features, company, hiring_manager, job_title):
    # Summarize projects
    projects_summary = "I have worked on several projects, including "
    if features["projects"]:
        projects_summary += ", ".join(features["projects"][:3])  # Summarize first 3 projects
    else:
        projects_summary += "various technical projects"

    # Summarize skills
    skills_summary = "I have expertise in "
    if features["skills"]:
        skills_summary += ", ".join(features["skills"][:5])  # Summarize first 5 skills
    else:
        skills_summary += "various technologies"

    prompt = f"""
    You are a professional cover letter writer. Create ONLY the text of a professional cover letter with NO additional commentary, suggestions, or explanations.
    
    Use the following information to create the letter:
    - Name: {features["name"]}
    - Email: {features["contact_info"]["email"]}
    - Phone: {features["contact_info"]["phone"]}
    - LinkedIn: {features["contact_info"]["linkedin"]}
    - GitHub: {features["contact_info"]["github"]}
    - Company: {company}
    - Hiring Manager: {hiring_manager.split("\n")[0]}
    - Job Title: {job_title}
    - Education: {features["education"][0] if features["education"] else "Computer Science background"}
    - Projects Summary: {projects_summary}
    - Skills Summary: {skills_summary}
    
    Format the cover letter properly with:
    1. The applicant's contact information at the top
    2. The date (current date)
    3. The recipient's information
    4. A formal greeting
    5. 2-3 professional paragraphs highlighting relevant qualifications and interest in the position
    6. A closing paragraph
    7. A professional sign-off with "Sincerely," on one line and the name on a new line
    
    IMPORTANT FORMATTING REQUIREMENTS:
    - DO NOT use any bullet points in the letter
    - Use only full paragraphs with complete sentences
    - Keep the tone professional and concise
    - DO NOT include any comments, notes, or suggestions outside the actual cover letter content
    - DO NOT include any markers like "1." or "Step 1:" in the final letter
    - For the closing, put "Sincerely," on one line and the name on a separate line (with a line break between them)
    """
    
    response = model.generate_content(prompt)
    
    # Clean any potential formatting issues
    cover_letter_text = response.text.strip()
    
    # Remove any lines that might be suggestions or commentary
    lines = cover_letter_text.split('\n')
    clean_lines = []
    skip_line = False
    
    for line in lines:
        # Skip lines that appear to be commentary rather than letter content
        if any(x in line.lower() for x in ["here's", "here is", "note:", "suggestion", "remember", "bullet points", "step"]):
            skip_line = True
            continue
        
        # Skip markdown list markers
        if re.match(r'^\s*[-*•]\s', line) or re.match(r'^\s*\d+\.\s', line):
            line = re.sub(r'^\s*[-*•]\s', '', line)
            line = re.sub(r'^\s*\d+\.\s', '', line)
        
        if skip_line and line.strip() == "":
            skip_line = False
            continue
            
        if not skip_line:
            clean_lines.append(line)
    
    # Ensure proper line break between "Sincerely," and the name
    text = "\n".join(clean_lines)
    
    # Fix the specific issue with "Sincerely,nName"
    text = re.sub(r'Sincerely,\s*n', 'Sincerely,\n\n', text)
    
    # More general fix: ensure proper line break after "Sincerely," if not already there
    if "Sincerely," in text and not re.search(r'Sincerely,\s*\n\s*\n', text):
        text = re.sub(r'(Sincerely,)\s*(\S)', r'\1\n\n\2', text)
        text = re.sub(r'(Sincerely,)\s*\n(?!\n)', r'\1\n\n', text)
    
    return text

# Function to save cover letter as PDF
def save_to_pdf(text, filename):
    # Initialize PDF canvas
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Define margins
    left_margin = 72  # 1-inch margin
    right_margin = width - 72  # 1-inch margin
    top_margin = height - 72  # 1-inch from top
    y_position = top_margin  # Start position
    line_spacing = 14  # Slightly increased for readability
    max_line_width = right_margin - left_margin  # Usable width for text

    # Split text into sections (contact info, recipient, letter body)
    sections = text.split("\n\n")
    
    # Set font for header (contact info)
    c.setFont("Helvetica-Bold", 12)
    
    # Process the first section (usually contact info)
    if len(sections) > 0:
        header_lines = sections[0].split("\n")
        for line in header_lines:
            if line.strip():
                c.drawString(left_margin, y_position, line)
                y_position -= line_spacing
        
        # Add space after contact info
        y_position -= line_spacing
    
    # Set font for date and recipient
    c.setFont("Helvetica", 11)
    
    # Add current date if not already in the letter
    if not any("20" in section for section in sections[:2]):  # Check if date exists
        today = date.today().strftime("%B %d, %Y")
        c.drawString(left_margin, y_position, today)
        y_position -= line_spacing * 2
    
    # Process the second section (usually recipient info)
    if len(sections) > 1:
        recipient_lines = sections[1].split("\n")
        for line in recipient_lines:
            if line.strip():
                c.drawString(left_margin, y_position, line)
                y_position -= line_spacing
        
        # Add space after recipient info
        y_position -= line_spacing
    
    # Process remaining sections (letter body)
    for i in range(2, len(sections)):
        paragraph = sections[i]
        
        # Special handling for closing signature
        if "Sincerely" in paragraph:
            # Split the closing into separate lines
            closing_lines = paragraph.split("\n")
            for j, line in enumerate(closing_lines):
                if j == 0 and "Sincerely" in line:
                    c.drawString(left_margin, y_position, line)
                    y_position -= line_spacing * 2  # Extra space after "Sincerely,"
                else:
                    c.drawString(left_margin, y_position, line)
                    y_position -= line_spacing
        
        # Handle greeting
        elif "Dear " in paragraph:
            c.drawString(left_margin, y_position, paragraph)
            y_position -= line_spacing * 2  # Extra space after greeting
        
        # Regular paragraphs
        else:
            # Split paragraph into lines that fit within the maximum width
            lines = simpleSplit(paragraph, "Helvetica", 11, max_line_width)
            
            for line in lines:
                c.drawString(left_margin, y_position, line)
                y_position -= line_spacing
                
                # Check if we need a new page
                if y_position < 72:  # Bottom 1-inch margin
                    c.showPage()
                    c.setFont("Helvetica", 11)
                    y_position = top_margin
        
        # Add space between paragraphs
        y_position -= line_spacing
    
    # Save the PDF
    c.save()

# API endpoint to generate cover letter
@app.route("/generate-cover-letter", methods=["POST"])
def generate_cover_letter_api():
    # Get data from the request
    resume_file = request.files["resume"]
    company = request.form.get("company")
    job_title = request.form.get("job_title")
    hiring_manager = request.form.get("hiring_manager", "Hiring Manager")

    # Save the uploaded resume to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_resume:
        resume_file.save(temp_resume.name)
        resume_path = temp_resume.name

    # Extract text from the resume
    resume_text = extract_text_from_pdf(resume_path)

    # Extract features from the resume
    features = extract_features(resume_text)

    # Generate the cover letter
    cover_letter_text = generate_cover_letter(features, company, hiring_manager, job_title)

    # Save the cover letter as a PDF
    output_pdf_path = os.path.join(tempfile.gettempdir(), "cover_letter.pdf")
    save_to_pdf(cover_letter_text, output_pdf_path)

    # Return the generated PDF
    return send_file(output_pdf_path, as_attachment=True, download_name="cover_letter.pdf")

if __name__ == "__main__":
    app.run(debug=True,port=5002)