// import React, { useState } from "react";

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleToggle = () => {
//     setIsLogin(!isLogin);
//     setError("");
//     setSuccess("");
//     setFormData({ username: "", email: "", password: "" });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const endpoint = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         setError(data.error);
//       } else {
//         setSuccess(isLogin ? "Login Successful!" : "Registration Successful!");
//       }
//     } catch (error) {
//       setError("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white">
//       <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 text-center">
//         <h2 className="text-2xl font-bold text-purple-400">{isLogin ? "Login" : "Register"}</h2>
//         <form onSubmit={handleSubmit} className="mt-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//               required
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//             required
//           />
//           {error && <p className="text-red-500">{error}</p>}
//           {success && <p className="text-green-500">{success}</p>}
//           <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded mt-2">
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>
//         <p className="mt-4 text-gray-400 cursor-pointer" onClick={handleToggle}>
//           {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

import React, { useState } from "react";
import Header from "../components/Header";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthPage, setIsAuthPage] = useState(true); // Track if user is on auth page

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setSuccess(isLogin ? "Login Successful!" : "Registration Successful!");
        localStorage.setItem("authToken", data.token);
        setIsAuthPage(false); // Hide auth page and show header
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {/* Conditionally render Header */}
      {!isAuthPage && <Header />}

      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-purple-400">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded mt-2">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-gray-400 cursor-pointer" onClick={handleToggle}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;