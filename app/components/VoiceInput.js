"use client";
import React, { useState, useRef } from 'react';
import { Mic, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInput = ({ onTranscriptReceived, fieldLabel }) => {
  const [status, setStatus] = useState('idle'); // idle, speaking, listening, success
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  const startVoiceInput = () => {
    if (status !== 'idle') return;

    const utterance = new SpeechSynthesisUtterance(`Please say your ${fieldLabel}`);
    utterance.onend = () => {
      setStatus('listening');
      startListening();
    };
    setStatus('speaking');
    window.speechSynthesis.speak(utterance);
    synthesisRef.current = utterance;
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setStatus('listening');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscriptReceived(transcript);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      };

      recognition.onerror = () => {
        setStatus('idle');
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        type="button"
        onClick={startVoiceInput}
        disabled={status !== 'idle'}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
          status === 'idle' ? 'hover:bg-gray-100' : ''
        }`}
        whileHover={{ scale: status === 'idle' ? 1.1 : 1 }}
        whileTap={{ scale: status === 'idle' ? 0.95 : 1 }}
      >
        {status === 'idle' && (
          <Mic className="w-5 h-5 text-gray-400 hover:text-blue-500" />
        )}
        {status === 'speaking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </motion.div>
        )}
        {status === 'listening' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Mic className="w-5 h-5 text-red-500 animate-pulse" />
          </motion.div>
        )}
        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="w-5 h-5 text-green-500" />
          </motion.div>
        )}
      </motion.button>
    </AnimatePresence>
  );
};

export default VoiceInput;