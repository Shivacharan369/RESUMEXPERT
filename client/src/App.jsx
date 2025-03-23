import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/HomePage";
import Resume from "./pages/Resume";
import CoverLetter from "./pages/CoverLetter";
import MockInterview from "./pages/MockInterview";
import MockInterviewSession from "./pages/MockInterviewSession";  // Import the missing component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/coverletter" element={<CoverLetter />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/mock-interview-session" element={<MockInterviewSession />} /> 
      </Routes>
    </Router>
  );
};

export default App;
