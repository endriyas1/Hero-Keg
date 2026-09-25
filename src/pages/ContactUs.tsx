import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Smartphone,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';

import contactHeroImg from '../assets/images/contact_hero_1779725491927.png';
import mapBgImg from '../assets/images/map_background_1779725518254.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function AnimatedCheckmark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut", delay: 0.35 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12.5l2.5 2.5L16.5 9"
      />
    </svg>
  );
}

export default React.memo(function ContactUs() {
  useSEO({
    title: 'Contact Us | Hero Keg Service and Trading PLC',
    description: 'Get in touch with Hero Keg Service and Trading PLC for brewery keg maintenance, emergency repairs, parts supply, or to schedule mobile service at your facility in Ethiopia.',
    keywords: 'contact hero keg, keg service ethiopia, brewery support, keg repair quote, Addis Ababa keg maintenance',
    image: '/og-contact.png',
    imageAlt: 'Hero Keg Service and Trading PLC - Contact and Facility Location',
    urlPath: '/contact'
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Keg Sanitation & Cleaning',
    kegs: '',
    subject: '',
    message: '',
    agreed: false
  });

  const [status, setStatus] = useState<{
    submitting: boolean;
    success?: boolean;
    simulated?: boolean;
    message?: string;
  }>({
    submitting: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.company || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        message: 'Please fill in all required fields.'
      });
      return;
    }

    if (!formData.agreed) {
      setStatus({
        submitting: false,
        success: false,
        message: 'You must agree to be contacted about your inquiry.'
      });
      return;
    }

    setStatus({ submitting: true });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          submitting: false,
          success: true,
          simulated: result.simulated,
          message: result.message
        });
        
        // Clear form on success
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          service: 'Keg Sanitation & Cleaning',
          kegs: '',
          subject: '',
          message: '',
          agreed: false
        });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: result.message || 'An error occurred while submitting. Please try again later.'
        });
      }
    } catch (err: any) {
      console.error('[Client Contact Submit Error]:', err);
      setStatus({
        submitting: false,
        success: false,
        message: 'Unable to connect to the server. Please check your network connection and try again.'
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white font-sans text-gray-800">

      {/* Hero Section */}
      <section className="relative w-full aspect-[4/3] sm:aspect-video max-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={contactHeroImg} 
            alt="Contact Us Hero" 
            className="w-full h-full object-contain lg:object-cover lg:object-[center_20%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl mt-16"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
              Contact Us
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-200 leading-relaxed max-w-xl">
              We're here to support your brewery operations. Reach out
              to our team for maintenance, repairs, parts supply, or
              technical support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Form */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Get in Touch */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="lg:col-span-4"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-bold text-[#183346] mb-6">Get in Touch</motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 mb-10 text-[15px] leading-relaxed">
              Whether you need a one-time service, regular
              maintenance, or technical support, our team is
              ready to help.
            </motion.p>

            <div className="space-y-8 mb-12">
              <motion.div variants={fadeInUp} className="flex items-start group">
                <div className="w-12 h-12 bg-[#183346] rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <MapPin className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="mt-1">
                  <h4 className="font-bold text-[#183346] mb-1 group-hover:text-[#C5A059] transition-colors">Location</h4>
                  <p className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">Bole Bulbula Medhanialem Mall, 4th Floor<br/>Office No. 420, Addis Ababa, Ethiopia</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-start group">
                <div className="w-12 h-12 bg-[#183346] rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                </div>
                <div className="mt-1">
                  <h4 className="font-bold text-[#183346] mb-1 group-hover:text-[#C5A059] transition-colors">Phone</h4>
                  <p className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">+251 943 739 086</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-start group">
                <div className="w-12 h-12 bg-[#183346] rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-1">
                  <h4 className="font-bold text-[#183346] mb-1 group-hover:text-[#C5A059] transition-colors">Email</h4>
                  <p className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">herokegservice@gmail.com</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-start group">
                <div className="w-12 h-12 bg-[#183346] rounded-full flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#C5A059] group-hover:scale-110 transition-all duration-300">
                  <Clock className="w-5 h-5 text-white group-hover:rotate-[360deg] transition-all duration-700" />
                </div>
                <div className="mt-1">
                  <h4 className="font-bold text-[#183346] mb-1 group-hover:text-[#C5A059] transition-colors">Working Hours</h4>
                  <p className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">Monday – Friday<br/>8:30 AM – 5:30 PM EAT</p>
                </div>
              </motion.div>
            </div>

            {/* Need Technical Support Box */}
            <motion.div variants={fadeInUp} className="bg-slate-50 p-8 rounded-sm group hover:bg-slate-100 transition-colors hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <Smartphone className="w-10 h-10 text-[#183346] stroke-1 group-hover:scale-110 group-hover:text-[#C5A059] transition-all duration-300" />
                <h3 className="font-bold text-xl text-[#183346] leading-tight group-hover:text-[#C5A059] transition-colors">Need Technical<br/>Support?</h3>
              </div>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed group-hover:text-slate-900 transition-colors">
                Have a technical question about keg<br/>maintenance or parts?
              </p>
              <button className="w-full bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white font-semibold py-3 transition-all flex items-center justify-center rounded-sm text-sm hover:scale-[1.02]">
                Ask Technical Question <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <h2 className="text-3xl font-serif font-bold text-[#183346] mb-4">Send Us a Message</h2>
            <p className="text-slate-600 mb-8 text-[15px]">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 mb-8 rounded-sm border ${
                    status.success
                      ? status.simulated
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-start">
                    {status.success ? (
                      status.simulated ? (
                        <AnimatedCheckmark className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AnimatedCheckmark className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-bold">
                        {status.success 
                          ? status.simulated 
                            ? 'Form Submitted (Developer Mode)' 
                            : 'Message Sent Successfully!' 
                          : 'Submission Error'}
                      </p>
                      <p className="text-sm mt-1">{status.message}</p>
                      {status.simulated && (
                        <p className="text-xs mt-3 text-amber-700/80 leading-relaxed font-mono">
                          Tip: To deliver real emails, set the <strong className="font-semibold">GMAIL_USER</strong> and <strong className="font-semibold">GMAIL_APP_PASSWORD</strong> variables in AI Studio secrets.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm text-slate-700 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] appearance-none bg-white transition-all cursor-pointer"
                  >
                    <option value="Keg Sanitation & Cleaning">Keg Sanitation & Cleaning</option>
                    <option value="Keg Repair & Structural Restoration">Keg Repair & Structural Restoration</option>
                    <option value="Valve Maintenance & Replacement">Valve Maintenance & Replacement</option>
                    <option value="Pressure & Leak Testing">Pressure & Leak Testing</option>
                    <option value="Genuine Spare Parts Supply">Genuine Spare Parts Supply</option>
                    <option value="Other / Support">Other / Support Inquiry</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#C5A059] transition-colors" />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                    Number of Kegs (Optional)
                  </label>
                  <input
                    type="text"
                    name="kegs"
                    value={formData.kegs}
                    onChange={handleChange}
                    placeholder="Approximate number of kegs"
                    className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirement"
                  className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 transition-all"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-[#183346] mb-2 group-focus-within:text-[#C5A059] transition-colors">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full border border-slate-200 p-3 rounded-sm text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] placeholder:text-slate-400 resize-none transition-all"
                ></textarea>
              </div>
              
              {/* Fake reCAPTCHA */}
              <div 
                className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex items-center justify-between w-[304px] hover:border-slate-300 transition-colors cursor-pointer select-none"
                onClick={() => setFormData(prev => ({ ...prev, agreed: !prev.agreed }))}
              >
                <div className="flex items-center group/recaptcha">
                  <div className={`w-7 h-7 rounded-sm mr-3 flex items-center justify-center border-2 transition-all ${
                    formData.agreed 
                      ? 'bg-emerald-500 border-emerald-600 shadow-inner' 
                      : 'bg-white border-slate-300 group-hover/recaptcha:border-[#C5A059]'
                  }`}>
                    {formData.agreed && (
                      <motion.svg 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-750 font-medium">I verify this inquiry is real</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-slate-400/20 mb-1 rounded-sm flex items-center justify-center text-[10px] text-slate-500 font-bold">✓</div>
                  <span className="text-[9px] text-slate-400 leading-tight text-center">Hero Anti-Spam</span>
                </div>
              </div>

              <div className="flex items-center mt-2 group/check cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, agreed: !prev.agreed }))}>
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 border-slate-300 rounded-sm mr-3 text-[#183346] focus:ring-[#183346] cursor-pointer group-hover/check:border-[#183346] transition-colors"
                />
                <span className="text-[15px] text-slate-600 group-hover/check:text-slate-900 transition-colors">I agree to be contacted about my inquiry.</span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-slate-500"><span className="text-red-500">*</span> Required fields</span>
                <button
                  type="submit"
                  disabled={status.submitting}
                  className={`group flex items-center justify-center text-sm bg-[#C5A059] text-white px-8 py-3.5 font-semibold hover:bg-[#a38043] transition-colors rounded-sm shadow-sm hover:shadow-md ${
                    status.submitting ? 'opacity-80 cursor-not-allowed scale-95' : 'hover:-translate-y-0.5'
                  }`}
                >
                  {status.submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 00 5.373 4.365 4 12z" />
                      </svg>
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      Send Inquiry <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-[550px] mt-8 bg-slate-200 relative"
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.207626768264!2d38.7869427!3d8.9530067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b83006bf7adaf%3A0xf644c6dd5ccc0367!2sBulbula%20medhaneAlem%20mall!5e0!3m2!1sen!2set!4v1779875051762!5m2!1sen!2set" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Get Directions Floating Panel */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 bg-white/95 backdrop-blur-md p-5 rounded-sm shadow-xl border border-slate-200/60 max-w-[280px] sm:max-w-xs">
          <h4 className="font-serif font-bold text-[#183346] text-base mb-1">Our Location</h4>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Bole Bulbula Medhanialem Mall, 4th Floor<br />
            Office No. 420, Addis Ababa, Ethiopia
          </p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Medhanialem+Mall,+Bole,+Addis+Ababa,+Ethiopia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-[#111827] text-white hover:bg-[#C5A059] transition-all py-3 px-4 rounded-sm shadow-sm hover:shadow-md cursor-pointer w-full text-center"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        </div>
      </motion.section>

    </motion.div>
  );
});
