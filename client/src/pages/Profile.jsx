import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Import the Header component

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    profileImage: "https://img.freepik.com/premium-vector/round-gray-circle-with-simple-human-silhouette-light-gray-shadow-around-circle_213497-4963.jpg?w=826",
    resumeUrl: "", // Add resumeUrl
    coverLetterUrl: "", // Add coverLetterUrl
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get the token from localStorage
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUser({
          username: data.username,
          email: data.email,
          profileImage: data.profileImage || "https://img.freepik.com/premium-vector/round-gray-circle-with-simple-human-silhouette-light-gray-shadow-around-circle_213497-4963.jpg?w=826",
          resumeUrl: data.resumeUrl, // Add resumeUrl
          coverLetterUrl: data.coverLetterUrl, // Add coverLetterUrl
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    navigate("/"); // Redirect to the login page
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Add the Header component */}
      <Header />

      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-purple-500 mb-6">Profile</h2>
        <div className="flex flex-col items-center">
            {/* Profile Image */}
          <img
             src={user.profileImage}
             alt="Profile"
             className="w-32 h-32 rounded-full border-4 border-purple-500 mb-6"
           />
          {/* Username and Email */}
          <h3 className="text-2xl font-semibold text-gray-100">
            {user.username}
          </h3>
          <p className="text-lg text-gray-300 mt-2">{user.email}</p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Resume and Cover Letter Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-purple-500 mb-6">Saved</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume */}
            {user.resumeUrl && (
              <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-100">Resume</h4>
                <p className="text-gray-300 mt-2">Your uploaded resume</p>
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  View Resume
                </a>
              </div>
            )}

            {/* Cover Letter */}
            {user.coverLetterUrl && (
              <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-100">Cover Letter</h4>
                <p className="text-gray-300 mt-2">Your uploaded cover letter</p>
                <a
                  href={user.coverLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  View Cover Letter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;