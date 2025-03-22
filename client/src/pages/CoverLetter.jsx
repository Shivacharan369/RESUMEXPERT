import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaFileWord, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../assets/bg.jpg";

const CoverLetter = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx",
    onDrop: (acceptedFiles) => setResumeFile(acceptedFiles[0]),
  });

  const removeResumeFile = () => setResumeFile(null);
  const removeJdFile = () => setJdFile(null);

  const handleUpload = async () => {
    if (!resumeFile || (!jdText && !jdFile)) {
      setErrorMessage("⚠️ Please upload both the Cover Letter and Job Description.");
      return;
    }

    setErrorMessage(""); // Clear error
    setIsUploading(true);
    const formData = new FormData();
    formData.append("coverLetter", resumeFile);
    if (jdFile) {
      formData.append("jobDescription", jdFile);
    } else {
      formData.append("jobDescriptionText", jdText);
    }

    try {
      const response = await fetch("http://localhost:5000/upload-cover-letter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/cover-score");
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

      {/* Cover Letter Upload Section */}
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white pt-20 font-caramond relative"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-center pt-10 pb-2 text-purple-400">
            Get Your Cover Letter Score Now..!
          </h1>
          <p className="mt-4 text-2xl text-gray-300">Upload your cover letter and check your score.</p>

          {/* Resume Upload Box */}
          <div
            {...getRootProps()}
            className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all"
          >
            <input {...getInputProps()} />
            {!resumeFile ? (
              <>
                <p className="text-gray-300 text-2xl font-medium">Drop your cover letter or choose file</p>
                <p className="text-lg text-gray-500 mt-2">📄 PDFs and DOCs only</p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {resumeFile.name.endsWith(".pdf") ? (
                  <FaFilePdf className="text-red-500 text-5xl" />
                ) : (
                  <FaFileWord className="text-blue-500 text-5xl" />
                )}
                <p className="text-gray-300 text-xl">{resumeFile.name}</p>
                <button onClick={removeResumeFile} className="text-red-400 hover:text-red-600">
                  <FaTrash className="text-3xl" />
                </button>
              </div>
            )}
          </div>

          {/* JD Upload Box (Same as Resume Box) */}
          <div className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center hover:bg-gray-700 transition-all">
            <p className="text-gray-300 text-2xl font-medium">Drop your job description or paste text</p>
            <p className="text-lg text-gray-500 mt-2">📋 Paste or Upload JD File (TXT/DOC)</p>

            {/* JD Upload Area */}
            <div className="mt-4 flex justify-center">
              <input type="file" accept=".txt,.doc,.docx" className="hidden" id="jd-upload" onChange={(e) => setJdFile(e.target.files[0])} />
              <label htmlFor="jd-upload" className="px-6 py-2 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 cursor-pointer">
                Upload JD File
              </label>
            </div>

            {/* Show Uploaded JD File */}
            {jdFile && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <FaFileWord className="text-blue-500 text-5xl" />
                <p className="text-gray-300 text-xl">{jdFile.name}</p>
                <button onClick={removeJdFile} className="text-red-400 hover:text-red-600">
                  <FaTrash className="text-3xl" />
                </button>
              </div>
            )}

            {/* JD Text Area (Inside Box) */}
            <textarea
              className="mt-4 w-full p-4 text-gray-900 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 bg-white h-40"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {errorMessage && <p className="mt-4 text-red-400 text-lg">{errorMessage}</p>}

          {/* Upload Button */}
          <button
            className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoverLetter;
