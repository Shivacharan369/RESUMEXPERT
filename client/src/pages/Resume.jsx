import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  FaFilePdf,
  FaFileWord,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import videoRes from "../assets/videores.mp4";
import bgImage from "../assets/bg.jpg";

const Resume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const removeFile = () => setFile(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        navigate("/score");
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white pt-20 font-caramond relative px-10"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="text-6xl font-bold text-center pt-10 pb-6">Get Your Resume Score Now..!</h1>
          <p className="mt-4 text-2xl text-gray-300 text-center">Upload your resume and check your resume score.</p>

          {/* Resume Upload Section */}
          <div
            {...getRootProps()}
            className="mt-6 w-full max-w-3xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-12 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all"
          >
            <input {...getInputProps()} />
            {!file ? (
              <>
                <p className="text-gray-300 text-2xl font-medium">Drop your resume or choose file</p>
                <p className="text-lg text-gray-500 mt-2">📄 PDFs and DOCs only</p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {file.name.endsWith(".pdf") ? (
                  <FaFilePdf className="text-red-500 text-5xl" />
                ) : (
                  <FaFileWord className="text-blue-500 text-5xl" />
                )}
                <p className="text-gray-300 text-xl">{file.name}</p>
                <button onClick={removeFile} className="text-red-400 hover:text-red-600">
                  <FaTrash className="text-3xl" />
                </button>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="mt-12 w-full max-w-3xl">
            <h2 className="text-5xl font-bold text-center pb-4">Job Description</h2>
            <textarea
              className="w-full h-40 bg-gray-800/90 text-gray-300 p-4 rounded-lg border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            className="mt-6 px-8 py-4 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          {isUploading && (
            <div className="mt-4 w-full max-w-md bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 animate-pulse"></div>
            </div>
          )}
          {uploadSuccess && <p className="mt-2 text-green-400 text-xl">✅ Upload successful!</p>}

          {/* AI Resume Checker Video Section */}
          <div className="mt-20 text-center w-full">
            <h2 className="text-6xl font-bold text-white">OUR AI POWERED RESUME CHECKER GIVES US</h2>
            <div className="relative mt-8 w-full flex justify-center">
              <video src={videoRes} autoPlay loop muted className="w-[80%] rounded-lg shadow-lg" />
            </div>
          </div>

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </div>
      <Footer />
    </>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const questions = [
    {
      q: "What is ResumeXpert?",
      a: "ResumeXpert is an AI-driven resume checker that evaluates resumes based on job descriptions, ATS compatibility, grammar, and formatting to increase hiring chances. It ensures your resume aligns with modern hiring trends and improves its overall impact."
    },
    {
      q: "How does AI improve my resume?",
      a: "AI enhances your resume by analyzing job descriptions, checking for relevant keywords, detecting formatting issues, and ensuring proper grammar. This helps improve your resume’s visibility and chances of passing applicant tracking systems (ATS)."
    },
    {
      q: "What makes a resume ATS-friendly?",
      a: "An ATS-friendly resume uses a clean, simple format with properly structured sections. It avoids excessive graphics, fancy fonts, and tables that might interfere with parsing. Proper use of industry-specific keywords is also crucial."
    },
    {
      q: "What is a good ATS score?",
      a: "A good ATS score is typically 80% or higher. This indicates that your resume is well-optimized for the job you’re applying for, increasing your chances of being shortlisted."
    },
    {
      q: "Can an ATS read PDFs?",
      a: "Yes, modern ATS systems can read text-based PDFs. However, image-based PDFs or resumes with complex formatting may not be parsed correctly, reducing their effectiveness."
    },
    {
      q: "How do I review my resume for errors?",
      a: "To ensure your resume is error-free, proofread it carefully, use grammar-checking tools, and get feedback from career professionals. Pay attention to formatting, spelling, and clarity of information."
    },
  ];

  return (
    <div className="mt-20 w-full max-w-4xl text-white">
      <h2 className="text-7xl font-bold text-center">Frequently Asked Questions</h2>
      {questions.map((item, index) => (
        <div key={index} className="mt-8 bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <h3 className="text-3xl text-purple-400 font-semibold">{item.q}</h3>
            {openIndex === index ? <FaMinus className="text-purple-400" /> : <FaPlus className="text-purple-400" />}
          </div>
          {openIndex === index && <p className="mt-5 text-2xl text-gray-300 font-semibold">{item.a}</p>}
        </div>
      ))}
    </div>
  );
};

export default Resume;
