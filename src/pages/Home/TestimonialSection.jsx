import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axiosInstance from "../../services/api";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const clientsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testimonialsResponse = await axiosInstance.get("/testimonials/featured");
        setTestimonials(testimonialsResponse.data.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to navigate to Google Reviews
  const handleGoogleReviewsClick = () => {
    const googleReviewsURL = "https://www.google.com/search?sca_esv=bbc21c7b975a0420&rlz=1C1GCEU_enIN1172IN1172&sxsrf=AE3TifN-hl9EF_M9EeNnFOrVzztd9XLDOg:1762424182244&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E3VNo5egyu4jri_kXLyBrzEx4BB5URhcmyfyZeZqY77oV7pCa3oZBtHEIk4dJ0U0bZ2t5VC6h3gR_SLQkkrZjyxSDh-0MTlvN_QGnu0QjhaMQI1uZQ%3D%3D&q=Capital+Bedrooms+Reviews&sa=X&ved=2ahUKEwjr1M3apd2QAxWD8zgGHeg8DnsQ0bkNegQIJBAE&biw=1536&bih=730&dpr=1.25";
    window.open(googleReviewsURL, '_blank', 'noopener,noreferrer');
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

  // Client testimonials carousel scroll
  const scrollClients = (direction) => {
    if (clientsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      clientsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#E8EBDF] py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Client Testimonials */}
        <div className="mt-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-[#3F4A2E] mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>

          <motion.div
            className="h-1 w-16 bg-[#ADB79C] mx-auto mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          />

          <div className="relative mb-8">
            <button
              onClick={() => scrollClients("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#ADB79C] hover:bg-[#3F4A2E] text-white p-3 rounded-full shadow-md hidden md:block transition-transform hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollClients("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#ADB79C] hover:bg-[#3F4A2E] text-white p-3 rounded-full shadow-md hidden md:block transition-transform hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={clientsRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
            >
              {testimonials.map((client, index) => (
                <motion.div
                  key={index}
                  className="min-w-[300px] sm:min-w-[350px] bg-white rounded-xl shadow-lg overflow-hidden border border-[#D4CBB3]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={`https://metrowardrobe.demovoting.com/uploads/${client.image}`}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#E8EBDF]"
                      />
                      <div>
                        <h4 className="font-bold text-[#3F4A2E]">
                          {client.name}
                        </h4>
                        <p className="text-sm text-[#7D8570]">
                          {client.project}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#7D8570] italic mb-4">
                      "{client.quote}"
                    </p>
                    <div className="flex gap-1 text-[#ADB79C]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < client.rating ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Google Reviews CTA Button - Centered at the bottom */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={handleGoogleReviewsClick}
              className="inline-flex items-center justify-center gap-2 bg-[#D4CBB3] hover:bg-[#ADB79C] text-[#3F4A2E] font-semibold px-8 py-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-5 h-5" />
              Leave a Google Review
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;