import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  DoorOpen,
  Play,
  X,
  User,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import axiosInstance, { IMAGE_PATH } from "../../services/api";

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false); // Add this line
  const [designFormData, setDesignFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    best_time_to_reach: "",
    address: "",
    message: "",
  });
  const navigate = useNavigate();

  // Check if mobile on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/herocontent");
        setHeroContent(response.data || []);
      } catch (err) {
        setError("Failed to load content. Please try again later.");
        setHeroContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || heroContent.length === 0) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, heroContent]);

  const nextImage = () => {
    if (heroContent.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
  };

  const prevImage = () => {
    if (heroContent.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + heroContent.length) % heroContent.length
    );
  };

  const selectImage = (index) => {
    if (index !== currentIndex && heroContent.length > 0) {
      setCurrentIndex(index);
    }
  };

  // Function to get full image URL - now properly handles mobile and desktop images
  const getImageUrl = (item) => {
    if (!item) return "";

    // Use mobile_image_url for mobile, desktop_image_url for desktop
    // Fallback to image_url for backward compatibility
    const imagePath = isMobile
      ? item.mobile_image_url || item.desktop_image_url || item.image_url
      : item.desktop_image_url || item.image_url;

    if (!imagePath) return "";

    // If imagePath is already a full URL, return it
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // Otherwise, construct the full URL using IMAGE_PATH
    return `${IMAGE_PATH}/${imagePath}`;
  };

  // Handle form input changes
  const handleDesignFormChange = (e) => {
    const { name, value } = e.target;
    setDesignFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleDesignFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isDesignSubmitting) return;

    // Client-side validation for mandatory fields only
    if (
      !designFormData.name?.trim() ||
      !designFormData.email?.trim() ||
      !designFormData.phone?.trim() ||
      !designFormData.postcode?.trim()
    ) {
      alert(
        "Please fill in all mandatory fields: Name, Email, Phone, and Postcode"
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(designFormData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Set submitting state to true
    setIsDesignSubmitting(true);

    try {
      const response = await axiosInstance.post("/contact-inquiries", {
        ...designFormData,
        inquiry_type: "design_consultation",
        category: "",
      });

      if (response.data.success) {
        // Reset form
        setDesignFormData({
          name: "",
          email: "",
          phone: "",
          postcode: "",
          best_time_to_reach: "",
          address: "",
          message: "",
        });

        // Close the form
        setShowDesignForm(false);

        // Navigate to thank you page
        navigate("/thankyou");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        alert(`Please fix the following errors: ${errorMessages}`);
      } else {
        alert("There was an error submitting your form. Please try again.");
      }
      console.error("Form submission error:", error);
    } finally {
      // Reset submitting state regardless of success or error
      setIsDesignSubmitting(false);
    }
  };

  // Close form handler
  const handleCloseForm = () => {
    setShowDesignForm(false);
    // Reset form data after a delay to allow animation to complete
    setTimeout(() => {
      setDesignFormData({
        name: "",
        email: "",
        phone: "",
        postcode: "",
        best_time_to_reach: "",
        address: "",
        message: "",
      });
    }, 300);
  };

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

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center text-[#7D8570]">
        {error}
      </div>
    );
  }

  if (heroContent.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center text-[#7D8570]">
        No hero content available
      </div>
    );
  }

  const currentItem = heroContent[currentIndex] || {};

  return (
    <div className="relative w-full">
      {/* Background blur when popup is open */}
      <AnimatePresence>
        {showDesignForm && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Free Design Visit Form Popup */}
      <AnimatePresence>
        {showDesignForm && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseForm}
          >
            <motion.div
              className="relative bg-white rounded-2xl w-[95vw] max-w-[650px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col z-[110]"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex-shrink-0 flex justify-between items-center p-5 bg-gradient-to-r from-[#ADB79C] to-[#7D8570] text-white">
                <div>
                  <h3 className="text-xl font-bold">
                    Free Design Consultation
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    Get free design consultation at your location
                  </p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <form
                  onSubmit={handleDesignFormSubmit}
                  className="h-full flex flex-col"
                >
                  {/* Fields Grid with more spacing */}
                  <div className="space-y-4 flex-1">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="name"
                          value={designFormData.name}
                          onChange={handleDesignFormChange}
                          required
                          disabled={isDesignSubmitting}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={designFormData.email}
                            onChange={handleDesignFormChange}
                            required
                            disabled={isDesignSubmitting}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="phone"
                            value={designFormData.phone}
                            onChange={handleDesignFormChange}
                            required
                            disabled={isDesignSubmitting}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PostCode */}
                    <div>
                      <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                        PostCode *
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={designFormData.postcode}
                        onChange={handleDesignFormChange}
                        required
                        disabled={isDesignSubmitting}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your postcode"
                      />
                    </div>

                    {/* Best Time to Reach */}
                    <div>
                      <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                        When's the best time to reach you? (9am–6pm)
                      </label>
                      <select
                        name="best_time_to_reach"
                        value={designFormData.best_time_to_reach}
                        onChange={handleDesignFormChange}
                        disabled={isDesignSubmitting}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select preferred time</option>
                        <option value="9am-10am">9:00 AM - 10:00 AM</option>
                        <option value="10am-11am">10:00 AM - 11:00 AM</option>
                        <option value="11am-12pm">11:00 AM - 12:00 PM</option>
                        <option value="12pm-1pm">12:00 PM - 1:00 PM</option>
                        <option value="1pm-2pm">1:00 PM - 2:00 PM</option>
                        <option value="2pm-3pm">2:00 PM - 3:00 PM</option>
                        <option value="3pm-4pm">3:00 PM - 4:00 PM</option>
                        <option value="4pm-5pm">4:00 PM - 5:00 PM</option>
                        <option value="5pm-6pm">5:00 PM - 6:00 PM</option>
                        <option value="anytime">Anytime between 9am-6pm</option>
                      </select>
                    </div>

                    {/* Address - Optional */}
                    <div>
                      <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                        Full Address (Optional)
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={designFormData.address}
                        onChange={handleDesignFormChange}
                        disabled={isDesignSubmitting}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Your complete address (optional)"
                      />
                    </div>

                    {/* Project Requirements - More height */}
                    <div className="flex-1 min-h-[140px]">
                      <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                        Please describe your project requirements in detail
                      </label>
                      <div className="relative h-full">
                        <MessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          name="message"
                          value={designFormData.message}
                          onChange={handleDesignFormChange}
                          disabled={isDesignSubmitting}
                          className="w-full h-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Tell us about your project - room dimensions, preferred materials, budget, timeline, specific requirements..."
                          rows="5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={isDesignSubmitting}
                      className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ADB79C] flex items-center justify-center"
                    >
                      {isDesignSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Schedule Free Design Consultation"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div
        className="relative w-full h-[450px] sm:h-[550px] md:min-h-screen flex items-center justify-start text-white overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(currentItem)}
              alt=""
              className="h-full w-full object-cover object-center"
            />
            {/* Enhanced gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent"></div>
          </div>
        </AnimatePresence>

        {/* Play Button - Hidden on mobile if it's covering content */}
        {currentItem.video_url && (
          <motion.a
            href={`${currentItem.video_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex absolute z-20 left-4 md:left-16 top-1/2 transform -translate-y-1/2 bg-[#ADB79C] hover:bg-[#3F4A2E] text-white p-3 md:p-6 rounded-full shadow-lg items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Play className="w-4 h-4 md:w-8 md:h-8" />
          </motion.a>
        )}

        {/* Navigation Arrows */}
        {heroContent.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-10 backdrop-blur-sm transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-white w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-10 backdrop-blur-sm transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="text-white w-6 h-6" />
            </button>
          </>
        )}

        {/* Optimized Text Content */}
        <motion.div
          className="relative z-10 flex flex-col justify-center items-start w-full px-4 sm:px-6 md:px-0 md:max-w-2xl mx-2 sm:mx-4 md:mx-16 lg:mx-24"
          key={currentItem.id || currentIndex}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {currentItem.ctaHighlight && (
            <motion.div
              className="inline-block bg-[#ADB79C] text-white px-3 py-1.5 rounded-full mb-3 text-xs font-medium"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {currentItem.ctaHighlight}
            </motion.div>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-left leading-tight">
            {currentItem.title || "Welcome to Capital Bedrooms"}
          </h1>

          {currentItem.description && (
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-md sm:max-w-lg leading-relaxed">
              {currentItem.description.length > 120
                ? `${currentItem.description.substring(0, 120)}...`
                : currentItem.description}
            </p>
          )}
        </motion.div>

        {/* Indicators - Moved up on mobile */}
        {heroContent.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  currentIndex === index ? "bg-[#ADB79C] sm:w-6" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation Container - Positioned right after hero */}
      {heroContent.length > 1 && (
        <div className="px-4 w-full mt-4">
          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#D4CBB3]">
              <div className="flex justify-around gap-4 overflow-x-auto">
                {heroContent.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    onClick={() => selectImage(index)}
                    className={`cursor-pointer group relative rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      currentIndex === index
                        ? "ring-2 ring-[#ADB79C]"
                        : "ring-1 ring-[#E8EBDF]"
                    }`}
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative h-20 w-32 md:h-40 md:w-52">
                      {/* Use appropriate image for thumbnail based on screen size */}
                      <img
                        src={getImageUrl(item)}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-all ${
                          currentIndex === index
                            ? "bg-black/40"
                            : "bg-black/20 group-hover:bg-black/30"
                        }`}
                      >
                        <Play
                          className={`w-5 h-5 ${
                            currentIndex === index
                              ? "text-white"
                              : "text-white/80 group-hover:text-white"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white font-medium truncate">
                        {item.ctaHighlight || `Slide ${index + 1}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
