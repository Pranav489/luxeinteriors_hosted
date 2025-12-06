import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Calendar, Phone, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";

const FactoryDisplayOutlet = () => {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/contact"); // Adjust this endpoint as needed
        setSectionData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch factory information");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (!sectionData) {
    return (
      <section className="bg-[#E8EBDF] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-96 flex items-center justify-center">
          <div className="text-[#7D8570]">No factory information available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#E8EBDF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#D4CBB3]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="relative h-full min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.555329481082!2d-0.26950620000000003!3d51.5580524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761177dd96aaab%3A0x317ac2794cff0841!2sCapital%20Bedrooms!5e0!3m2!1sen!2sin!4v1762241405879!5m2!1sen!2sin"
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                aria-hidden="false"
                tabIndex="0"
                title="Factory Location Map"
              />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-[#E8EBDF]">
                <MapPin className="text-[#ADB79C] w-5 h-5" />
                <span className="font-medium text-[#3F4A2E]">
                  {sectionData?.outlet_name ||
                    "Capital Bedrooms Factory Outlet"}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#3F4A2E] mb-3">
                  Capital Bedrooms Limited.
                </h2>
                <p className="text-[#7D8570] mb-6 prose">
                  Experience our premium Wardrobes firsthand at our factory
                  outlet. Our experts will guide you through our complete
                  product range.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#ADB79C] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#3F4A2E]">Location</h4>
                      <p className="text-[#7D8570]">
                        {sectionData.corporate_address_line1}
                        <br />
                        {sectionData.corporate_address_line2}
                        <br />
                        {sectionData.corporate_address_line3}
                        <br />
                        {sectionData.corporate_address_line4}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-[#ADB79C] mt-1 flex-shrink-0 w-5 h-5" />
                    <div>
                      <h4 className="font-semibold text-[#3F4A2E]">
                        Opening Hours
                      </h4>
                      <p className="text-[#7D8570] whitespace-pre-line">
                        {sectionData?.open_hours ||
                          "All days 10:00 AM - 7:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-[#D4CBB3] flex-1"></div>
                  <div className="h-px bg-[#D4CBB3] flex-1"></div>
                </div>

                <a
                  href={`tel:${sectionData?.tel_number}`}
                  className="flex items-center justify-center gap-2 text-[#7D8570] hover:text-[#3F4A2E] font-medium transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {sectionData?.tel_number || "Contact Number"}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FactoryDisplayOutlet;
