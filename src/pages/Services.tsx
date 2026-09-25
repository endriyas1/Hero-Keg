import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import {
  Check,
  Clock,
  LayoutGrid,
  BarChart2,
  Search,
  ArrowRightLeft,
  CalendarCheck,
  LifeBuoy,
  ClipboardList,
  Zap,
  CheckCircle,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

import heroImg from '../assets/images/services_hero_1779722089553.png';
import sanitationImg from '../assets/images/service_sanitation_1779717414016.png';
import repairImg from '../assets/images/service_repair_1779717434332.png';
import valveImg from '../assets/images/service_valves_1779717454901.png';
import partsImg from '../assets/images/service_parts_1779717475851.webp';

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

// Animated Service Icon Components
function AnimatedSanitationIcon() {
  return (
    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#111827] group-hover:bg-[#C5A059] transition-colors duration-300 rounded-full flex items-center justify-center border-4 border-white z-10">
      <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 blur-[2px]" />
      <svg
        className="w-5 h-5 text-white relative z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Flask body */}
        <path d="M6 3h12M10 3v5c0 .5-.3 1-.8 1.4-1.4 1.2-3.2 3.1-3.2 5.6 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2.5-1.8-4.4-3.2-5.6-.5-.4-.8-.9-.8-1.4V3" />
        {/* Fluid level line */}
        <motion.path
          d="M7.5 15.5c2 0 2-1 4-1s2 1 4 1"
          stroke="#D4AF37"
          strokeWidth="1.5"
          initial={{ pathLength: 0.9 }}
          animate={{ x: [0, -1.5, 1.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        {/* Bubbles */}
        <motion.circle
          cx="10"
          cy="17.5"
          r="0.75"
          fill="currentColor"
          animate={{ y: [0, -5], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
        />
        <motion.circle
          cx="14"
          cy="16.5"
          r="0.75"
          fill="currentColor"
          animate={{ y: [0, -4.5], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, delay: 0.6 }}
        />
      </svg>
    </div>
  );
}

function AnimatedRepairIcon() {
  return (
    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#111827] group-hover:bg-[#C5A059] transition-colors duration-300 rounded-full flex items-center justify-center border-4 border-white z-10">
      <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 blur-[2px]" />
      <div className="relative w-5 h-5 flex items-center justify-center z-10 text-white">
        {/* Large gear */}
        <motion.svg
          className="absolute w-4 h-4 -top-0.5 -left-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </motion.svg>
        {/* Small gear */}
        <motion.svg
          className="absolute w-2.5 h-2.5 bottom-0 right-0 text-[#C5A059] group-hover:text-white transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </motion.svg>
      </div>
    </div>
  );
}

function AnimatedValveIcon() {
  return (
    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#111827] group-hover:bg-[#C5A059] transition-colors duration-300 rounded-full flex items-center justify-center border-4 border-white z-10">
      <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 blur-[2px]" />
      <div className="relative w-5 h-5 flex items-center justify-center z-10 text-white">
        {/* Dynamic pressure flow lines */}
        <motion.div
          className="absolute -right-1.5 top-0.5 w-3 h-2 flex flex-col justify-between"
          animate={{ x: [0, 3, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="h-[1px] bg-[#C5A059] rounded-full w-1.5"></div>
          <div className="h-[1px] bg-white rounded-full w-3"></div>
          <div className="h-[1px] bg-[#C5A059] rounded-full w-2"></div>
        </motion.div>
        {/* Main Valve Wheel */}
        <motion.svg
          className="w-4 h-4 absolute -left-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: [0, 15, 0] }}
          whileHover={{ rotate: 180 }}
          transition={{ rotate: { duration: 0.6, ease: "easeOut" }, default: { repeat: Infinity, duration: 4 } }}
        >
          {/* Outer circle */}
          <circle cx="12" cy="12" r="9" />
          {/* Inner circle handle */}
          <circle cx="12" cy="12" r="3" />
          {/* Spokes */}
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="21" />
          <line x1="3" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="21" y2="12" />
        </motion.svg>
      </div>
    </div>
  );
}

function AnimatedPartsIcon() {
  return (
    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#111827] group-hover:bg-[#C5A059] transition-colors duration-300 rounded-full flex items-center justify-center border-4 border-white z-10">
      <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 blur-[2px]" />
      <svg
        className="w-5 h-5 text-white relative z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bottom part of package */}
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        {/* Inside lines */}
        <path d="M3.27 6.96L12 12.01l8.73-5.05" />
        <path d="M12 22.08V12" />
        
        {/* Floating component above */}
        <motion.path
          d="M12 5.5l2-1.15V2l-2 1.15-2-1.15v2.35z"
          stroke="#C5A059"
          strokeWidth="1.5"
          animate={{ y: [0, -2.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How is pricing structured?",
    answer: "Pricing depends on the service package, keg size, and total volume. We offer both standard per-unit pricing for one-off batches and discounted subscription-based rates for long-term contract partners. Contact our team to receive a detailed, custom quotation."
  },
  {
    question: "Do you replace worn parts?",
    answer: "Yes, we stock and install premium, genuine spare parts including spears, neck gaskets, safety O-rings, and CO2 valves. Worn components flagged during our initial inspection are replaced dynamically upon your approval to avoid downstream product wastage."
  },
  {
    question: "How long does maintenance take?",
    answer: "Most routine sanitation, pressure testing, and minor repairs are completed within 24 to 72 hours. For exceptionally high-volume batches or complex neck straightening, our intake manager will provide a precise, bound turnaround schedule."
  },
  {
    question: "Do you provide maintenance contracts?",
    answer: "Absolutely! We offer flexible quarterly and annual preventive maintenance contracts. These planned schedules help you avoid unexpected draft downtime, stabilize upkeep costs, and keep your fleet in pristine, food-safe circulation."
  },
  {
    question: "What areas do you serve?",
    answer: "We are a mobile service company, so we go to wherever the breweries are in Ethiopia. Our primary pick-up and delivery services cover all major sub-cities in Addis Ababa and surrounding industrial zones, and we seamlessly coordinate bulk freight logistics for regional states."
  },
  {
    question: "How do you ensure hygiene?",
    answer: "We employ robust multi-stage cleaning protocols featuring high-pressure hot washes, targeted chemical descaling (to eliminate stubborn beer stone), and thermal steam sterilization. Quality is verified using high-definition borescope cameras and pressure gauges."
  }
];

export default React.memo(function Services({ onNavigate }: { onNavigate?: (page: 'home' | 'about' | 'services' | 'contact' | 'why-choose-us') => void }) {
  useSEO({
    title: 'Our Services | Hero Keg Service and Trading PLC',
    description: 'Comprehensive mobile keg services across Ethiopia: automated sanitation & steaming, structural straightening, precision TIG welding, valve & spear maintenance, pressure testing, and OEM spare parts.',
    keywords: 'keg sanitation, keg structural repair, spear service, genuine keg parts, mobile keg maintenance ethiopia',
    image: '/og-services.png',
    imageAlt: 'Hero Keg Complete Service Solutions and Spare Parts',
    urlPath: '/services'
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImg} 
            alt="Hero Keg Inspection" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent flex"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
              Our Services
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-200 leading-relaxed max-w-xl">
              End-to-end keg care solutions that protect quality, reduce
              losses, and extend the life of your assets. Our services are
              designed for breweries and draught beverage operations
              across Ethiopia.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#183346] mb-4 font-bold">Our Core Services</h2>
            <p className="text-slate-500">Professional maintenance. Technical precision. Measurable results.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8"
          >
            {/* Service 1 */}
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group rounded-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 shrink-0">
                <div className="w-full h-full overflow-hidden">
                  <img src={sanitationImg} alt="Keg Maintenance & Sanitation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <AnimatedSanitationIcon />
              </div>
              <div className="p-8 pt-10 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#183346] mb-3 font-serif group-hover:text-[#C5A059] transition-colors duration-300">1. Keg Maintenance &<br/>Sanitation</h3>
                <p className="text-[15px] text-slate-600 mb-8 border-b border-slate-100 pb-8 flex-grow">
                  Comprehensive cleaning and sanitation services
                  to protect beer quality and remove
                  contamination risks.
                </p>
                <ul className="space-y-4 mb-8 text-[15px] text-slate-700">
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Ultrasonic internal cleaning</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Beer stone (scale) removal</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Sanitation & hygiene validation</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Pressure testing & leak verification</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Residual beer disposal</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Internal visual inspection</li>
                </ul>
                <div className="bg-slate-50 p-4 flex items-center gap-4 mb-8 group-hover:bg-slate-100 transition-colors">
                  <Clock className="w-6 h-6 text-slate-400 shrink-0 group-hover:text-[#C5A059] group-hover:rotate-[360deg] transition-all duration-700" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Recommended Frequency</div>
                    <div className="text-xs text-slate-500">Every 90 - 120 days</div>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="w-full bg-[#C5A059] text-white py-4 font-semibold hover:bg-[#a38043] transition-colors flex items-center justify-center rounded-sm cursor-pointer"
                >
                  Schedule Maintenance <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group rounded-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 shrink-0">
                <div className="w-full h-full overflow-hidden">
                  <img src={repairImg} alt="Keg Repair & Structural Restoration" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <AnimatedRepairIcon />
              </div>
              <div className="p-8 pt-10 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#183346] mb-3 font-serif group-hover:text-[#C5A059] transition-colors duration-300">2. Keg Repair & Structural<br/>Restoration</h3>
                <p className="text-[15px] text-slate-600 mb-8 border-b border-slate-100 pb-8 flex-grow">
                  Restore structural integrity, eliminate leaks, and
                  extend the operational life of your kegs.
                </p>
                <ul className="space-y-4 mb-8 text-[15px] text-slate-700">
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Dent removal & body repair</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Neck straightening & alignment</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Chime (top & bottom) restoration</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Spear alignment & system check</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Leak correction & pressure testing</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Final inspection & approval</li>
                </ul>
                <div className="bg-slate-50 p-4 flex items-center gap-4 mb-8 group-hover:bg-slate-100 transition-colors">
                  <Clock className="w-6 h-6 text-slate-400 shrink-0 group-hover:text-[#C5A059] group-hover:rotate-[360deg] transition-all duration-700" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Typical Turnaround</div>
                    <div className="text-xs text-slate-500">24 - 72 hours*</div>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="w-full bg-[#C5A059] text-white py-4 font-semibold hover:bg-[#a38043] transition-colors flex items-center justify-center rounded-sm cursor-pointer"
                >
                  Book Inspection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group rounded-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 shrink-0">
                <div className="w-full h-full overflow-hidden">
                  <img src={valveImg} alt="Spear & Valve Services" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <AnimatedValveIcon />
              </div>
              <div className="p-8 pt-10 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#183346] mb-3 font-serif group-hover:text-[#C5A059] transition-colors duration-300">3. Spear & Valve<br/>Services</h3>
                <p className="text-[15px] text-slate-600 mb-8 border-b border-slate-100 pb-8 flex-grow">
                  Advanced servicing of primary control valves and
                  spear shafts to optimize liquid flow and sealing.
                </p>
                <ul className="space-y-4 mb-8 text-[15px] text-slate-700 flex-grow">
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Spear overhaul & diagnostic check</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Gasket & safety O-ring replacement</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />CO2 valve calibration & servicing</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Food-safe lubricants application</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Spear extraction, safety lock checks</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Deep safety-valve dynamic test</li>
                </ul>
                <div className="bg-slate-50 p-4 flex items-center gap-4 mb-8 mt-auto group-hover:bg-slate-100 transition-colors">
                  <Clock className="w-6 h-6 text-slate-400 shrink-0 group-hover:text-[#C5A059] group-hover:rotate-[360deg] transition-all duration-700" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Recommended Frequency</div>
                    <div className="text-xs text-slate-500">Annual or as needed</div>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="w-full bg-[#C5A059] text-white py-4 font-semibold hover:bg-[#a38043] transition-colors flex items-center justify-center rounded-sm cursor-pointer"
                >
                  Schedule Overhaul <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Service 4 */}
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group rounded-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 shrink-0">
                <div className="w-full h-full overflow-hidden">
                  <img src={partsImg} alt="Genuine Parts Supply" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <AnimatedPartsIcon />
              </div>
              <div className="p-8 pt-10 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#183346] mb-3 font-serif group-hover:text-[#C5A059] transition-colors duration-300">4. Genuine Parts<br/>Supply</h3>
                <p className="text-[15px] text-slate-600 mb-8 border-b border-slate-100 pb-8 flex-grow">
                  High-quality, genuine components for optimal
                  performance and long-term reliability.
                </p>
                <ul className="space-y-4 mb-8 text-[15px] text-slate-700 flex-grow">
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Premium spears</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />High-grade neck gaskets</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />EPDM food-safe O-rings</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Heavy-duty CO2 valves</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Sealing accessories & clamps</li>
                  <li className="flex items-start"><Check className="w-5 h-5 text-slate-900 mr-3 shrink-0 group-hover:text-[#C5A059] transition-colors" />Dedicated springs & snap rings</li>
                </ul>
                <div className="bg-slate-50 p-4 flex items-center gap-4 mb-8 mt-auto group-hover:bg-slate-100 transition-colors">
                  <LayoutGrid className="w-6 h-6 text-slate-400 shrink-0 group-hover:text-[#C5A059] group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pricing</div>
                    <div className="text-xs text-slate-500">Unit-based or contract supply</div>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="w-full bg-[#C5A059] text-white py-4 font-semibold hover:bg-[#a38043] transition-colors flex items-center justify-center rounded-sm cursor-pointer"
                >
                  Request Parts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-sm text-slate-400"
          >
            *Turnaround time depends on service volume, inspection findings, and part availability.
          </motion.div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif text-[#183346] mb-16 font-bold"
          >
            Additional Services
          </motion.h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8"
          >
            <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-pointer">
              <BarChart2 className="w-8 h-8 text-[#183346] mb-4 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
              <h3 className="font-bold text-[#183346] mb-2 text-[15px] group-hover:text-[#C5A059] transition-colors duration-300">Pressure Testing</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] group-hover:text-slate-700 transition-colors duration-300">
                Nitrogen/air pressure testing to
                ensure pressure integrity.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-pointer">
              <Search className="w-8 h-8 text-[#183346] mb-4 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
              <h3 className="font-bold text-[#183346] mb-2 text-[15px] group-hover:text-[#C5A059] transition-colors duration-300">Inspection & Reporting</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] group-hover:text-slate-700 transition-colors duration-300">
                Detailed inspection with findings
                and actionable
                recommendations.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-pointer">
              <ArrowRightLeft className="w-8 h-8 text-[#183346] mb-4 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
              <h3 className="font-bold text-[#183346] mb-2 text-[15px] group-hover:text-[#C5A059] transition-colors duration-300">Collection & Delivery</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] group-hover:text-slate-700 transition-colors duration-300">
                Flexible pickup and delivery
                options within Addis Ababa and
                nearby regions.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-pointer">
              <CalendarCheck className="w-8 h-8 text-[#183346] mb-4 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
              <h3 className="font-bold text-[#183346] mb-2 text-[15px] max-w-[180px] leading-tight group-hover:text-[#C5A059] transition-colors duration-300">Preventive Maintenance Programs</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] group-hover:text-slate-700 transition-colors duration-300">
                Planned maintenance schedules
                to reduce downtime and
                unexpected failures.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-pointer">
              <LifeBuoy className="w-8 h-8 text-[#183346] mb-4 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
              <h3 className="font-bold text-[#183346] mb-2 text-[15px] group-hover:text-[#C5A059] transition-colors duration-300">Technical Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] group-hover:text-slate-700 transition-colors duration-300">
                Expert technical guidance and
                support for your keg operations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Service Process */}
      <section className="py-24 bg-[#0B1423] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif text-white mb-4 font-bold">Our Service Process</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-20 transition-all duration-300 hover:w-24"></div>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] border-t border-dashed border-slate-700 z-0"></div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10"
            >
              {/* Step 1 */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center group">
                <div className="relative w-24 h-24 bg-[#0B1423] border border-slate-800 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#0B1423] rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">1</div>
                  <ClipboardList className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold mb-3 text-[15px] group-hover:text-[#D4AF37] transition-colors">Collection & Intake</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-300 transition-colors">
                  Kegs are collected and logged into our service system.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center group">
                <div className="relative w-24 h-24 bg-[#0B1423] border border-slate-800 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#0B1423] rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">2</div>
                  <Search className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold mb-3 text-[15px] group-hover:text-[#D4AF37] transition-colors">Inspection</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-300 transition-colors">
                  We inspect each keg for structural, hygiene, and pressure integrity.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center group">
                <div className="relative w-24 h-24 bg-[#0B1423] border border-slate-800 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#0B1423] rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">3</div>
                  <Zap className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 group-hover:rotate-12 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold mb-3 text-[15px] group-hover:text-[#D4AF37] transition-colors">Service Execution</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-300 transition-colors">
                  Cleaning, repair, part replacement, and testing are performed.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center group">
                <div className="relative w-24 h-24 bg-[#0B1423] border border-slate-800 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#0B1423] rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">4</div>
                  <CheckCircle className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold mb-3 text-[15px] group-hover:text-[#D4AF37] transition-colors">Quality Check</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-300 transition-colors">
                  Every keg is pressure tested and verified before release.
                </p>
              </motion.div>

              {/* Step 5 */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center group">
                <div className="relative w-24 h-24 bg-[#0B1423] border border-slate-800 rounded-2xl flex items-center justify-center mb-6 z-10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#D4AF37] text-[#0B1423] rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">5</div>
                  <ArrowRightLeft className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 hover:-rotate-12 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold mb-3 text-[15px] group-hover:text-[#D4AF37] transition-colors">Return & Circulation</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-300 transition-colors">
                  Kegs are returned ready for optimal performance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif text-[#183346] mb-16 font-bold text-center"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={index}
                  variants={fadeInUp} 
                  className={`border border-slate-200/60 rounded-sm bg-slate-50/10 overflow-hidden hover:border-[#C5A059]/40 hover:bg-slate-50/20 transition-all duration-300 ${
                    isOpen ? 'border-[#C5A059]/55 bg-slate-50/30' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-bold text-[#183346] text-base group-hover:text-[#C5A059] transition-colors duration-300 ${
                      isOpen ? 'text-[#C5A059]' : ''
                    }`}>
                      {faq.question}
                    </span>
                    <div className="shrink-0 ml-4">
                      <ChevronDown className={`w-5 h-5 text-[#D4AF37] transition-transform duration-300 ${
                        isOpen ? 'rotate-180 scale-110' : 'group-hover:scale-125'
                      }`} />
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed text-[14px] border-t border-slate-100/50 pt-3 bg-white/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
});
