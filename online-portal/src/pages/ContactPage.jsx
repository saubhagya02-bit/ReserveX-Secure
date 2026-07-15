import React, { useState } from "react";
import toast from "react-hot-toast";
import { submitContactForm } from "../services/contactService";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSending(true);
    try {
      await submitContactForm(formData);
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--bg-body)] py-16 px-6 sm:px-12 lg:px-24 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col lg:flex-row border border-gray-100">

        {/* Left Side: Contact Information */}
        <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Icon */}
          <div className="absolute top-0 right-0 -translate-x-4 -translate-y-8 opacity-10 rotate-12 pointer-events-none">
            <MessageSquare size={300} strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-sm">Get in Touch</h2>
            <p className="text-blue-100/90 text-lg mb-12 sm:pr-8 leading-relaxed">
              Have questions or want to learn more? We'd love to hear from you. Fill out the form and our team will respond shortly.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-5 group cursor-pointer">
                <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-inner shadow-white/10">
                  <Mail className="w-6 h-6 text-blue-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-white">Chat to us</h3>
                  <p className="text-blue-200/80 text-sm">Our friendly team is here to help.</p>
                  <a href="mailto:resevexprojects@gmail.com" className="text-blue-50 hover:text-white hover:underline mt-1.5 font-medium block transition-colors">
                    resevexprojects@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-5 group cursor-pointer">
                <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-inner shadow-white/10">
                  <MapPin className="w-6 h-6 text-blue-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-white">Visit us</h3>
                  <p className="text-blue-200/80 text-sm">Come say hello at our HQ.</p>
                  <p className="text-blue-50 mt-1.5 font-medium leading-relaxed">
                    123 Future Tech Ave<br />
                    Innovation District, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-5 group cursor-pointer">
                <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-inner shadow-white/10">
                  <Phone className="w-6 h-6 text-blue-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1 text-white">Call us</h3>
                  <p className="text-blue-200/80 text-sm">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+1(555)000-0000" className="text-blue-50 hover:text-white hover:underline mt-1.5 font-medium block transition-colors">
                    +1 (555) 000-0000
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center opacity-80 gap-4">
            <p className="text-blue-100 text-sm font-medium">
              © {new Date().getFullYear()} ReserveX. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-7/12 p-10 sm:p-14 lg:p-16 flex flex-col justify-center bg-white transition-colors duration-300">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Send us a message</h3>
            <p className="text-gray-500 text-lg">We usually respond within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm placeholder-gray-400"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="How can we help you?"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none placeholder-gray-400"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full group mt-4 flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-5 font-bold text-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              <span>{isSending ? "Sending..." : "Send Message"}</span>
              {!isSending && <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;