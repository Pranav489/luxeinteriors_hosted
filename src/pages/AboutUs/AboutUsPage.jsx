import React, { useEffect, useState, useMemo } from "react";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/api";
import GallerySection from "../Home/GallerySection";

const BulletIcon = () => (
  <svg
    className="h-15 w-15 text-[#ADB79C] mr-2 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const transform = (node) => {
  if (node.name === "p") {
    return <p className="text-[#7D8570] mb-4">{domToReact(node.children)}</p>;
  }

  if (node.name === "li") {
    return (
      <li className="flex items-start text-[#7D8570] mb-4">
        <BulletIcon />
        <span>{domToReact(node.children)}</span>
      </li>
    );
  }
};

const AboutUsPage = () => {
  const location = useLocation();
  const [companyData, setCompanyData] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/companyinformation");
        setCompanyData(response.data);
        setHtmlContent(response.data.manufacturing_facility_description);
      } catch (error) {
        // console.error("Error fetching company information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Small timeout to ensure component has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

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
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mt-38 mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-[#3F4A2E] mb-4">
          About Capital Bedrooms
        </h1>
        <div className="w-24 h-1 bg-[#ADB79C] mx-auto"></div>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {[
          { label: "Company Profile", path: "#overview" },
          { label: "Vision & Mission", path: "#vision" },
          { label: "Manufacturing Facility", path: "#facility" },
          { label: "Our Values", path: "#values" },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeIn("right", "spring", index * 0.2, 0.75)}
          >
            <Link
              to={item.path}
              className="px-4 py-2 bg-[#E8EBDF] hover:bg-[#ADB79C] hover:text-white rounded-md transition-colors text-[#3F4A2E]"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Company Overview Section */}
      <motion.section
        id="overview"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div
          className="flex flex-col md:flex-row gap-8 items-center"
          variants={fadeIn("up", "spring", 0.2, 1)}
        >
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#3F4A2E] mb-6">
              Company Profile
            </h2>
            <div
              className="text-[#7D8570] space-y-4"
              dangerouslySetInnerHTML={{
                __html: companyData.company_overview.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
          <motion.div className="md:w-1/2" variants={zoomIn(0.4, 1)}>
            <img
              src={`https://metrowardrobe.demovoting.com/uploads/${companyData.company_overview_image}`}
              alt="Capital Bedrooms Manufacturing Facility"
              className="rounded-lg shadow-xl w-full h-auto border border-[#D4CBB3]"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section
        id="vision"
        className="mb-20 py-10 bg-[#E8EBDF] rounded-xl px-8 scroll-mt-20"
        variants={fadeIn("up", "spring", 0.3, 1)}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#3F4A2E] mb-12">
            Our Vision & Mission
          </h2>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer(0.1, 0.2)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md border border-[#D4CBB3]"
              variants={fadeIn("right", "spring", 0.2, 1)}
            >
              <div className="text-[#ADB79C] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#3F4A2E]">
                Capital Vision
              </h3>
              <p className="text-[#7D8570]">
                Capital is the voice of modern European living, where furniture
                and architecture become one, and every home reflects the beauty
                of bespoke design
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md border border-[#D4CBB3]"
              variants={fadeIn("left", "spring", 0.4, 1)}
            >
              <div className="text-[#ADB79C] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#3F4A2E]">
                Capital Mission
              </h3>
              <p className="text-[#7D8570]">
                We transform dreams into living spaces crafted with precision,
                guided by sustainability, and made to belong to every home.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Manufacturing Facility Section */}
      <motion.section
        id="facility"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-[#3F4A2E] mb-12"
          variants={fadeIn("up", "spring", 0.1, 1)}
        >
          Our Manufacturing Facility
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-8"
          variants={fadeIn("up", "spring", 0.2, 1)}
        >
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#3F4A2E]">
              {companyData.manufacturing_facility_header}
            </h3>
            {parse(htmlContent, { replace: transform })}
          </div>
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer(0.1, 0.2)}
          >
            {companyData.manufacturing_facility_images?.map((image, index) => (
              <motion.img
                variants={zoomIn(0.1, 1)}
                key={index}
                src={`https://metrowardrobe.demovoting.com/uploads/${image}`}
                alt={
                  companyData.manufacturing_facility_images_alt?.[index]?.alt ||
                  ""
                }
                className="rounded-lg shadow-md h-full object-cover border border-[#D4CBB3]"
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-[#E8EBDF] p-6 rounded-lg border border-[#ADB79C]"
          variants={fadeIn("up", "spring", 0.5, 1)}
        >
          <h3 className="text-xl font-semibold mb-3 text-[#3F4A2E]">
            Quality Assurance
          </h3>
          <p className="text-[#7D8570]">
            Every Capital Bedrooms product passes through multiple precision
            quality checkpoints from material selection to final installation.
            Our CNC-automated production ensures millimetre-perfect accuracy,
            while each component is carefully inspected for finish, durability,
            and performance. Our quality assurance process includes hardware
            endurance testing, surface finish inspection, edge-band adhesion
            checks, and final assembly validation, guaranteeing that every
            fitted wardrobe and furniture piece meets our highest standards of
            craftsmanship and longevity. At Capital Bedrooms, quality isn't just
            a phase, it's built into every step of our process.
          </p>
        </motion.div>
      </motion.section>

      {/* Team/Leadership Section */}
      <motion.section
        id="values"
        className="scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div
          className="mt-16 bg-[#E8EBDF] p-8 rounded-xl border border-[#D4CBB3]"
          variants={fadeIn("up", "spring", 0.5, 1)}
        >
          <h3 className="text-2xl font-semibold text-center mb-6 text-[#3F4A2E]">
            Our Values
          </h3>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer(0.1, 0.2)}
          >
            {[
              {
                title: "Design Excellence",
                description:
                  "Every project begins with thoughtful design where aesthetics meet functionality. We craft furniture that not only fits perfectly but also enhances the character and comfort of every space.",
              },
              {
                title: "Precision Engineering",
                description:
                  "Our CNC-automated manufacturing facility ensures unmatched accuracy in every cut, joint, and finish. The result is flawless furniture, built with consistency, durability, and perfection in every detail.",
              },
              {
                title: "Innovation & Technology",
                description:
                  "We continuously invest in advanced machinery, design software, and production systems that bring creativity and efficiency together shaping the future of bespoke furniture.",
              },
              {
                title: "Sustainable Crafting",
                description:
                  "We believe great design should also be responsible. By sourcing eco-friendly materials and reducing waste through precision manufacturing, we create beauty that lasts with respect for the environment.",
              },
              {
                title: "Collaborative Approach",
                description:
                  "We see every project as a partnership. From homeowners and interior designers to architects and developers, we work closely to turn concepts into timeless furniture tailored to individual lifestyles.",
              },
              {
                title: "Commitment to Quality",
                description:
                  "Every wardrobe and furniture piece goes through meticulous inspection at every stage from design validation to final installation ensuring it meets our highest standards of excellence.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.1, 1)}
                className="bg-white p-5 rounded-lg shadow-sm border border-[#E8EBDF]"
              >
                <h4 className="font-semibold text-lg mb-2 text-[#3F4A2E]">
                  {value.title}
                </h4>
                <p className="text-[#7D8570]">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section className="pt-10">
        <GallerySection />
      </motion.section>
    </motion.div>
  );
};

export default AboutUsPage;
