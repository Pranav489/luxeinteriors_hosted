import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiPhone, FiMessageSquare, FiHome, FiShoppingBag, FiDroplet, FiDollarSign } from 'react-icons/fi';
import { TfiRulerAlt } from 'react-icons/tfi';

const ThankYou = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const product = searchParams.get('product');
  const category = searchParams.get('category');

  return (
    <div className="min-h-screen bg-[#e8ebdf] pt-24 pb-8 flex items-start justify-center">
      <div className="container mx-auto px-4 pt-8">
        <motion.div
          className="bg-white rounded-2xl w-full max-w-5xl mx-auto overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-[#3f4a2e] to-[#7d8570] py-10 px-8 text-center text-white">
            {/* Success Icon */}
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <svg
                className="w-10 h-10 text-[#3f4a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            {/* Confetti Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#d4cbb3] rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.06,
                    repeat: 0,
                  }}
                />
              ))}
            </div>

            <motion.h1
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank You for Your Interest!
            </motion.h1>

            <motion.p
              className="text-lg leading-relaxed opacity-95 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Thank you for sharing your details! Our design expert will get in touch within 24 hours to arrange your free design visit.
            </motion.p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10">
            {/* Process Steps - 3 Column Grid */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#3f4a2e] mb-3">
                What happens during your design visit?
              </h2>
            </motion.div>

            {/* 3 Column Grid for Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <motion.div
                className="bg-[#e8ebdf] rounded-xl p-6 text-center border border-[#adb79c] hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-[#adb79c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDroplet className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#7d8570] rounded-full flex items-center justify-center mx-auto -mt-8 mb-2 text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#3f4a2e] mb-3">
                  Requirements Discussion
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your designer will discuss your requirements, show you material samples, and understand your needs in detail.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="bg-[#e8ebdf] rounded-xl p-6 text-center border border-[#adb79c] hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-16 h-16 bg-[#7d8570] rounded-full flex items-center justify-center mx-auto mb-4">
                  <TfiRulerAlt className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#3f4a2e] rounded-full flex items-center justify-center mx-auto -mt-8 mb-2 text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#3f4a2e] mb-3">
                  3D Design Creation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  They'll take precise measurements of your space and create a detailed 3D design — completely free of charge.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="bg-[#e8ebdf] rounded-xl p-6 text-center border border-[#adb79c] hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-16 h-16 bg-[#d4cbb3] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="w-7 h-7 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#7d8570] rounded-full flex items-center justify-center mx-auto -mt-8 mb-2 text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#3f4a2e] mb-3">
                  No-Obligation Quote
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You'll then receive a no-obligation quote tailored to your project with transparent pricing.
                </p>
              </motion.div>
            </div>

            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;