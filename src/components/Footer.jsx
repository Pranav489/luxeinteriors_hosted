import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { navlogo } from "../../public/assets";
import axiosInstance from "../services/api";

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("contact");
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

  const socialIcons = [
    {
      icon: FaFacebookF,
      label: "Facebook",
      url: contactData?.social_link_1 || "#",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      url: contactData?.social_link_2 || "#",
    },
    {
      icon: FaYoutube,
      label: "YouTube",
      url: contactData?.social_link_3 || "#",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      url: contactData?.social_link_4 || "#",
    },
    {
      icon: FaPinterest,
      label: "Pinterest",
      url: contactData?.social_link_5 || "#",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-[#E8EBDF] text-[#3F4A2E] pt-10 pb-6 px-4 sm:px-6 md:px-8 lg:px-16 rounded-t-2xl sm:rounded-t-3xl shadow-inner"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 xl:gap-12">
          {/* Column 1: Logo Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-start"
          >
            <img
              src={navlogo}
              alt="Capital Bedrooms Logo"
              className="w-32 sm:w-36 md:w-40 lg:w-44 mb-4"
            />
            <p className="text-sm sm:text-base text-[#3F4A2E] mt-2 hidden md:block">
              Creating beautiful, functional interiors that transform your space.
            </p>
          </motion.div>

          {/* Column 2: Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#7D8570] mb-4">
              Contact Us
            </h3>
            
            <div className="space-y-4">
              {/* Address */}
              {contactData?.corporate_address_line1 && (
                <div className="flex items-start gap-3">
                  <IoLocationOutline className="text-[#ADB79C] w-5 h-5 mt-1 flex-shrink-0" />
                  <div className="text-sm sm:text-base">
                    <div className="text-[#3F4A2E] space-y-1">
                      {contactData.corporate_address_line1 && (
                        <p>{contactData.corporate_address_line1}</p>
                      )}
                      {contactData.corporate_address_line2 && (
                        <p>{contactData.corporate_address_line2}</p>
                      )}
                      {contactData.corporate_address_line3 && (
                        <p>{contactData.corporate_address_line3}</p>
                      )}
                      {contactData.corporate_address_line4 && (
                        <p>{contactData.corporate_address_line4}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {contactData?.email && (
                <div className="flex items-center gap-3">
                  <MdOutlineEmail className="text-[#ADB79C] w-5 h-5 flex-shrink-0" />
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-sm sm:text-base text-[#3F4A2E] hover:text-[#7D8570] transition-colors break-all"
                  >
                    {contactData.email}
                  </a>
                </div>
              )}

              {/* Phone Numbers */}
              <div className="flex items-center gap-3">
                <IoCallOutline className="text-[#ADB79C] w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col">
                  {contactData?.tel_number && (
                    <a
                      href={`tel:${contactData.tel_number}`}
                      className="text-sm sm:text-base text-[#3F4A2E] hover:text-[#7D8570] transition-colors"
                    >
                      {contactData.tel_number}
                    </a>
                  )}
                  {contactData?.mobile_number && (
                    <a
                      href={`tel:${contactData.mobile_number}`}
                      className="text-sm sm:text-base text-[#3F4A2E] hover:text-[#7D8570] transition-colors"
                    >
                      {contactData.mobile_number}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Stay Connected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#7D8570] mb-4">
              Stay Connected
            </h3>
            
            <div className="space-y-4">
              {/* Social Icons */}
              <div>
                <div className="flex flex-wrap gap-3">
                  {socialIcons.map(({ icon: Icon, label, url }, index) => (
                    <motion.a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      title={label}
                      className="bg-white p-2.5 sm:p-3 rounded-full shadow-sm hover:bg-[#ADB79C] text-[#7D8570] hover:text-white transition-all duration-300"
                      aria-label={`Follow us on ${label}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social Benefits */}
              <div className="mt-4">
                <ul className="text-sm sm:text-base text-[#3F4A2E] space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ADB79C] mr-2">•</span>
                    <span className="text-sm">News & announcements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ADB79C] mr-2">•</span>
                    <span className="text-sm">Latest portfolio & gallery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ADB79C] mr-2">•</span>
                    <span className="text-sm">Professional insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ADB79C] mr-2">•</span>
                    <span className="text-sm">Videos & success stories</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom - Separator & Legal Info */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#D4CBB3]">
          <div className="text-center">
            {/* Copyright Text */}
            <p className="text-xs sm:text-sm text-[#7D8570] mb-4">
              © 2025{" "}
              <span className="font-semibold text-[#3F4A2E]">Capital Bedrooms</span>
              . All Rights Reserved by{" "}
              <span className="font-bold text-[#ADB79C]">Capital Bedrooms Ltd</span>.
            </p>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                href="#"
                className="text-xs sm:text-sm text-[#3F4A2E] hover:text-[#7D8570] hover:underline transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-[#3F4A2E] hover:text-[#7D8570] hover:underline transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;