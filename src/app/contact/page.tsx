"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send } from "lucide-react";

// Dummy data that is easy to replace
const contactInfo = {
  address: "Jl. Sultan Hadlirin No. 123, Mantingan, Jepara, Jawa Tengah 59421",
  phone: "+62 812 3456 7890",
  email: "hello@ajiningfurniture.com",
  socials: [
    { name: "Instagram", icon: Instagram, link: "https://instagram.com/ajining.furniture" },
    { name: "Facebook", icon: Facebook, link: "https://facebook.com/ajining.furniture" },
    { name: "Twitter", icon: Twitter, link: "https://twitter.com/ajining.furniture" },
  ],
  workingHours: [
    { day: "Monday - Friday", hours: "09:00 AM - 06:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 04:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ]
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-brand-offwhite pb-24">
      {/* Header Section */}
      <section className="bg-white py-24 border-b border-brand-stone">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-4 block">Get in Touch</span>
            <h1 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-6 leading-tight">
              Let's Start a <span className="italic">Conversation</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Whether you're looking for a bespoke piece or have a question about our collections, our team is here to help you create your perfect space.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-serif italic mb-8 border-l-4 border-brand-gold pl-6">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white border border-brand-stone rounded-full flex items-center justify-center text-brand-gold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Our Studio</h4>
                    <p className="text-brand-charcoal leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white border border-brand-stone rounded-full flex items-center justify-center text-brand-gold">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Call Us</h4>
                    <p className="text-brand-charcoal leading-relaxed">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white border border-brand-stone rounded-full flex items-center justify-center text-brand-gold">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Email Us</h4>
                    <p className="text-brand-charcoal leading-relaxed">{contactInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif italic mb-8 border-l-4 border-brand-gold pl-6">Working Hours</h2>
              <div className="space-y-4">
                {contactInfo.workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-brand-stone/50">
                    <span className="text-sm text-gray-400 uppercase tracking-widest">{schedule.day}</span>
                    <span className="text-sm font-medium text-brand-charcoal">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif italic mb-8 border-l-4 border-brand-gold pl-6">Follow Our Craft</h2>
              <div className="flex gap-4">
                {contactInfo.socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white border border-brand-stone rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-10 lg:p-16 shadow-2xl rounded-sm"
          >
            <h2 className="text-3xl font-serif text-brand-charcoal mb-10">Send a Message</h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border-b border-brand-stone py-4 bg-transparent focus:outline-none focus:border-brand-gold transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border-b border-brand-stone py-4 bg-transparent focus:outline-none focus:border-brand-gold transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border-b border-brand-stone py-4 bg-transparent focus:outline-none focus:border-brand-gold transition-colors placeholder:text-gray-300"
                />
              </div>
              <div className="relative group">
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full border-b border-brand-stone py-4 bg-transparent focus:outline-none focus:border-brand-gold transition-colors placeholder:text-gray-300 resize-none"
                />
              </div>
              
              <button className="w-full bg-brand-charcoal text-white py-5 px-8 text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 group">
                Send Inquiry
                <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Map Placeholder Section */}
      <section className="mt-32 px-6">
        <div className="container mx-auto h-[500px] bg-brand-stone/30 relative overflow-hidden rounded-sm grayscale">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
                <MapPin className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <p className="font-serif italic text-2xl text-gray-500">Visit our Studio in Jepara</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Interactive Map Integration Coming Soon</p>
             </div>
          </div>
          {/* In a real scenario, you'd embed a Google Maps iframe here */}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
