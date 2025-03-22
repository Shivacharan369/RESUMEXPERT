import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaFileWord, FaTrash, FaBriefcase, FaFileAlt, FaAlignLeft, FaFolderOpen, FaLightbulb, FaPalette, FaPlus, FaMinus } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import videoRes from "../assets/videores.mp4";
import bgImage from "../assets/bg.jpg";

const Resume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
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
        className="min-h-screen flex flex-col items-center justify-center text-white pt-20 font-caramond relative"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-center pt-10 pb-2 text-white-400">Get Your Resume Score Now..!</h1>
          <p className="mt-4 text-2xl text-gray-300">Upload your resume and check your resume score.</p>

          <div
            {...getRootProps()}
            className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all"
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

          <button
            className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition"
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

          <div className="mt-16 text-center w-full">
            <h2 className="text-6xl font-bold text-white-400">OUR AI POWERED RESUME CHECKER GIVES US</h2>
            <div className="relative mt-8 w-full flex justify-center">
              <video src={videoRes} autoPlay loop muted className="w-3/4 rounded-lg shadow-lg" />
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
      a: "ResumeXpert is an AI-driven resume checker that evaluates resumes based on structure, content, and ATS compatibility. It analyzes formatting, keyword optimization, spelling and grammar, and provides actionable insights to make your resume more impactful. With ResumeXpert, you can ensure your resume aligns with modern hiring trends, maximizing your chances of getting noticed by recruiters.",
    },
    {
      q: "How does AI improve my resume?",
      a: "AI enhances your resume by analyzing job descriptions and identifying missing skills or keywords. It checks grammar, readability, and overall structure, ensuring it’s clear, concise, and tailored for the job. AI also helps refine bullet points, quantifying achievements to create a strong impression on employers.",
    },
    {
      q: "What makes a resume ATS-friendly?",
      a: "An ATS-friendly resume uses a clean format, incorporates industry-relevant keywords, and avoids excessive graphics or tables. Using proper headings, standard fonts, and bullet points helps ensure that an ATS can parse and rank your resume correctly. Our resume checker provides a detailed ATS compatibility report to help you optimize your document.",
    },
    {
      q: "What is a good ATS score?",
      a: "A good ATS score is generally 80% or above. This indicates that your resume contains the right keywords, structure, and formatting to pass through Applicant Tracking Systems successfully. If your score is lower, consider adjusting your resume by adding relevant keywords and improving readability.",
    },
    {
      q: "Can an ATS read PDFs?",
      a: "Yes, most modern ATS systems can read text-based PDFs. However, image-based PDFs or heavily formatted designs may cause parsing issues. To ensure compatibility, save your resume as a properly structured PDF or DOCX file with readable text.",
    },
    {
      q: "How do I review my resume for errors?",
      a: "To check for errors, read your resume aloud, use grammar-checking tools, and get feedback from peers or career advisors. Pay attention to formatting consistency, spelling, and redundant phrases. Our AI resume checker scans for these issues and suggests improvements.",
    },
    {
      q: "What should I focus on when checking my resume?",
      a: "Key areas to focus on include: formatting, keyword relevance, quantifiable achievements, ATS optimization, spelling/grammar, and consistency in dates and job descriptions. Ensure each section is clear and easy to read.",
    },
  ];

  return (
    <div className="mt-16 w-full max-w-4xl text-white">
      <h2 className="text-7xl font-bold text-center text-white-400">Frequently Asked Questions</h2>
      {questions.map((item, index) => (
        <div key={index} className="mt-6 bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <h3 className="text-3xl text-purple-400 font-semibold">{item.q}</h3>
            {openIndex === index ? <FaMinus className="text-purple-400" /> : <FaPlus className="text-purple-400" />}
          </div>
          {openIndex === index && <p className="mt-3 text-xl text-gray-300 font-semibold">{item.a}</p>}
        </div>
      ))}
    </div>
  );
};

export default Resume;
