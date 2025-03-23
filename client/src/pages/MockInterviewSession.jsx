import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MockInterviewSession = () => {
  const location = useLocation();
  const questions = location.state?.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const streamRef = useRef(null);

  // 🟢 Start Webcam
  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) recordedChunks.current.push(event.data);
        };
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
    startWebcam();

    return () => stopMedia(); // Cleanup
  }, []);

  // ⏳ Handle Timer & Question Progression
  useEffect(() => {
    if (currentQuestion < questions.length) {
      const timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else {
          stopRecording();

          setIsPaused(true);
          setTimeout(() => {
            uploadVideoResponse();
            if (currentQuestion + 1 < questions.length) {
              setCurrentQuestion((prev) => prev + 1);
              setTimeLeft(() => 60);
              setIsPaused(false);
              startRecording();
            } else {
              setInterviewCompleted(true);
              stopMedia();
            }
          }, 20000);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, currentQuestion]);

  // 🎥 Start Recording
  const startRecording = () => {
    recordedChunks.current = []; // Reset before starting
    mediaRecorderRef.current?.start();
  };

  // 🎥 Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = uploadVideoResponse; // Upload after stop
      mediaRecorderRef.current.stop();
    }
  };

  // 📤 Upload Video Response
  const uploadVideoResponse = async () => {
    if (recordedChunks.current.length === 0) return;

    const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", videoBlob, `response_${currentQuestion + 1}.webm`);

    try {
      const response = await fetch("http://localhost:5001/upload-responses", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // 🛑 Stop Media
  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-10">
      {!interviewCompleted ? (
        <>
          <video ref={videoRef} autoPlay className="w-1/2 rounded-lg shadow-lg border-2 border-purple-500" />
          {currentQuestion < questions.length ? (
            <div className="bg-gray-800 p-6 mt-5 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-purple-400">Question {currentQuestion + 1}</h2>
              <p className="text-lg mt-4">{questions[currentQuestion]}</p>
              <p className="text-xl text-yellow-400 mt-4">Time Left: {timeLeft}s</p>
              {isPaused && <p className="text-red-400">Next question in 20 seconds...</p>}
            </div>
          ) : null}
        </>
      ) : (
        <h2 className="text-3xl text-green-400 font-bold">🎉 Interview Completed! Camera & Mic Off</h2>
      )}
    </div>
  );
};

export default MockInterviewSession;
