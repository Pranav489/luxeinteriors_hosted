import { BadgeCheck, Factory, Hammer, Ruler, Shield } from 'lucide-react';
import React from 'react'

const WhyChooseUs = () => {
  return (
    <div className="pt-2 bg-[#E8EBDF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-[#3F4A2E]">
          Why Choose Capital Bedrooms?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            {
              icon: <Ruler size={40} className="text-[#ADB79C]" />,
              title: "Made-to-Measure Precision",
              desc: "Tailor-made wardrobes for a flawless fit and more storage.",
            },
            {
              icon: <Hammer size={40} className="text-[#ADB79C]" />,
              title: "Premium Materials & Craftsmanship",
              desc: "Premium materials + soft-close design for long-lasting quality.",
            },
            {
              icon: <Shield size={40} className="text-[#ADB79C]" />,
              title: "Expert Installation",
              desc: "Free design consultation and expert installation, start to finish.",
            },
            {
              icon: <Factory size={40} className="text-[#ADB79C]" />,
              title: "Direct from Manufacturer",
              desc: "No middlemen — just Capital Bedrooms quality, factory-direct.",
            },
            {
              icon: <BadgeCheck size={40} className="text-[#ADB79C]" />,
              title: "10-Year Guarantee",
              desc: "Backed by a 10-year guarantee for lasting confidence and quality.",
            },
          ].map((item, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#D4CBB3]"
            >
              <div className="flex justify-center mb-4 text-[#ADB79C]">
                {item.icon}
              </div>
              <h4 className="font-semibold text-lg mb-3 text-[#3F4A2E]">{item.title}</h4>
              <p className="text-[#7D8570] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs