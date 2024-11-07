import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import {
  FaFileAlt,
  FaLightbulb,
  FaMicrophone,
  FaDownload,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Feature = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="text-4xl text-blue-600 mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />

      <header className="pt-32 pb-20 text-center bg-gradient-to-b from-blue-400 to-blue-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4"
        >
          Welcome to Resume Builder & Summarizer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl mb-8"
        >
          Create professional resumes and summaries with AI assistance
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick("/resume")}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Build Resume
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick("/summarizer")}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Generate Summary
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature
            icon={<FaFileAlt />}
            title="Resume Builder"
            description="Create professional resumes with ease using our intuitive builder."
            index={0}
          />
          <Feature
            icon={<FaLightbulb />}
            title="AI-Powered Enhancements"
            description="Enhance your resume descriptions with AI-generated suggestions."
            index={1}
          />
          <Feature
            icon={<FaMicrophone />}
            title="Voice Input"
            description="Fill out your resume using voice commands for a seamless experience."
            index={2}
          />
          <Feature
            icon={<FaDownload />}
            title="PDF Export"
            description="Download your resume as a PDF with a single click."
            index={3}
          />
          <Feature
            icon={<FaSyncAlt />}
            title="Dynamic Updates"
            description="Easily update and rearrange your resume sections with drag-and-drop functionality."
            index={4}
          />

          <Feature
            icon={<FaArrowRight />}
            title="Professional Summary"
            description="Generate a compelling professional summary with AI assistance."
            index={5}
          />
        </div>
      </main>

      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Resume Builder & Summarizer. All rights reserved.</p>
        </div>
      </footer>

      <Link
        to="top"
        smooth={true}
        duration={500}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </Link>
    </div>
  );
};

export default LandingPage;
