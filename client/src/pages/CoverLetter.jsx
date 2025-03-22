import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaFileWord, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../assets/bg.jpg";
import clImage from "../assets/cl.png"; // Cover Letter Image
import cvImage from "../assets/cv.png"; // Hero Section Image

const CoverLetter = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const removeFile = () => setFile(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("coverLetter", file);

    try {
      const response = await fetch("http://localhost:5000/upload-cover-letter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/cover-score");
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
      {/* 📌 Cover Letter Upload Section */}
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

          {/* Dropzone Section */}
          <div
            {...getRootProps()}
            className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all"
          >
            <input {...getInputProps()} />
            {!file ? (
              <>
                <p className="text-gray-300 text-2xl font-medium">Drop your cover letter or choose file</p>
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

      {/* 📌 Image Section */}
      <div className=" border -t w-full flex justify-center py-10">
        <img
          src={clImage}
          alt="Cover Letter Illustration"
          className="w-[40%] rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
        />
      </div>

      {/* 📌 Hero Section (Now Below the Image Section) */}
      <div className="border -t border-color-white flex flex-col md:flex-row items-center justify-center py-16 px-10 bg-black">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={cvImage}
            alt="CV Illustration"
            className="w-[80%] md:w-[70%] rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
          />
        </div>

        {/* Right: Text Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8">
          <h2 className="text-4xl font-bold text-white transition transform hover:text-purple-400 hover:scale-105">
            Why Cover Letters Are Important
          </h2>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            A well-crafted cover letter provides a strong first impression, highlights your most relevant skills, 
            and explains why you're the perfect fit for the job. It complements your resume and sets you apart from 
            other candidates.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoverLetter;
