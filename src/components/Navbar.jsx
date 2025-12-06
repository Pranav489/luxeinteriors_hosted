import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiPhone,
  FiMessageSquare,
  FiHome,
  FiShoppingBag,
  FiDroplet,
  FiDollarSign,
} from "react-icons/fi";
import { TfiRulerAlt } from "react-icons/tfi";
import { Menu, X, ChevronDown, Calendar, Ruler } from "lucide-react";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import { navlogo } from "../../public/assets";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhoneCall,
  FiMessageCircle,
} from "react-icons/fi";
import axiosInstance from "../services/api";

const ContactFormPopup = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  formType,
  isLoading = false,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white rounded-2xl w-[95vw] max-w-[650px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col z-[110]"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.3,
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-5 bg-gradient-to-r from-[#ADB79C] to-[#7D8570] text-white">
          <div>
            <h3 className="text-xl font-bold">
              {formType === "showroom"
                ? "Book Showroom Visit"
                : "Book Free Design Visit"}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {formType === "showroom"
                ? "Schedule your visit to our factory outlet"
                : "Get free design consultation at your location"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/20"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <form onSubmit={onSubmit} className="h-full flex flex-col">
            {/* Fields Grid with more spacing */}
            <div className="space-y-4 flex-1">
              {/* Name - MANDATORY */}
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
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email & Phone - MANDATORY */}
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
                      value={formData.email}
                      onChange={onChange}
                      required
                      disabled={isLoading}
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
                    <FiPhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* PostCode - MANDATORY for both forms */}
              <div>
                <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                  PostCode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={onChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your postcode"
                />
              </div>

              {/* Best Time to Reach - OPTIONAL for Design Consultation */}
              {formType === "design" && (
                <div>
                  <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                    When's the best time to reach you? (9am–6pm)
                  </label>
                  <select
                    name="best_time_to_reach"
                    value={formData.best_time_to_reach}
                    onChange={onChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select preferred time (optional)</option>
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
              )}

              {/* Date & Time for Showroom Visit - OPTIONAL */}
              {formType === "showroom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={onChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                      Preferred Time
                    </label>
                    <select
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={onChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select time (optional)</option>
                      <option value="09:00-10:00">09:00 - 10:00</option>
                      <option value="10:00-11:00">10:00 - 11:00</option>
                      <option value="11:00-12:00">11:00 - 12:00</option>
                      <option value="12:00-13:00">12:00 - 13:00</option>
                      <option value="13:00-14:00">13:00 - 14:00</option>
                      <option value="14:00-15:00">14:00 - 15:00</option>
                      <option value="15:00-16:00">15:00 - 16:00</option>
                      <option value="16:00-17:00">16:00 - 17:00</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Address for Design Consultation - OPTIONAL */}
              {formType === "design" && (
                <div>
                  <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                    Full Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your complete address (optional)"
                  />
                </div>
              )}

              {/* Project Requirements - OPTIONAL */}
              <div className="flex-1 min-h-[140px]">
                <label className="block text-sm font-medium text-[#3F4A2E] mb-1">
                  {formType === "showroom"
                    ? "Additional Requirements"
                    : "Please describe your project requirements in detail"}
                </label>
                <div className="relative h-full">
                  <FiMessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    disabled={isLoading}
                    className="w-full h-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ADB79C] focus:border-[#ADB79C] text-sm resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={
                      formType === "showroom"
                        ? "Any specific products you want to see... (optional)"
                        : "Tell us about your project - room dimensions, preferred materials, budget, timeline, specific requirements... (optional)"
                    }
                    rows="5"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 pt-4 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ADB79C] hover:bg-[#3F4A2E] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ADB79C] flex items-center justify-center"
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
                ) : formType === "showroom" ? (
                  "Book Visit"
                ) : (
                  "Schedule Free Design Consultation"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); // 'showroom' or 'design'
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    postcode: "", 
    best_time_to_reach: "", 
    preferred_date: "",
    preferred_time: "",
    address: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (index) =>
    setOpenDropdown(openDropdown === index ? null : index);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/contact");
        // console.log(response);
        setContactData(response.data || null);
      } catch (error) {
        console.error("Error fetching contact information:", error);
        setContactData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Change to solid navbar after scrolling 100px
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generatePath = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
  };

  const handleFormOpen = (type) => {
    setFormType(type);
    setShowForm(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleFormClose = () => {
    setShowForm(false);
    setFormType("");
    setIsSubmitting(false); // Add this line
    // Reset form data after a delay to allow animation to complete
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        postcode: "",
        best_time_to_reach: "",
        preferred_date: "",
        preferred_time: "",
        address: "",
      });
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for mandatory fields only
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.postcode
    ) {
      alert(
        "Please fill in all mandatory fields: Name, Email, Phone, and Postcode"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Your API call here
      const response = await axiosInstance.post("/contact-inquiries", {
        ...formData,
        inquiry_type:
          formType === "showroom" ? "showroom_visit" : "design_consultation",
      });

      if (response.data.success) {
        // Handle success
        handleFormClose();
        navigate("/thankyou");
      }
    } catch (error) {
      // Handle error
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { label: "HOME", path: "/" },
    {
      label: "ABOUT US",
      submenu: [
        { label: "Company Overview", path: "/aboutus#overview" },
        { label: "Vision & Mission", path: "/aboutus#vision" },
        { label: "Manufacturing Facility", path: "/aboutus#facility" },
        { label: "Our Values", path: "/aboutus#values" },
      ],
    },
    // {
    //   label: "SERVICES",
    //   submenu: [
    //     ...categories?.map((category) => ({
    //       label: category.name,
    //       path: `/services/${generatePath(category.name)}`,
    //     })),
    //     { label: "All Products", path: "/services" },
    //   ],
    // },
  ];

  // Navbar background classes based on scroll state and page
  const navbarBackgroundClass = isHomePage
    ? isScrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm"
      : "bg-transparent"
    : "bg-white shadow-sm";

  // Text color classes based on scroll state and page
  const textColorClass =
    isHomePage && !isScrolled ? "text-white" : "text-[#3F4A2E]";
  const hoverTextColorClass =
    isHomePage && !isScrolled ? "hover:text-white/80" : "hover:text-[#7D8570]";



  return (
    <header className="relative z-40">
      {/* Top Contact Bar - Only show when scrolled or not on home page */}
      {(isScrolled || !isHomePage) && (
        <div
          className={`bg-gradient-to-r from-[#3F4A2E] to-[#7D8570] text-white text-sm px-4 md:px-10 transition-all duration-500 fixed top-0 left-0 w-full z-[100]`}
        >
          <ContentWrapper>
            {contactData && (
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-4">
                  <a
                    href={`mailto:${contactData.email}`}
                    className="hover:text-[#D4CBB3] text-xs md:text-md transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {contactData.email}
                  </a>
                  <a
                    href={`tel:${contactData.mobile_number}`}
                    className="hover:text-[#D4CBB3] text-xs md:text-md transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {contactData.mobile_number}
                  </a>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-[#D4CBB3]">Open Hours:</span>
                  <span>{contactData.open_hours}</span>
                </div>
              </div>
            )}
          </ContentWrapper>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`fixed  w-full left-0 transition-all duration-500 z-[90] ${navbarBackgroundClass}`}
        style={{
          top: isScrolled || !isHomePage ? "32px" : "0",
          backdropFilter: isHomePage && !isScrolled ? "none" : "blur(8px)",
        }}
      >
        <ContentWrapper>
          <div className="flex justify-between items-center py-4">
            {/* Logo with conditional white background */}
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer transition-all duration-300"
            >
              <img
                src={navlogo}
                alt="Luxe Interiors"
                className="h-24 w-auto"
              />
            </div>

            {/* Desktop Nav with CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Navigation Items */}
              <div
                className={`flex space-x-6 font-medium relative ${textColorClass}`}
              >
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => item.submenu && toggleDropdown(index)}
                    onMouseLeave={() => item.submenu && toggleDropdown(null)}
                  >
                    <button
                      onClick={() =>
                        item.submenu
                          ? toggleDropdown(index)
                          : navigate(item.path)
                      }
                      className={`${hoverTextColorClass} flex items-center gap-1 transition-colors ${
                        openDropdown === index
                          ? isHomePage && !isScrolled
                            ? "text-white/90"
                            : "text-[#7D8570]"
                          : ""
                      }`}
                    >
                      {item.label}
                      {item.submenu && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            openDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Desktop Dropdown */}
                    <AnimatePresence>
                      {openDropdown === index && item.submenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-10 left-0 bg-white/95 backdrop-blur-md rounded-lg shadow-xl py-2 px-3 min-w-[220px] z-[120] border border-white/20"
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <motion.div
                              key={subIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                              onClick={() => navigate(subItem.path)}
                              className="hover:bg-[#E8EBDF] px-3 py-2 rounded text-sm text-[#3F4A2E] cursor-pointer transition-colors hover:text-[#7D8570]"
                            >
                              {subItem.label}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-3 ml-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFormOpen("showroom")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    isHomePage && !isScrolled
                      ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                      : "bg-[#ADB79C] hover:bg-[#3F4A2E] text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Book Showroom Visit
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFormOpen("design")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    isHomePage && !isScrolled
                      ? "bg-transparent text-white border border-white/50 hover:bg-white/20"
                      : "bg-white border border-[#ADB79C] text-[#ADB79C] hover:bg-[#E8EBDF]"
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  Book Free Design Visit
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className={`${textColorClass} ${hoverTextColorClass} pr-5 transition-colors`}
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </ContentWrapper>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white/95 backdrop-blur-md z-[110] shadow-xl p-6 space-y-4 overflow-y-auto"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-[#3F4A2E] hover:text-[#7D8570]"
            >
              <X size={28} />
            </button>

            {/* Mobile CTA Buttons */}
            <div className="mt-8 flex flex-col space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleFormOpen("showroom")}
                className="flex items-center justify-center gap-2 bg-[#ADB79C] hover:bg-[#3F4A2E] text-white px-4 py-3 rounded-lg transition font-medium w-full"
              >
                <Calendar className="w-4 h-4" />
                Book Showroom Visit
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleFormOpen("design")}
                className="flex items-center justify-center gap-2 bg-white border border-[#ADB79C] text-[#ADB79C] hover:bg-[#E8EBDF] px-4 py-3 rounded-lg transition font-medium w-full"
              >
                <Ruler className="w-4 h-4" />
                Book Free Design Visit
              </motion.button>
            </div>

            <div className="mt-4 space-y-6">
              {navItems.map((item, index) => (
                <div key={index} className="border-b border-[#E8EBDF] pb-4">
                  <button
                    onClick={() => {
                      if (!item.submenu) {
                        navigate(item.path);
                        toggleMenu();
                      }
                    }}
                    className={`w-full text-left font-semibold text-lg ${
                      item.submenu
                        ? "text-[#3F4A2E]"
                        : "text-[#3F4A2E] hover:text-[#7D8570]"
                    } py-2 flex justify-between items-center`}
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-4 space-y-2 mt-2">
                      {item.submenu.map((sub, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            navigate(sub.path);
                            toggleMenu();
                          }}
                          className="pl-3 py-2 text-[#3F4A2E] hover:text-[#7D8570] cursor-pointer flex items-center"
                        >
                          <span className="text-[#ADB79C] mr-2">•</span>
                          {sub.label}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-8 p-4 bg-[#E8EBDF] rounded-lg">
              <h3 className="font-semibold text-[#3F4A2E] mb-2">Contact Us</h3>
              {contactData && (
                <>
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-[#3F4A2E] hover:text-[#7D8570] flex items-center mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {contactData.email}
                  </a>
                  <a
                    href={`tel:${contactData.mobile_number}`}
                    className="text-[#3F4A2E] hover:text-[#7D8570] flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {contactData.mobile_number}
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Popup with smooth blur transition */}
      <AnimatePresence>
        {showForm && (
          <ContactFormPopup
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onClose={handleFormClose}
            formType={formType} // Fix this line - was passing isSubmitting instead of formType
            isLoading={isSubmitting} // Pass the loading state here
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
