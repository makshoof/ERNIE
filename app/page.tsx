'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, Loader2, Image as ImageIcon, X, Sparkles } from 'lucide-react';

interface AnalysisResult {
  analysis: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !question.trim()) {
      setError('Please upload an image and enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('question', question);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || 'Failed to analyze image';
        throw new Error(errorMsg);
      }

      const data: AnalysisResult = await response.json();
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-primary-600 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ERNIE Inspection Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered multimodal analysis for industrial inspection and safety
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Image Upload Area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Upload Image
              </h2>
              
              {!image ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-12 text-center cursor-pointer bg-gradient-to-br from-primary-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 transition-all hover:border-primary-500 dark:hover:border-primary-500"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Question Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Ask a Question
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What safety issues do you see? Are there any maintenance concerns? What improvements would you suggest?"
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none transition-all"
                  disabled={loading || !image}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !image || !question.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Analyze Image
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700 min-h-[600px]">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                AI Analysis
              </h2>

              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[500px]"
                  >
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Analyzing your image...
                    </p>
                    <motion.div
                      className="mt-4 flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-primary-600 rounded-full"
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-800 dark:text-red-200"
                  >
                    <p className="font-semibold mb-2">Error</p>
                    <p>{error}</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-lg dark:prose-invert max-w-none"
                  >
                    <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 border border-primary-200 dark:border-slate-600">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed">
                        {result.split('\n').map((line, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="mb-3"
                          >
                            {line}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {!loading && !error && !result && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-[500px] text-gray-400 dark:text-gray-500"
                  >
                    <Sparkles className="w-24 h-24 mb-4 opacity-50" />
                    <p className="text-lg">Upload an image and ask a question to get started</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

