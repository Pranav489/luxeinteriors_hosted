import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../services/api";

function WhatsAppPopup() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handlePopup = () => {
    setShow(!show);
  };

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

  return (
    <div className="flex justify-center items-end w-full">
      <div className="w-full max-w-md px-4">
        {show && (
          <div className="bg-white rounded-xl border-0 shadow-lg w-full">
            <div className="flex flex-row p-3 justify-between items-center bg-[#ADB79C] rounded-t-xl">
              <span className="text-4xl text-white">
                <FaWhatsapp />
              </span>
              <div className="text-left text-white px-4">
                <h4 className="text-md md:text-lg font-semibold ">
                  Raise Your Query
                </h4>
                <p className="text-xs md:text-md ">
                  Hi! Simply click below and type your query.
                </p>
              </div>
              <button onClick={handlePopup} className="text-white text-2xl">
                <RxCross2 />
              </button>
            </div>

            <div className="bg-white text-center text-xs md:text-md p-4 rounded-b-xl">
              <p className="text-gray-600 mb-2">
                Our experts will reply to you very soon.
              </p>
              {contactData && (
                <a
                  href={`https://wa.me/${contactData.whatsapp_number}?text=Hello%20there!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ADB79C] hover:bg-#3F4A2E text-white px-4 py-2 rounded-lg inline-flex items-center mb-2"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2 " />
                  Click here to send a message
                </a>
              )}
              <br />
            </div>
          </div>
        )}
      </div>
      <div></div>
      <div
        className="active:scale-90 p-3 m-2 bg-green-700 rounded-full cursor-pointer"
        onClick={handlePopup}
      >
        <span className="text-4xl text-white">
          <FaWhatsapp />
        </span>
      </div>
    </div>
  );
}

export default WhatsAppPopup;
