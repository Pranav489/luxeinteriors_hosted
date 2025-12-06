import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMessageSquare, FiCalendar } from "react-icons/fi";
import HeroSection from "./HeroSection";
import OurProducts from "./OurProducts";
import FactoryDisplayOutlet from "./FactoryDisplayOutlet";
import WhoWeAre from "./WhoWeAre";
import axiosInstance from "../../services/api";
import TestimonialSection from "./TestimonialSection";
import GallerySection from "./GallerySection";
import WhyChooseUs from "./WhyChooseUs";

function Home() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [contactRes] = await Promise.all([axiosInstance.get("/contact")]);

        setContactData(contactRes?.data || null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HeroSection />
      <OurProducts />
      <WhoWeAre />
      <WhyChooseUs />
      
      <GallerySection />
      {/* <TestimonialSection /> */}
      {/* <FactoryDisplayOutlet /> */}

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <CTASection contactData={contactData} />
      </div>
    </div>
  );
}

const CTASection = ({ contactData }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#E8EBDF] rounded-xl p-8 text-center border border-[#D4CBB3]">
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

export default Home;
