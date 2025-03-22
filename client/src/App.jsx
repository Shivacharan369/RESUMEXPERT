import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/HomePage";
import Resume from "./pages/Resume";
import CoverLetter from "./pages/CoverLetter";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/coverletter" element={<CoverLetter />} />
      </Routes>
    </Router>
  );
};

export default App;
