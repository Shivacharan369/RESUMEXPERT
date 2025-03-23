import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../assets/bg.jpg";

const CoverLetter = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedPdf, setGeneratedPdf] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx",
    onDrop: (acceptedFiles) => setResumeFile(acceptedFiles[0]),
  });

  const removeResumeFile = () => setResumeFile(null);

  const handleCoverLetterUpload = async () => {
    if (!resumeFile || !companyName || !jobTitle || !jdText) {
      setErrorMessage("⚠️ Please upload your resume and fill all job details.");
      return;
    }

    setErrorMessage(""); 
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("company", companyName);
    formData.append("job_title", jobTitle);
    formData.append("hiring_manager", "Hiring Manager");

    try {
      const response = await fetch("http://localhost:5002/generate-cover-letter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setGeneratedPdf(URL.createObjectURL(blob));
      } else {
        setErrorMessage("❌ Upload failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("❌ Error uploading file. Check your connection.");
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
          <h1 className="text-5xl font-bold text-center pt-10 pb-2 text-purple-400">
            Generate Your Cover Letter!
          </h1>
          <p className="mt-4 text-2xl text-gray-300">Upload your resume and enter job details.</p>

          <div
            {...getRootProps()}
            className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all"
          >
            <input {...getInputProps()} />
            {!resumeFile ? (
              <>
                <p className="text-gray-300 text-2xl font-medium">Drop your resume or choose file</p>
                <p className="text-lg text-gray-500 mt-2">📄 PDFs and DOCs only</p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <FaFilePdf className="text-red-500 text-5xl" />
                <p className="text-gray-300 text-xl">{resumeFile.name}</p>
                <button onClick={removeResumeFile} className="text-red-400 hover:text-red-600">
                  <FaTrash className="text-3xl" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 w-full max-w-2xl bg-gray-800/80 p-10 rounded-2xl text-center">
            <p className="text-gray-300 text-2xl font-medium">Enter Job Details</p>

            <input
              type="text"
              className="mt-4 w-full p-4 text-gray-900 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 bg-white"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <input
              type="text"
              className="mt-4 w-full p-4 text-gray-900 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 bg-white"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <textarea
              className="mt-4 w-full p-4 text-gray-900 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 bg-white h-40"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            {errorMessage && <p className="mt-4 text-red-400 text-lg">{errorMessage}</p>}

            <button
              className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition"
              onClick={handleCoverLetterUpload}
              disabled={isUploading}
            >
              {isUploading ? "Generating..." : "Generate Cover Letter"}
            </button>

            {generatedPdf && (
              <a
                href={generatedPdf}
                download="CoverLetter.pdf"
                className="mt-6 px-6 py-3 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-700 transition inline-block"
              >
                📥 Download Cover Letter
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoverLetter;
