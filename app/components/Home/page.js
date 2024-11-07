"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../Navbar/page';
import VoiceInput from '../VoiceInput/page';
// Dynamically import the PDF functionality to avoid SSR issues
const PDFDownloader = dynamic(() => import('../PDFDownloader/page'), {
  ssr: false
});

const fields = {
  name: { label: 'Full Name', placeholder: 'e.g., John Doe' },
  jobTitle: { label: 'Job Title', placeholder: 'e.g., Senior Software Engineer' },
  workExperience: { label: 'Work Experience', placeholder: 'e.g., 5 years in web development' },
  skills: { label: 'Key Skills', placeholder: 'e.g., React, Node.js, AWS' },
  goals: { label: 'Professional Goals', placeholder: 'e.g., Seeking senior leadership role' }
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function HomeContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    workExperience: '',
    skills: '',
    goals: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [generatedSummary, setGeneratedSummary] = useState('');

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      setGeneratedSummary(data.summary);
      setStep(2);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Professional CV Summary Generator
            </h1>
            <p className="text-gray-600">
              Create a compelling professional summary with AI assistance
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-xl p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {Object.entries(fields).map(([key, { label, placeholder }]) => (
                    <motion.div
                      key={key}
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData[key]}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          placeholder={placeholder}
                          className="w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <VoiceInput
                          onTranscriptReceived={(transcript) => {
                            setFormData(prev => ({
                              ...prev,
                              [key]: transcript
                            }));
                          }}
                          fieldLabel={label}
                        />
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5" />
                        <span>Generate Summary</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-xl p-8"
              >
                <div id="summary-pdf" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Professional Summary
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {generatedSummary}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Generate Another</span>
                  </motion.button>

                  <PDFDownloader 
                    content={generatedSummary}
                    fileName={`${formData.name.replace(/\s+/g, '_')}_CV_Summary`}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/resume')}
                    className="bg-green-600 text-white py-3 rounded-lg font-medium shadow-lg hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    <span>Build Full Resume</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default HomeContent;