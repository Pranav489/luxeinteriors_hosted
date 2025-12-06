import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
  FiPlay,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail,
  FiPhoneCall,
  FiMessageCircle,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import axiosInstance from "../../services/api";
import ThankYouPage from "../ThankYou/ThankYouPage";
import { carousel1, carousel2, carousel3 } from "../../../public/assets";
import { BadgeCheck, Factory, Hammer, Ruler, Shield } from "lucide-react";
import { useSEO } from "../../hooks/useSEO";
import GallerySection from "../Home/GallerySection";

const ProductsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(category || "All");
  const [contactData, setContactData] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    category: activeFilter || "",
    product: "",
  });
  const sampleImages = [carousel1, carousel2, carousel3];
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // State for all data
  const [data, setData] = useState({
    products: [],
    categories: [],
    testimonials: [],
    faqs: [],
    categoryIcons: {},
  });

  // Check if we're on the main services page or a category page
  const isMainServicesPage = !category; // No category in URL means /services
  const isCategoryPage = !!category; // Has category in URL means /services/category-name

  // Get current category
  const currentCategoryForFAQs =
    activeFilter === "All"
      ? null
      : data.categories.find((cat) => cat?.name === activeFilter) || null;

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all data in parallel
        const [
          productsRes,
          categoriesRes,
          testimonialsRes,
          faqsRes,
          contactRes,
        ] = await Promise.all([
          axiosInstance.get("/products"),
          axiosInstance.get("/productcategories"),
          axiosInstance.get("/customertestimonials"),
          axiosInstance.get("/faqs"),
          axiosInstance.get("/contact"),
        ]);

        // Create category icons mapping from categories data
        const categoryIcons = {};
        categoriesRes?.data?.data?.forEach((cat) => {
          if (cat?.name) {
            categoryIcons[cat.name] = cat?.icon;
          }
        });

        setData({
          products: productsRes?.data?.data || [],
          categories: categoriesRes?.data?.data || [],
          testimonials: testimonialsRes?.data?.data || [],
          faqs: faqsRes?.data?.data || [],
          categoryIcons,
        });
        setContactData(contactRes?.data || null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openContactForm = (product = null) => {
    setContactFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      category: activeFilter || "",
      product: product?.title || "",
    });
    setShowContactForm(true);
  };

  // Handle contact form input changes
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useSEO(category || "services");

  // In ProductsPage component, update the handleContactFormSubmit function
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isContactSubmitting) return;

    setIsContactSubmitting(true);

    try {
      const response = await axiosInstance.post("/product-inquiries", {
        ...contactFormData,
        inquiry_type: "design_consultation", // Change from "product_inquiry" to "design_consultation"
        postcode: "N/A", // Add postcode field with default value since it's required
      });

      if (response.data.success) {
        // Reset form
        setContactFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          product: "",
          message: "",
        });

        // Close the form
        setShowContactForm(false);

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
      setIsContactSubmitting(false);
    }
  };

  // Set initial filter based on URL
  useEffect(() => {
    if (category && data?.categories?.length > 0) {
      // Find the category that matches the URL path
      const matchedCategory = data.categories.find(
        (cat) => cat?.name?.toLowerCase()?.replace(/\s+/g, "-") === category
      );
      if (matchedCategory?.name) {
        setActiveFilter(matchedCategory.name);
      }
    } else {
      // If no category in URL, default to "All"
      setActiveFilter("All");
    }
  }, [category, data.categories]);

  // Get current category from URL for benefits section
  const currentCategoryFromURL = useMemo(() => {
    if (!category || !data.categories.length) return null;
    // Try different matching strategies
    const matchedCategory = data.categories.find((cat) => {
      const categoryName = cat?.name?.toLowerCase();
      const urlCategory = category.toLowerCase();
      // Exact match with hyphens
      if (categoryName?.replace(/\s+/g, "-") === urlCategory) return true;
      // Contains match
      if (
        categoryName?.includes(urlCategory.replace(/-/g, " ")) ||
        urlCategory.includes(categoryName?.replace(/\s+/g, "-"))
      )
        return true;
      // Partial match
      if (
        categoryName
          ?.replace(/\s+/g, "")
          .includes(urlCategory.replace(/-/g, "")) ||
        urlCategory
          .replace(/-/g, "")
          .includes(categoryName?.replace(/\s+/g, ""))
      )
        return true;
      return false;
    });
    return matchedCategory || null;
  }, [category, data.categories]);

  // Filter products
  const filteredProducts =
    activeFilter === "All"
      ? data.products
      : data.products.filter((product) => {
          const productCategory = data.categories.find(
            (cat) => cat.id === product?.category_id
          );
          return productCategory?.name === activeFilter;
        });

  // Toggle FAQ
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleProductClick = (product, e) => {
    // Don't open popup if click was on the Enquire Now button
    if (e.target.closest("button")) return;
    setSelectedProduct(product);
  };

  // Carousel navigation
  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) =>
      prev === sampleImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) =>
      prev === 0 ? sampleImages.length - 1 : prev - 1
    );
  };

  // Handle filter click - Only filter, no navigation
  const handleFilterClick = (categoryName) => {
    setActiveFilter(categoryName);
    setShowMobileFilters(false); // Close mobile dropdown when filter is selected
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-[#E8EBDF]">
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

  if (error) return <ErrorDisplay message={error} />;

  return (
    <section className="bg-white mt-20">
      <AnimatePresence>
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            categoryIcons={data.categoryIcons}
            onClose={() => setSelectedProduct(null)}
            navigate={navigate}
            sampleImages={sampleImages}
            onEnquireNow={openContactForm}
          />
        )}
      </AnimatePresence>

      {/* Contact Form Popup */}
      <AnimatePresence>
        {showContactForm && (
          <ContactFormPopup
            formData={contactFormData}
            onChange={handleContactFormChange}
            onSubmit={handleContactFormSubmit}
            onClose={() => setShowContactForm(false)}
            isLoading={isContactSubmitting} // Pass the loading state
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          category={category}
          navigate={navigate}
          categories={data.categories}
        />

        {/* Dynamic Category Header */}
        <CategoryHeader
          category={category}
          activeFilter={activeFilter}
          categories={data.categories}
          filteredProducts={filteredProducts}
        />

        {/* Form and Carousel Section */}
        <FormCarouselSection
          currentCarouselIndex={currentCarouselIndex}
          nextCarousel={nextCarousel}
          prevCarousel={prevCarousel}
          sampleImages={sampleImages}
          activeFilter={activeFilter}
        />

        {/* Category Filters - ONLY SHOW ON MAIN SERVICES PAGE */}
        {isMainServicesPage && (
          <>
            {/* Desktop Filter Bar - Hidden on mobile */}
            <motion.div
              className="hidden md:flex flex-wrap justify-center gap-3 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* All Products Filter */}
              <button
                onClick={() => handleFilterClick("All")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === "All"
                    ? "bg-[#ADB79C] text-white shadow-md"
                    : "bg-[#E8EBDF] text-[#3F4A2E] hover:bg-[#D4CBB3]"
                }`}
              >
                All Products
              </button>

              {/* Category Filters */}
              {data.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterClick(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeFilter === cat.name
                      ? "bg-[#ADB79C] text-white shadow-md"
                      : "bg-[#E8EBDF] text-[#3F4A2E] hover:bg-[#D4CBB3]"
                  }`}
                >
                  <span className="text-lg">{cat?.icon}</span>
                  {cat.name}
                </button>
              ))}
            </motion.div>

            {/* Mobile Filter - ONLY SHOW ON MAIN SERVICES PAGE */}
            <div className="md:hidden mb-6 relative">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center justify-between w-full max-w-xs mx-auto bg-[#ADB79C] text-white px-5 py-3 rounded-full shadow"
              >
                <div className="flex items-center gap-2">
                  <FiFilter />
                  <span>
                    {activeFilter === "All" ? "All Categories" : activeFilter}
                  </span>
                </div>
                <FiChevronDown
                  className={`transition-transform ${
                    showMobileFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile Dropdown */}
              {showMobileFilters && (
                <motion.div
                  className="absolute z-10 w-full max-w-xs mx-auto mt-2 bg-white rounded-lg shadow-xl overflow-hidden border border-[#E8EBDF]"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  {/* All Categories Option */}
                  <button
                    onClick={() => handleFilterClick("All")}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left ${
                      activeFilter === "All"
                        ? "bg-[#E8EBDF] text-[#3F4A2E]"
                        : "hover:bg-[#F8F9F5]"
                    }`}
                  >
                    <span>All Categories</span>
                  </button>

                  {/* Category Options */}
                  {data.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterClick(cat.name)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left ${
                        activeFilter === cat.name
                          ? "bg-[#E8EBDF] text-[#3F4A2E]"
                          : "hover:bg-[#F8F9F5]"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Category Benefits - ONLY SHOW ON CATEGORY PAGES AND BASED ON URL */}
        {isCategoryPage && currentCategoryFromURL && (
          <CategoryBenefits
            category={currentCategoryFromURL}
            categories={data.categories}
          />
        )}

        {/* Product Grid */}
        {filteredProducts?.length > 0 ? (
          <ProductGrid
            filteredProducts={filteredProducts}
            categories={data.categories}
            categoryIcons={data.categoryIcons}
            onProductClick={handleProductClick}
            onEnquireNow={openContactForm}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-[#7D8570] text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => handleFilterClick("All")}
              className="mt-4 text-[#3F4A2E] font-medium hover:text-[#7D8570]"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Common Sections */}
        <WhyChooseUs
          items={[
            {
              icon: <Ruler size={36} className="text-[#ADB79C]" />,
              title: "Made-to-Measure Precision",
              desc: "Tailor-made wardrobes for a flawless fit and more storage.",
            },
            {
              icon: <Hammer size={36} className="text-[#ADB79C]" />,
              title: "Premium Materials & Craftsmanship",
              desc: "Premium materials + soft-close design for long-lasting quality.",
            },
            {
              icon: <Shield size={36} className="text-[#ADB79C]" />,
              title: "Expert Installation",
              desc: "Free design consultation and expert installation, start to finish.",
            },
            {
              icon: <Factory size={36} className="text-[#ADB79C]" />,
              title: "Direct from Manufacturer",
              desc: "No middlemen — just Capital Bedrooms quality, factory-direct.",
            },
            {
              icon: <BadgeCheck size={36} className="text-[#ADB79C]" />,
              title: "10-Year Guarantee",
              desc: "Backed by a 10-year guarantee for lasting confidence and quality.",
            },
          ]}
        />

        {/* <TestimonialsSection testimonials={data.testimonials} /> */}

        <FAQSection
          faqs={data.faqs} // Pass the faqs array from your API response
          activeFAQ={activeFAQ}
          toggleFAQ={toggleFAQ}
          categories={data.categories}
          currentCategory={currentCategoryForFAQs}
        />

        <CTASection contactData={contactData} />
        <GalleryPage contactData={contactData} />
      </div>
    </section>
  );
};

// Contact Form Popup Component
const ContactFormPopup = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  isLoading = false,
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
            disabled={isLoading}
            className="text-white/80 hover:text-white transition p-1 sm:p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Form Content - Better mobile responsiveness */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <form onSubmit={onSubmit} className="h-full flex flex-col">
            {/* Fields Grid with responsive spacing */}
            <div className="space-y-3 sm:space-y-4 flex-1">
              {/* Name */}
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
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email & Phone - Stack on mobile */}
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
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your email"
                    />
                  </div>
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
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your phone"
                    />
                  </div>
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
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] bg-[#E8EBDF] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] bg-[#E8EBDF] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Product name"
                    readOnly
                  />
                </div>
              )}

              {/* Message - Better mobile height */}
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
                    className="w-full h-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your requirements..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Better mobile spacing */}
            <div className="flex-shrink-0 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ADB79C] flex items-center justify-center"
              >
                {isLoading ? (
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

// Updated FormCarouselSection component with Free Design Visit Form
const FormCarouselSection = ({ nextCarousel, prevCarousel, activeFilter }) => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false);

  // Add navigate hook
  const navigate = useNavigate();

  // Free Design Visit Form State
  const [designFormData, setDesignFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    best_time_to_reach: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await axiosInstance.get("/carousel");
        setCarouselItems(response.data || []);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
        setCarouselItems([]);
      } finally {
        setCarouselLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  // Safe navigation functions
  const safeNextImage = () => {
    if (carouselItems.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const safePrevImage = () => {
    if (carouselItems.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const safeSelectImage = (index) => {
    if (carouselItems.length === 0) return;
    if (
      index >= 0 &&
      index < carouselItems.length &&
      index !== currentCarouselIndex
    ) {
      setCurrentCarouselIndex(index);
    }
  };

  // Auto-play effect with safe navigation
  useEffect(() => {
    if (!isAutoPlaying || carouselItems.length === 0) return;
    const interval = setInterval(safeNextImage, 5000);
    return () => clearInterval(interval);
  }, [currentCarouselIndex, isAutoPlaying, carouselItems]);

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

    // Basic client-side validation for mandatory fields
    if (
      !designFormData.name ||
      !designFormData.email ||
      !designFormData.phone ||
      !designFormData.postcode
    ) {
      alert(
        "Please fill in all mandatory fields: Name, Email, Phone, and Postcode"
      );
      return;
    }

    setIsDesignSubmitting(true);

    try {
      const response = await axiosInstance.post("/contact-inquiries", {
        ...designFormData,
        inquiry_type: "design_consultation",
        category: activeFilter || "",
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
      setIsDesignSubmitting(false);
    }
  };

  // If no carousel items, don't render the section
  if (carouselLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg border border-[#E8EBDF] overflow-hidden flex flex-col">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-[#E8EBDF] rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-[#E8EBDF] rounded w-3/4 mb-6"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-[485px] h-[485px] bg-[#E8EBDF] rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (carouselItems.length === 0) {
    return null;
  }

  const currentItem = carouselItems[currentCarouselIndex] || {};

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Free Design Visit Form Section */}
      <div className="bg-white rounded-xl shadow-lg border border-[#E8EBDF] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#ADB79C] to-[#7D8570] text-white">
          <h3 className="text-xl font-bold mb-2">Book Free Design Visit</h3>
          <p className="text-white/80 text-sm">
            Get free design consultation at your location
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleDesignFormSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={designFormData.name}
                  onChange={handleDesignFormChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
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
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={designFormData.email}
                    onChange={handleDesignFormChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
                    placeholder="Your email"
                  />
                </div>
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
                    value={designFormData.phone}
                    onChange={handleDesignFormChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            {/* PostCode */}
            <div>
              <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                Post Code *
              </label>
              <input
                type="text"
                name="postcode"
                value={designFormData.postcode}
                onChange={handleDesignFormChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors"
                placeholder="Your complete address (optional)"
              />
            </div>

            {/* Project Requirements */}
            <div>
              <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                Please describe your project requirements in detail
              </label>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="message"
                  value={designFormData.message}
                  onChange={handleDesignFormChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm resize-none transition-colors min-h-[120px]"
                  placeholder="Tell us about your project - room dimensions, preferred materials, budget, timeline, specific requirements..."
                  rows="4"
                />
              </div>
            </div>

            {/* Submit Button */}
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
                "Schedule Free Design Visit"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-[#7D8570] border-t border-[#E8EBDF]">
          <p>We respect your privacy and will never share your information</p>
        </div>
      </div>

      {/* Dynamic Carousel Section - Responsive sizing */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[485px]">
          <div
            className="relative bg-[#E8EBDF] rounded-xl shadow-lg overflow-hidden w-full h-[300px] sm:h-[400px] lg:w-[485px] lg:h-[485px]"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              {currentItem && currentItem.image_url ? (
                <motion.img
                  key={currentItem.id || currentCarouselIndex}
                  src={`https://metrowardrobe.demovoting.com/uploads/${currentItem.image_url}`}
                  alt={currentItem.title || "Carousel image"}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#D4CBB3] flex items-center justify-center">
                        <span class="text-[#7D8570]">Image not available</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#D4CBB3] flex items-center justify-center">
                  <span className="text-[#7D8570]">No image available</span>
                </div>
              )}
            </AnimatePresence>

            {/* Carousel Navigation - Hide on mobile */}
            {carouselItems.length > 1 && (
              <>
                <button
                  onClick={safePrevImage}
                  className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#3F4A2E] rounded-full p-2 shadow-lg transition-all"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={safeNextImage}
                  className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#3F4A2E] rounded-full p-2 shadow-lg transition-all"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Carousel Indicators */}
            {carouselItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => safeSelectImage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentCarouselIndex === index
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Updated Product Popup Component for ProductsPage
const ProductPopup = ({
  product,
  categoryIcons,
  onClose,
  navigate,
  onEnquireNow,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState("image");

  // Get all media items
  const allMedia = React.useMemo(() => {
    const media = [];

    // 1. Add features images if they exist
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
            alt: feature?.alt || "Product feature",
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
      const videos = Array.isArray(product.videos)
        ? product.videos
        : [product.videos];
      videos.forEach((video) => {
        if (video && typeof video === "string" && video.trim()) {
          media.push({
            type: "video",
            src: `https://metrowardrobe.demovoting.com/uploads/${video.trim()}`,
            alt: `${product?.title || "Product"} video`,
          });
        }
      });
    }

    return media;
  }, [product]);

  const hasMultipleMedia = allMedia.length > 1;

  // Navigation functions
  const goToPrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const goToNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  // Set media type when current index changes
  useEffect(() => {
    if (allMedia[currentMediaIndex]) {
      setMediaType(allMedia[currentMediaIndex].type);
    }
  }, [currentMediaIndex, allMedia]);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
          onClick={onClose}
        >
          <FiX className="text-[#3F4A2E] text-lg" />
        </button>

        <div className="p-4 sm:p-6">
          {/* Header Section - Compact */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {categoryIcons[product?.category?.name]}
            </span>
            <span className="text-xs font-medium text-[#3F4A2E]">
              {product?.category?.name}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#3F4A2E] mb-2">
            {product?.title}
          </h3>
          <p className="text-[#7D8570] mb-4 text-sm leading-relaxed line-clamp-3">
            {product?.description}
          </p>

          {/* Enhanced Media Gallery - Natural Size */}
          <div className="mb-4">
            <h4 className="font-semibold text-[#3F4A2E] mb-3 text-base">
              Product Gallery
            </h4>

            {/* Main Media Display - Natural Size */}
            <div className="relative mb-3 rounded-lg overflow-hidden bg-[#E8EBDF] flex justify-center">
              {allMedia.length > 0 ? (
                mediaType === "image" ? (
                  <img
                    src={allMedia[currentMediaIndex].src}
                    alt={allMedia[currentMediaIndex].alt}
                    className="max-w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-48 flex items-center justify-center text-[#7D8570]">
                          Image not available
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <video
                    key={allMedia[currentMediaIndex].src}
                    controls
                    className="max-w-full max-h-[70vh] object-contain"
                    src={allMedia[currentMediaIndex].src}
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="w-64 h-48 flex items-center justify-center text-[#7D8570]">
                  No media available
                </div>
              )}

              {hasMultipleMedia && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevMedia();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                  >
                    <FiChevronLeft className="text-[#3F4A2E] text-lg" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextMedia();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                  >
                    <FiChevronRight className="text-[#3F4A2E] text-lg" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid - Compact */}
            {hasMultipleMedia && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-w-2xl mx-auto">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMediaIndex(index);
                      setMediaType(media.type);
                    }}
                    className={`relative h-14 rounded overflow-hidden border transition-all ${
                      currentMediaIndex === index
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-[#E8EBDF] flex items-center justify-center">
                              <span class="text-xs text-[#7D8570]">Image</span>
                            </div>
                          `;
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specifications and Features - Compact Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4 max-w-4xl">
            {product?.specifications &&
              typeof product.specifications === "string" && (
                <div>
                  <h4 className="font-semibold text-[#3F4A2E] mb-2 text-sm">
                    Specifications
                  </h4>
                  <ul className="text-[#7D8570] space-y-1 text-xs">
                    {product.specifications
                      .split("\n")
                      .filter((spec) => spec.trim() !== "")
                      .map((spec, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[#ADB79C] mr-2 mt-0.5 flex-shrink-0">
                            •
                          </span>
                          <span className="flex-1">{spec.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {product?.features && typeof product.features === "string" && (
              <div>
                <h4 className="font-semibold text-[#3F4A2E] mb-2 text-sm">
                  Features
                </h4>
                <ul className="text-[#7D8570] space-y-1 text-xs">
                  {product.features
                    .split("\n")
                    .filter((feature) => feature.trim() !== "")
                    .map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#ADB79C] mr-2 mt-0.5 flex-shrink-0">
                          •
                        </span>
                        <span className="flex-1">{feature.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => {
                onEnquireNow(product);
                onClose();
              }}
              className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm hover:shadow-md text-sm"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Error Display Component
const ErrorDisplay = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto mt-10">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          {message || "An error occurred while loading data."}
        </p>
      </div>
    </div>
  </div>
);

// Component: Breadcrumbs
const Breadcrumbs = ({ category, navigate, categories = [] }) => {
  // Generate path map dynamically from categories
  const pathToCategoryMap = categories.reduce((acc, cat) => {
    const path = cat?.name?.toLowerCase()?.replace(/\s+/g, "-");
    if (path) {
      acc[path] = cat.name;
    }
    return acc;
  }, {});

  return (
    <div className="flex items-center mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#3F4A2E] hover:text-[#7D8570] mr-4"
      >
        <FiArrowLeft className="mr-1" /> Back
      </button>
      <nav className="text-sm text-[#7D8570]">
        <span
          className="hover:text-[#3F4A2E] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </span>
        <span className="mx-2">/</span>
        <span
          className="hover:text-[#3F4A2E] cursor-pointer"
          onClick={() => navigate("/services")}
        >
          Services
        </span>
        {category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-[#3F4A2E]">
              {categories.find(
                (cat) =>
                  cat?.name?.toLowerCase()?.replace(/\s+/g, "-") === category
              )?.name || category.replace(/-/g, " ")}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};

// Component: Category Header
const CategoryHeader = ({
  category,
  activeFilter,
  categories = [],
  filteredProducts = [],
}) => {
  // Find current category details
  const currentCategory =
    categories.find(
      (cat) =>
        cat?.name ===
        (activeFilter || (category && category.replace(/-/g, " ")))
    ) || {};

  return (
    <motion.div
      className="text-left mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold text-[#3F4A2E] mb-3">
        {category
          ? currentCategory?.subtitle ||
            category.replace(/-/g, " ").toUpperCase()
          : "Luxury Fitted Interiors"}
      </h2>
      <motion.div
        className="h-1 w-16 bg-[#ADB79C] mb-6"
        initial={{ width: 0 }}
        animate={{ width: "4rem" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <p className="text-[#7D8570] max-w-2xl mb-4">
        {currentCategory?.description ||
          "Explore our complete range of bespoke fitted furniture — where design precision meets timeless craftsmanship."}
      </p>
      <p className="text-[#7D8570] text-sm">
        {category
          ? currentCategory?.collection_text_template
            ? currentCategory.collection_text_template
                ?.replace("{category}", currentCategory.name?.toLowerCase())
                ?.replace("{count}", filteredProducts.length)
                ?.replace(
                  "{descriptor}",
                  currentCategory.product_descriptor?.toLowerCase() ||
                    "products"
                )
            : `Browse our ${currentCategory.name?.toLowerCase()} collection`
          : currentCategory?.homepage_text ||
            "Trusted by 5000+ homeowners across London and the UK"}
      </p>
    </motion.div>
  );
};

// Updated CategoryBenefits component with fully dynamic layout
const CategoryBenefits = ({ category }) => {
  if (!category) return null;

  const benefits = category.benefits || [];
  if (benefits.length === 0) return null;

  // Determine grid layout based on number of benefits
  const getGridClass = () => {
    if (benefits.length === 1) {
      return "grid-cols-1 max-w-md mx-auto";
    } else if (benefits.length === 2) {
      return "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto";
    } else {
      return "grid-cols-1 md:grid-cols-3";
    }
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-center text-[#3F4A2E] mb-8">
        Why Choose Our {category.name}?
      </h3>
      <div className={`grid ${getGridClass()} gap-6 place-items-center`}>
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center p-4">
            <div className="text-[#ADB79C] text-3xl mb-3">✓</div>
            <h4 className="font-semibold text-[#3F4A2E] text-lg mb-2">
              {benefit.title}
            </h4>
            {benefit.description && (
              <p className="text-[#7D8570] text-sm">{benefit.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component: Product Grid
const ProductGrid = ({
  filteredProducts = [],
  categories = [],
  categoryIcons = {},
  onProductClick,
  onEnquireNow,
}) => (
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
        key={product?.id}
        product={product}
        categories={categories}
        categoryIcons={categoryIcons}
        onClick={onProductClick}
        onEnquireNow={onEnquireNow}
      />
    ))}
  </motion.div>
);

// Component: Product Card - Updated to prioritize images over videos
const ProductCard = ({
  product,
  categories = [],
  categoryIcons = {},
  onClick,
  onEnquireNow,
}) => {
  const category = categories.find((cat) => cat?.id === product?.category_id);
  const navigate = useNavigate();

  // Check media availability
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
        {/* Category Badge - Now in content area and clickable */}
        {category && (
          <button
            onClick={(e) => handleCategoryClick(e, category.name)}
            className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-[#E8EBDF] hover:bg-[#D4CBB3] border border-[#ADB79C] text-[#3F4A2E] hover:text-[#7D8570] transition-all duration-200 group/category"
          >
            <span className="text-sm">{categoryIcons[category?.name]}</span>
            <span className="text-xs font-medium">{category?.name}</span>
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
        )}

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

function videoPlaceholder() {
  return (
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
}

function additionalImagePlaceholder() {
  return (
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
}

function noMediaPlaceholder() {
  return (
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
}

// Component: Why Choose Us
const WhyChooseUs = ({ items }) => (
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-[#3F4A2E]">
      Why Choose Capital Bedrooms?
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {items.map((item, index) => (
        <div key={index} className="text-center p-4">
          <div className="flex justify-center mb-3 text-[#ADB79C]">
            {item.icon}
          </div>
          <h4 className="font-semibold text-lg mb-1 text-[#3F4A2E]">
            {item.title}
          </h4>
          <p className="text-[#7D8570] text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Updated FAQSection component for ProductsPage
const FAQSection = ({
  faqs = [],
  activeFAQ,
  toggleFAQ,
  categories = [],
  currentCategory = null,
}) => {
  // Get FAQs for the current category
  const currentCategoryFAQs = React.useMemo(() => {
    if (!currentCategory || !faqs.length) return [];
    // Find the category that matches the current page category
    const matchedCategory = faqs.find(
      (cat) =>
        cat.id === currentCategory.id ||
        cat.name?.toLowerCase() === currentCategory.name?.toLowerCase()
    );
    return matchedCategory ? matchedCategory.faqs : [];
  }, [faqs, currentCategory]);

  // If no FAQs available for this category
  if (!currentCategoryFAQs || currentCategoryFAQs.length === 0) {
    return (
      <div className="mt-16 border-t border-[#E8EBDF] pt-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-[#3F4A2E]">
          {currentCategory
            ? `${currentCategory.name} FAQs`
            : "Frequently Asked Questions"}
        </h3>
        <div className="text-center text-[#7D8570]">
          <p>
            No FAQs available for {currentCategory?.name || "this category"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="mt-16 border-t border-[#E8EBDF] pt-12">
      <motion.h3 className="text-2xl font-bold text-center mb-8 text-[#3F4A2E]">
        Frequently Asked Questions
      </motion.h3>
      <div className="max-w-4xl mx-auto space-y-4">
        {currentCategoryFAQs.map((faq, index) => {
          const faqId = `faq-${currentCategory?.id || "general"}-${index}`;
          const isActive = activeFAQ === faqId;

          return (
            <motion.div
              key={faq.id || index}
              className="border-b border-[#E8EBDF] pb-4 last:border-b-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.button
                className="flex justify-between items-center w-full text-left font-medium text-[#3F4A2E] hover:text-[#7D8570] transition-colors p-4 rounded-lg hover:bg-[#E8EBDF] border border-transparent hover:border-[#ADB79C]"
                onClick={() => toggleFAQ(faqId)}
                whileHover={{
                  backgroundColor: "rgba(173, 183, 156, 0.05)",
                  borderColor: "rgba(173, 183, 156, 0.2)",
                }}
              >
                <span className="text-lg pr-4 flex-1 text-left">
                  {faq.question}
                </span>
                <motion.span
                  className="text-xl text-[#ADB79C] ml-4 flex-shrink-0"
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FiChevronDown />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      marginTop: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginTop: "0.75rem",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      marginTop: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-4 bg-[#E8EBDF] rounded-lg border border-[#ADB79C] shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <div
                        className="prose max-w-none text-[#7D8570] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Gallerypage
const GalleryPage = () => {
  return (
    <motion.section
      className="pt-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <GallerySection />
    </motion.section>
  );
};

// Component: CTA
const CTASection = ({ contactData }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 bg-[#E8EBDF] rounded-xl p-8 text-center border border-[#D4CBB3]">
      <h3 className="text-2xl font-bold text-[#3F4A2E] mb-4">
        Ready to Transform Your Space?
      </h3>
      <p className="text-[#7D8570] max-w-2xl mx-auto mb-6">
        Get expert advice and a free quote for your project today.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`tel:${contactData?.mobile_number || "905321121"}`}
          className="flex items-center justify-center bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-medium py-3 px-6 rounded-lg transition duration-300"
        >
          <FiPhone className="mr-2" /> Call Now
        </a>
        <a
          href={`https://wa.me/${contactData?.whatsapp_number}?text=Hello%20there!`}
          className="flex items-center justify-center border border-[#ADB79C] text-[#3F4A2E] hover:bg-[#F8F9F5] font-medium py-3 px-6 rounded-lg transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiMessageSquare className="mr-2" /> WhatsApp Us
        </a>
      </div>
    </div>
  );
};

export default ProductsPage;
