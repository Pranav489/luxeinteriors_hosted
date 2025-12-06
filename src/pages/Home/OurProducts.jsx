import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiChevronDown,
  FiX,
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail,
  FiPhoneCall,
  FiMessageCircle,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../services/api";

// Contact Form Popup Component
// Contact Form Popup Component
const ContactFormPopup = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  isLoading,
  errors = {},
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-[95vw] max-w-[650px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-[#ADB79C] to-[#7D8570] text-white">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Quick Enquiry</h3>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              {formData.category || "Product Inquiry"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-1 sm:p-2 rounded-full hover:bg-white/20"
            disabled={isLoading}
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <form onSubmit={onSubmit} className="h-full flex flex-col">
            <div className="space-y-3 sm:space-y-4 flex-1">
              {/* Name - Required */}
              <div>
                <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    disabled={isLoading}
                    data-error={!!errors.name}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email & Phone - Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                      disabled={isLoading}
                      data-error={!!errors.email}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <FiPhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      required
                      disabled={isLoading}
                      data-error={!!errors.phone}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                      placeholder="Your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                  Product Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] bg-[#E8EBDF] text-sm ${
                    isLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder="Product category"
                  readOnly
                />
              </div>

              {/* Product */}
              {formData.product && (
                <div>
                  <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                    Product
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={onChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] bg-[#E8EBDF] text-sm ${
                      isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    placeholder="Product name"
                    readOnly
                  />
                </div>
              )}

              {/* Message - Optional (Removed required attribute) */}
              <div className="flex-1 min-h-[100px] sm:min-h-[120px]">
                <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                  Message
                </label>
                <div className="relative h-full">
                  <FiMessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    disabled={isLoading}
                    className={`w-full h-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm resize-none ${
                      isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    placeholder="Your requirements (optional)..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex-shrink-0 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#ADB79C] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm sm:text-base ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#3F4A2E] transform hover:scale-[1.02]"
                }`}
                // Additional prevention for rapid clicks
                onClick={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Enquiry"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Product Card Component with improved UI
const ProductCard = ({ product, onClick, onEnquireNow, categoryMap }) => {
  const navigate = useNavigate();

  const hasMainImage =
    product?.image &&
    typeof product.image === "string" &&
    product.image.trim() !== "";
  const hasVideos =
    product?.videos &&
    (Array.isArray(product.videos)
      ? product.videos.some((v) => v && typeof v === "string" && v.trim())
      : typeof product.videos === "string" && product.videos.trim());
  const hasAdditionalImages =
    Array.isArray(product?.features) &&
    product.features.some(
      (f) => f?.image && typeof f.image === "string" && f.image.trim()
    );

  // Get first available image
  const firstImage = hasMainImage
    ? product.image
    : hasAdditionalImages
    ? product.features.find((f) => f?.image)?.image
    : null;

  // Handle category click
  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation();
    const path = categoryName?.toLowerCase()?.replace(/\s+/g, "-");
    if (path) {
      navigate(`/services/${path}`);
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
      }}
      className="bg-white rounded-xl overflow-hidden border border-[#E8EBDF] transition-all cursor-pointer group"
      onClick={(e) => onClick(product, e)}
    >
      {/* Larger Image Container */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-[#E8EBDF]">
        {/* Priority: 1. Main image, 2. Video, 3. First additional image, 4. Placeholder */}
        {hasMainImage ? (
          <img
            src={`https://metrowardrobe.demovoting.com/uploads/${product.image}`}
            alt={product?.image_alt || product?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
              e.target.parentElement.innerHTML = hasVideos
                ? videoPlaceholder()
                : hasAdditionalImages
                ? additionalImagePlaceholder()
                : noMediaPlaceholder();
            }}
          />
        ) : hasVideos ? (
          videoPlaceholder()
        ) : hasAdditionalImages ? (
          <img
            src={`https://metrowardrobe.demovoting.com/uploads/${firstImage}`}
            alt={product.features.find((f) => f?.image)?.alt || product?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          noMediaPlaceholder()
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <svg
                className="w-6 h-6 text-[#3F4A2E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* {product.category?.name && (
          <button
            onClick={(e) => handleCategoryClick(e, product.category.name)}
            className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-[#E8EBDF] hover:bg-[#D4CBB3] border border-[#ADB79C] text-[#3F4A2E] hover:text-[#7D8570] transition-all duration-200 group/category cursor-pointer"
          >
            <span className="text-sm">{product.category?.icon}</span>
            <span className="text-xs font-medium">
              {product.category?.name}
            </span>
            <svg
              className="w-3 h-3 opacity-0 group-hover/category:opacity-100 transform translate-x-0 group-hover/category:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )} */}

        <h3 className="text-xl font-bold text-[#3F4A2E] mb-3 line-clamp-2 group-hover:text-[#7D8570] transition-colors">
          {product?.title}
        </h3>

        <p className="text-[#7D8570] mb-5 line-clamp-3 text-sm leading-relaxed">
          {product?.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnquireNow(product);
          }}
          className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
        >
          Enquire Now
        </button>
      </div>
    </motion.div>
  );
};

// Placeholder functions
const videoPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#E8EBDF] to-[#D4CBB3] flex flex-col items-center justify-center group">
    <div className="w-16 h-16 bg-[#ADB79C] rounded-full flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
      <FiPlay className="text-white text-2xl" />
    </div>
    <span className="text-sm text-center text-[#3F4A2E] font-medium">
      Click to view video
    </span>
    <p className="text-xs text-[#7D8570] mt-1">Video content available</p>
  </div>
);

const additionalImagePlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#E8EBDF] to-[#D4CBB3] flex flex-col items-center justify-center p-4 group">
    <div className="w-16 h-16 bg-[#ADB79C] rounded-full flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <span className="text-sm text-center text-[#3F4A2E] font-medium">
      View Gallery
    </span>
    <p className="text-xs text-[#7D8570] mt-1">Multiple images available</p>
  </div>
);

const noMediaPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#E8EBDF] to-[#D4CBB3] flex flex-col items-center justify-center group">
    <div className="w-16 h-16 bg-[#7D8570] rounded-full flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <span className="text-sm text-center text-[#3F4A2E] font-medium">
      Product Image
    </span>
    <p className="text-xs text-[#7D8570] mt-1">No media available</p>
  </div>
);

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    category: activeFilter || "",
    product: "",
  });
  const navigate = useNavigate();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Add this ref for extra double submission protection
  const isSubmittingRef = React.useRef(false);

  // Add form errors state and loading state for form submission
  const [formErrors, setFormErrors] = useState({});
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/products"),
          axiosInstance.get("/productcategories"),
        ]);

        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open contact form with product data
  // Add form errors state and loading state for form submission
  // Validation function
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!contactFormData.name.trim()) {
      errors.name = "Name is required";
    } else if (contactFormData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!contactFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFormData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!contactFormData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(
        contactFormData.phone.replace(/\s/g, "")
      )
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open contact form with product data
  const openContactForm = (product = null) => {
    setContactFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      category: product?.category?.name || activeFilter || "",
      product: product?.title || "",
    });
    setFormErrors({});
    setShowContactForm(true);
  };

  // Handle contact form input changes
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle contact form submission with validation and double submission prevention
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission - check both state and ref
    if (isSubmittingRef.current || isContactSubmitting) {
      console.log("Form submission blocked - already in progress");
      return;
    }

    // Validate form (only Name, Email, Phone - Message is optional)
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Set both state and ref to prevent double submission
    isSubmittingRef.current = true;
    setIsContactSubmitting(true);

    try {
      const response = await axiosInstance.post("/product-inquiries", {
        ...contactFormData,
        // Ensure message is sent even if empty
        message: contactFormData.message || "No message provided",
      });

      if (response.data.success) {
        const queryParams = new URLSearchParams({
          product: contactFormData.product,
          category: contactFormData.category,
        }).toString();

        navigate(`/thankyou?${queryParams}`);

        setShowContactForm(false);
        setContactFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          category: activeFilter || "",
          product: "",
        });
        setFormErrors({});
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
      // Always reset both state and ref, whether success or error
      isSubmittingRef.current = false;
      setIsContactSubmitting(false);
    }
  };

  // Close contact form with double submission check
  const closeContactForm = () => {
    if (!isContactSubmitting && !isSubmittingRef.current) {
      setShowContactForm(false);
      setContactFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        category: activeFilter || "",
        product: "",
      });
      setFormErrors({});
    }
  };

  // Handle URL parameter for product ID
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId && products.length > 0) {
      const product = products.find((p) => p.id.toString() === productId);
      if (product) {
        setSelectedProduct(product);
        setActiveMediaIndex(0);
      }
    }
  }, [searchParams, products]);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = {
      icon: category.icon,
      descriptor: category.product_descriptor,
    };
    return acc;
  }, {});

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category?.name === activeFilter);

  const handleProductClick = (product, e) => {
    if (e.target.closest("button")) return;
    setSelectedProduct(product);
    setActiveMediaIndex(0);
    navigate(`?product=${product.id}`, { replace: true });
  };

  const closeModal = () => {
    setSelectedProduct(null);
    navigate("", { replace: true });
  };

  // Get all media items for a product
  const getProductMedia = (product) => {
    const media = [];

    // 1. Add features images first (if they exist)
    if (Array.isArray(product?.features)) {
      product.features.forEach((feature) => {
        if (
          feature?.image &&
          typeof feature.image === "string" &&
          feature.image.trim()
        ) {
          media.push({
            type: "image",
            src: `https://metrowardrobe.demovoting.com/uploads/${feature.image.trim()}`,
            alt: feature?.alt || `${product.title || "Product"} feature`,
          });
        }
      });
    }

    // 2. Add main image if exists
    if (
      product?.image &&
      typeof product.image === "string" &&
      product.image.trim()
    ) {
      media.unshift({
        type: "image",
        src: `https://metrowardrobe.demovoting.com/uploads/${product.image.trim()}`,
        alt: product?.image_alt || product?.title || "Main product image",
      });
    }

    // 3. Add videos if they exist
    if (product?.videos) {
      const videoArray = Array.isArray(product.videos)
        ? product.videos
        : [product.videos];
      videoArray.forEach((videoPath) => {
        if (videoPath && typeof videoPath === "string" && videoPath.trim()) {
          media.push({
            type: "video",
            src: `https://metrowardrobe.demovoting.com/uploads/${videoPath.trim()}`,
            alt: `${product?.title || "Product"} video`,
          });
        }
      });
    }

    return media;
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

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" id="products">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-[#3F4A2E] mb-3">
            Our Service Range
          </h2>
          <motion.div
            className="h-1 w-16 bg-[#ADB79C] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-[#7D8570] max-w-2xl mx-auto">
            Explore premium doors, windows, and security solutions for modern
            London homes.
          </p>
        </motion.div>

        
        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
              onEnquireNow={openContactForm}
              categoryMap={categoryMap}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[#7D8570] text-lg">
              No products found.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-[#3F4A2E] font-medium hover:text-[#7D8570]"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Product Popup */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "95vw", maxHeight: "95vh" }}
            >
              <button
                className="fixed top-3 right-3 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-[#E8EBDF] md:absolute md:top-3 md:right-3"
                onClick={closeModal}
              >
                <FiX className="text-[#3F4A2E] text-lg" />
              </button>

              <div className="p-4 sm:p-6">
                {/* Header Section - Compact */}
                <h3 className="text-xl font-bold text-[#3F4A2E] mb-2">
                  {selectedProduct.title}
                </h3>
                <p className="text-[#7D8570] mb-4 text-sm leading-relaxed line-clamp-3">
                  {selectedProduct.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-[#3F4A2E] mb-3 text-base">
                    Product Gallery
                  </h4>

                  {/* Main Media Display - Natural Size */}
                  <div className="relative mb-3 rounded-lg overflow-hidden bg-[#E8EBDF] flex justify-center">
                    {getProductMedia(selectedProduct).length > 0 ? (
                      getProductMedia(selectedProduct)[activeMediaIndex]
                        .type === "video" ? (
                        <video
                          controls
                          className="max-w-full max-h-[70vh] object-contain"
                          src={
                            getProductMedia(selectedProduct)[activeMediaIndex]
                              .src
                          }
                        />
                      ) : (
                        <img
                          src={
                            getProductMedia(selectedProduct)[activeMediaIndex]
                              .src
                          }
                          alt={
                            getProductMedia(selectedProduct)[activeMediaIndex]
                              .alt
                          }
                          className="max-w-full max-h-[70vh] object-contain"
                          onLoad={(e) => {
                          }}
                        />
                      )
                    ) : (
                      <div className="w-64 h-48 flex items-center justify-center text-[#7D8570]">
                        No media available
                      </div>
                    )}

                    {/* Navigation arrows if multiple media items */}
                    {getProductMedia(selectedProduct).length > 1 && (
                      <div className="flex justify-between absolute top-1/2 left-2 right-2 transform -translate-y-1/2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIndex((prev) =>
                              prev === 0
                                ? getProductMedia(selectedProduct).length - 1
                                : prev - 1
                            );
                          }}
                          className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                        >
                          <FiChevronLeft className="text-[#3F4A2E] text-lg" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIndex((prev) =>
                              prev ===
                              getProductMedia(selectedProduct).length - 1
                                ? 0
                                : prev + 1
                            );
                          }}
                          className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                        >
                          <FiChevronRight className="text-[#3F4A2E] text-lg" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Grid - Compact */}
                  {getProductMedia(selectedProduct).length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-w-2xl mx-auto">
                      {getProductMedia(selectedProduct).map((media, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIndex(index);
                          }}
                          className={`relative h-14 rounded overflow-hidden border transition-all ${
                            activeMediaIndex === index
                              ? "border-[#ADB79C] shadow-sm"
                              : "border-[#E8EBDF] hover:border-[#7D8570]"
                          }`}
                        >
                          {media.type === "video" ? (
                            <div className="w-full h-full bg-[#E8EBDF] flex items-center justify-center relative">
                              <FiPlay className="text-[#7D8570] text-xs" />
                              <div className="absolute bottom-0 right-0 bg-[#3F4A2E] bg-opacity-70 text-white text-[9px] px-1 rounded-tl">
                                Video
                              </div>
                            </div>
                          ) : (
                            <img
                              src={media.src}
                              alt={media.alt}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="max-w-2xl mx-auto">
                  <button
                    onClick={() => {
                      openContactForm(selectedProduct);
                      closeModal();
                    }}
                    className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm hover:shadow-md text-sm"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Popup */}
      <AnimatePresence>
        {showContactForm && (
          <ContactFormPopup
            formData={contactFormData}
            onChange={handleContactFormChange}
            onSubmit={handleContactFormSubmit}
            onClose={closeContactForm}
            isLoading={isContactSubmitting} // Add this line
            errors={formErrors} // Also add this if you want error display
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurProducts;
