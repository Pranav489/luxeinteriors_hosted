import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";

const WhoWeAre = () => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sampleImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/whoweare");
        setSectionData(response.data?.data || null);
      } catch (error) {
        // console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
        setSectionData(null);
      } finally {
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
      <div className="h-[600px] flex items-center justify-center text-[#7D8570]">
        No content available
      </div>
    );
  }
  

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#E8EBDF]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3F4A2E] mb-4">
            {sectionData?.section_header || ""}
          </h2>
          <div className="w-20 h-1 bg-[#ADB79C] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {sectionData?.text_content && (
              <p
                className="text-lg text-[#3F4A2E] mb-6 text-ellipsis leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sectionData.text_content }}
              />
            )}

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <button
                onClick={() => navigate("/aboutus")}
                className="inline-flex items-center text-[#3F4A2E] hover:text-[#7D8570] font-medium group transition-colors cursor-pointer"
              >
                Discover Our Story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-[#ADB79C]" />
              </button>
            </motion.div>
          </motion.div>

          {/* Image/Visual Element - Updated Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex justify-center items-start"
          >
            {sectionData?.section_image ? (
              <div className="rounded-xl overflow-hidden shadow-lg max-w-full border border-[#D4CBB3]">
                <img
                  src={`https://metrowardrobe.demovoting.com/uploads/${sectionData.section_image}`}
                  alt="Built-In Wardrobes"
                  className="w-full h-auto object-contain max-h-[500px]"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.alt = "Default placeholder image";
                  }}
                />
              </div>
            ) : (
              <div className="w-full max-w-md h-64 bg-[#D4CBB3] flex items-center justify-center rounded-xl">
                <span className="text-[#7D8570]">Image not available</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;