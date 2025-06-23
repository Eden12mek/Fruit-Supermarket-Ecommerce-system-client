import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createMessage } from "../services/message";
import { toast } from "react-toastify";

const ContactUs = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(createMessage(formData));
    if (success) {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-0 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold text-green-800">
            Get in Touch
          </h1>
          <p className="text-lg text-green-900 mt-4">
            We’d love to hear from you! Whether it’s about our fruits, services,
            or suggestions — reach out anytime.
          </p>
          <div className="mt-4 w-20 h-1 bg-green-700 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              Send us a message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {["name", "email", "subject"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-green-700 capitalize"
                  >
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder={`Your ${field}`}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-green-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white py-3 px-6 rounded-lg font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Map of Poly compus */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.847203329502!2d37.3929606!3d11.5976822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1644ce107991537d%3A0x3e8bedd070a29619!2sBahir%20Dar%20University%20Poly%20Campus!5e0!3m2!1sen!2set!4v1716300000000!5m2!1sen!2set"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bahir Dar University Poly Campus"
              ></iframe>
            </div>
            {/* Our Contact Info */}
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-2xl font-semibold text-green-800 mb-6">
                Our Contact Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <FaPhone />,
                    label: "Phone",
                    lines: ["+251 989332332", "+251 912345678"],
                  },
                  {
                    icon: <FaEnvelope />,
                    label: "Email",
                    lines: ["info@abemufruits.com", "support@abemufruits.com"],
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    label: "Location",
                    lines: ["Poli Campus", "Bahirdar, Ethiopia"],
                  },
                  {
                    icon: <FaClock />,
                    label: "Hours",
                    lines: ["Mon–Fri: 9am–6pm", "Sat: 10am–4pm"],
                  },
                ].map((item, index) => (
                  <div className="flex items-start gap-4" key={index}>
                    <div className="text-lime-600 mt-1 text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800">{item.label}</h3>
                      {item.lines.map((line, idx) => (
                        <p className="text-gray-700" key={idx}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
