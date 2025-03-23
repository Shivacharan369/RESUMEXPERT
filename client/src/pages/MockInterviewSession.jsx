import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MockInterviewSession = () => {
  const location = useLocation();
  const questions = location.state?.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [scores, setScores] = useState([]);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // 🟢 Start Webcam on Mount
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

        startInterview();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
    startWebcam();

    return () => stopMedia();
  }, []);

  // ⏳ Start Interview (Timer + Recording)
  const startInterview = () => {
    setCurrentQuestion(0);
    setInterviewCompleted(false);
    setScores([]);
    startTimer();
    startRecording();
  };

  // ⏳ Start Timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timerRef.current);
          stopRecording();
          return 0;
        }
      });
    }, 1000);
  };

  // 🎥 Start Recording
  const startRecording = () => {
    recordedChunks.current = [];
    if (mediaRecorderRef.current?.state !== "recording") {
      mediaRecorderRef.current?.start();
    }
  };

  // 🎥 Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = uploadVideoResponse;
      mediaRecorderRef.current.stop();
    }
  };

  // 📤 Upload Video Response & Handle Next Question
  const uploadVideoResponse = async () => {
    if (recordedChunks.current.length === 0) return;

    const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", videoBlob, `response_${currentQuestion + 1}.webm`);
    formData.append("question", questions[currentQuestion]);

    try {
      const response = await fetch("http://localhost:5001/grade-answer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      setScores((prevScores) => [...prevScores, data.evaluation]);

      if (currentQuestion + 1 < questions.length) {
        setTimeout(() => {
          setCurrentQuestion((prev) => prev + 1);
          setTimeLeft(30);
          startTimer();
          startRecording();
        }, 2000); // ✅ 2-second delay for a smoother transition
      } else {
        setInterviewCompleted(true);
        stopMedia();
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // 🛑 Stop Media (Camera & Mic)
  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-10">
      {!interviewCompleted ? (
        <>
          <video ref={videoRef} autoPlay className="w-1/2 rounded-lg shadow-lg border-2 border-purple-500" />
          {currentQuestion < questions.length && (
            <div className="bg-gray-800 p-6 mt-5 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-purple-400">Question {currentQuestion + 1}</h2>
              <p className="text-lg mt-4">{questions[currentQuestion]}</p>
              <p className="text-xl text-yellow-400 mt-4">Time Left: {timeLeft}s</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2 className="text-3xl text-green-400 font-bold">🎉 Interview Completed!</h2>
          <h3 className="text-2xl mt-4 text-yellow-400">Your Scores:</h3>
          <ul className="mt-4">
            {scores.map((score, index) => (
              <li key={index} className="text-white text-lg">
                Q{index + 1}: {score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MockInterviewSession;
