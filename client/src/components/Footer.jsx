import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        
        {/* Left Section - Company Info */}
        <div className="md:w-1/3 text-center md:text-left">
          <h3 className="text-lg font-bold">ResumeXpert</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            ResumeXpert is an AI-powered platform that helps job seekers craft winning resumes by optimizing them for ATS compatibility. With features like AI-driven resume scanning, cover letter generation, expert career blogs, and profile management, ResumeXpert enhances your job search success.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="md:w-1/3 text-center md:text-centre">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-purple-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">About</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Right Section - Social Media */}
        <div className="md:w-1/3 text-center md:text-left">
          <h3 className="text-lg font-bold">Follow Us</h3>
          <div className="mt-2 flex flex-col gap-2 items-center md:items-start">
            <a href="#" className="hover:text-purple-400 transition" aria-label="LinkedIn">🔗 LinkedIn</a>
            <a href="#" className="hover:text-purple-400 transition" aria-label="Twitter">🐦 Twitter</a>
            <a href="#" className="hover:text-purple-400 transition" aria-label="Facebook">📘 Facebook</a>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} ResumeXpert. All rights reserved.</p>
        <p className="mt-2">
          Developed by <span className="text-purple-400">Shivacharan, Vatsal, Hema, Anish, Bharath</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
