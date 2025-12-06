import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await axios.get("https://metrowardrobe.demovoting.com/api/gallery");
        setImages(response.data.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Navigation functions for main carousel
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Navigation functions for modal
  const nextModalImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Open modal with specific image
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextModalImage();
      if (e.key === "ArrowLeft") prevModalImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  if (loading) {
      return (
        <div className="h-[600px] md:h-[700px] flex items-center justify-center bg-[#E8EBDF]">
          <div className="text-center">
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <div className="w-16 h-16 border-4 border-[#ADB79C] border-t-transparent rounded-full"></div>
            </motion.div>
            <motion.h2
              className="text-2xl font-semibold text-[#3F4A2E]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Loading...
            </motion.h2>
            <motion.p
              className="text-[#7D8570] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Preparing your experience
            </motion.p>
          </div>
        </div>
      );
    }

  return (
    <section className="bg-[#e8ebdf] pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3F4A2E] mb-4">
            Our Work Gallery
          </h2>
          <motion.div
            className="h-1 w-16 bg-[#ADB79C] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-[#7D8570] max-w-2xl mx-auto">
            Discover our latest projects and creative work in this curated collection
          </p>
        </motion.div>

        {/* Main Featured Image */}
        <div className="mb-8">
          <motion.div
            className="relative aspect-square max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full cursor-pointer group"
                onClick={() => openModal(currentIndex)}
              >
                <img
                  src={`https://metrowardrobe.demovoting.com/uploads/${images[currentIndex]?.src}`}
                  alt={images[currentIndex]?.alt || "Gallery image"}
                  className="w-full h-full object-contain "
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>

                {/* Image info
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold mb-1">
                    {images[currentIndex]?.category}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {currentIndex + 1} of {images.length}
                  </p>
                </div> */}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10  bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Thumbnail Grid
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 ${
                index === currentIndex
                  ? "ring-4 ring-[#adb79c] scale-105 shadow-lg"
                  : "hover:scale-105 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={`https://metrowardrobe.demovoting.com/uploads/${image.src}`}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </motion.div> */}

        {/* Image Counter */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[#5a6450] font-medium">
            <span className="text-[#3f4a2e] font-bold">{currentIndex + 1}</span>
            {" "}of{" "}
            <span className="text-[#3f4a2e] font-bold">{images.length}</span>
          </p>
        </motion.div>

        {/* Modal for Fullscreen View */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="relative max-w-xl max-h-full w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute -top-6 -right-12 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Main Modal Image */}
                <div className="relative aspect-square bg-black rounded-2xl overflow-hidden">
                  <img
                    src={`https://metrowardrobe.demovoting.com/uploads/${images[selectedImageIndex]?.src}`}
                    alt={images[selectedImageIndex]?.alt}
                    className="w-full h-full object-contain"
                  />

                  {/* Modal Navigation Arrows */}
                  <button
                    onClick={prevModalImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Modal Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {images[selectedImageIndex]?.category}
                    </h3>
                    <p className="text-gray-300">
                      {selectedImageIndex + 1} of {images.length}
                    </p>
                  </div>
                </div>

                {/* Modal Thumbnails */}
                <div className="flex gap-2 mt-4 justify-center overflow-x-auto py-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all ${index === selectedImageIndex
                          ? "ring-2 ring-white scale-110"
                          : "opacity-60 hover:opacity-100"
                        }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={`https://metrowardrobe.demovoting.com/uploads/${image.src}`}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;