import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck,
  Sparkles,
  Settings,
  TrendingDown,
  Clock,
  Droplet,
  Wrench,
  Layers,
  Package,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Beer,
  PenTool,
  Disc,
  ChevronDown
} from 'lucide-react';

const BeforeAfterSlider = React.lazy(() => 
  import('../components/BeforeAfterSlider').then(m => ({ default: m.BeforeAfterSlider }))
);

import { PartnerMarquee } from '../components/PartnerMarquee';

import heroImg from '../assets/images/home_hero_kegs_1779722365542.webp';
import sanitationImg from '../assets/images/service_sanitation_1779717414016.webp';
import repairImg from '../assets/images/service_repair_1779717434332.webp';
import valveImg from '../assets/images/service_valves_1779717454901.webp';
import partsImg from '../assets/images/service_parts_1779717475851.webp';
import warehouseImg from '../assets/images/home_hero_kegs_1779722365542.webp';
import stainlessKegImg from '../assets/images/stainless_steel_kegs_1791562507509.webp';
import dispensingTapImg from '../assets/images/dispensing_taps_1791562526041.jpg';
import kegToolsImg from '../assets/images/keg_tools_1791562540965.jpg';

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

const homeFaqs = [
  {
    q: "How does Hero Keg provide mobile keg maintenance across Ethiopia?",
    a: "Hero Keg deploys certified mobile technical units directly to brewery and draught facilities across Ethiopia. We execute on-site ultrasonic sanitation, valve overhaul, and pressure testing without taking your fleet out of service."
  },
  {
    q: "Can damaged keg chimes, neck alignments, and bottom dents be restored?",
    a: "Yes. Our technicians use specialized hydraulic re-rolling equipment to straighten top and bottom chimes, calibrate and reform bottom dents to restore exact volume (20L, 30L, 50L), and realign neck collars to eliminate dispensing leaks."
  },
  {
    q: "What types and standards of stainless steel kegs do you supply?",
    a: "We supply high-grade AISI 304 food-grade stainless steel kegs in standard DIN, FINN, and EURO configurations across 20L, 30L, and 50L sizes with customizable embossing and neck color branding."
  },
  {
    q: "Do you supply genuine keg replacement parts and technician toolkits?",
    a: "Yes, we stock genuine spears, food-safe EPDM gaskets, safety O-rings, torque keys, valve extraction tools, and high-performance draught dispensing taps for on-site brewery operations."
  }
];

export default React.memo(function Home({ onNavigate }: { onNavigate?: (page: 'home' | 'about' | 'services' | 'contact' | 'why-choose-us') => void }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Hero Keg Service and Trading PLC",
      "url": "https://www.herokegservice.com",
      "description": "Professional mobile keg maintenance, sanitation, repair, and genuine parts solutions for breweries and draught beverage operations across Ethiopia.",
      "publisher": {
        "@type": "Organization",
        "name": "Hero Keg Service and Trading PLC",
        "logo": "/hero_keg_logo_1780328932509.png"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": homeFaqs.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    }
  ];

  const isWhyChooseUs = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase().includes('why-choose-us') ||
    window.location.hash.toLowerCase().includes('why-choose-us')
  );

  const activeTitle = isWhyChooseUs
    ? 'Why Choose Hero Keg – Certified Keg Maintenance Partner in Ethiopia'
    : 'Hero Keg Service & Trading PLC – Mobile Keg Maintenance in Ethiopia';

  const activeDescription = isWhyChooseUs
    ? 'Discover why leading breweries across Ethiopia partner with Hero Keg: mobile technical expertise, rapid 24-72h turnaround, brewery-grade sanitation, and genuine parts reliability.'
    : 'Premier mobile keg service directly to your facility in Ethiopia. Comprehensive ultrasonic sanitation, neck & chime repair, valve servicing, and AISI 304 keg supply.';

  const activeUrlPath = isWhyChooseUs ? '/why-choose-us' : '/';

  useSEO({
    title: activeTitle,
    description: activeDescription,
    keywords: 'mobile keg service Ethiopia, keg repair Addis Ababa, brewery maintenance Ethiopia, keg sanitation, stainless steel kegs Ethiopia, chime straightening, spear overhaul, Hero Keg, why choose hero keg',
    image: '/og-home.jpg',
    imageAlt: 'Hero Keg Service - Professional Mobile Keg Maintenance & Inspection in Ethiopia',
    urlPath: activeUrlPath,
    schema: homeSchema
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImg} 
            alt="Hero Keg Professional Mobile Keg Maintenance and Inspection in Ethiopia" 
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center block"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Mobile Keg Services in Ethiopia
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
              Your Mobile<br />Keg Service Partner
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-200 mb-10 leading-relaxed max-w-xl">
              We provide certified mobile keg maintenance directly to brewery facilities across Ethiopia. Professional sanitation, structural repair, valve servicing, and genuine parts solutions that minimize beer loss, protect beverage purity, and maximize operational uptime.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('contact');
                }}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-slate-900 transition-colors rounded-sm group cursor-pointer"
              >
                Request a Quote <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('contact');
                }}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-transparent bg-white/10 text-white font-medium hover:bg-white/20 transition-colors rounded-sm backdrop-blur-sm cursor-pointer"
              >
                Schedule Inspection
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Row */}
      <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center text-[23px] group">
              <ShieldCheck className="w-[45px] h-[45px] text-slate-800 mb-4 group-hover:scale-110 group-hover:text-[#C5A059] transition-all duration-300" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2">Reduce Beer Loss</h3>
              <p className="text-[16px] text-slate-500 leading-relaxed">Minimize leakage and foam waste.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
              <Sparkles className="w-[45px] h-[45px] text-slate-800 mb-4 group-hover:scale-110 group-hover:text-[#C5A059] transition-all duration-300" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2">Better Quality</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Improve carbonation and product quality.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
              <Settings className="w-[45px] h-[45px] text-slate-800 mb-4 group-hover:rotate-90 group-hover:text-[#C5A059] transition-all duration-500" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2">Extend Keg Life</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Professional care for longer asset lifespan.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
              <TrendingDown className="w-[45px] h-[45px] text-slate-800 mb-4 group-hover:translate-y-1 group-hover:text-[#C5A059] transition-all duration-300" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2">Lower Costs</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Reduce replacement and repair expenses.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center group">
              <Clock className="w-[45px] h-[45px] text-slate-800 mb-4 group-hover:rotate-[360deg] group-hover:text-[#C5A059] transition-all duration-700" strokeWidth={1.5} />
              <h3 className="text-[15px] font-bold uppercase tracking-wider mb-2">Operational Uptime</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">More reliable keg circulation.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-slate-900 mb-4">Our Core Services</h2>
            <div className="w-12 h-1 bg-slate-900 mx-auto transition-all duration-300 hover:w-24"></div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center max-w-6xl mx-auto"
          >
            {/* Service 1 */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={sanitationImg} alt="Brewery Keg Maintenance and Ultrasonic Internal Sanitation in Ethiopia" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Droplet className="w-5 h-5 group-hover:animate-bounce" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Keg Maintenance & Sanitation</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">Advanced cleaning, beer stone removal, ultrasonic sanitation, pressure testing, and leak verification.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={repairImg} alt="Commercial Keg Structural Repair, Neck Straightening, and Chime Re-rolling" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Wrench className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
                  Keg Repair & Service Kits
                </h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">Dent removal, neck & chime restoration, plus specialized spear extraction tools, torque keys, and on-site maintenance kits.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={valveImg} alt="Spear and CO2 Pressure Valve Servicing for Brewery Kegs" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Layers className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Spear & Valve Services</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">Spear overhaul, gasket and O-ring replacement, CO2 valve servicing, and pressure testing.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Service 4 */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={partsImg} alt="Genuine Keg Spare Parts, EPDM Gaskets, and Food-Safe O-Rings Supply" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Package className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Genuine Parts Supply</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">High-quality genuine spears, gaskets, O-rings, CO2 valves, and other sealing components.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Service 5: Stainless Steel Keg Supply */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={stainlessKegImg} alt="High-Grade AISI 304 Stainless Steel Keg Supply in 20L, 30L, and 50L Sizes" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Disc className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Stainless Steel Keg Supply</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">High-grade AISI 304 food-grade stainless steel kegs in standard DIN, FINN, and EURO sizes (20L, 30L, 50L) with customizable embossing and neck color branding.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Service 6: Dispensing Taps */}
            <motion.div variants={fadeInUp} className="w-full max-w-[350px] mx-auto bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[250px] w-full max-w-[350px] overflow-hidden bg-slate-100">
                <img src={dispensingTapImg} alt="Durable High-Performance Draught Beer Dispensing Taps for Breweries" width={350} height={250} loading="lazy" decoding="async" className="w-full h-[250px] object-cover object-center group-hover:scale-110 transition-transform duration-700 block" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Beer className="w-5 h-5 group-hover:animate-bounce transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Dispensing Taps</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">Supply of durable, high-performance dispensing taps for brewery and beverage dispensing applications.</p>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('services');
                  }}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Partners */}
      <PartnerMarquee />

      {/* Why Choose Us */}
      <section id="why-choose-us" className="scroll-mt-24 py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-serif font-bold text-slate-900 mb-10 leading-tight">
                Why Breweries Choose<br />Hero Keg
              </motion.h2>
              
              <ul className="space-y-5 mb-10">
                {[
                  'Industry-specific technical expertise',
                  'One-stop solution for maintenance, repair and parts',
                  'Brewery-grade sanitation and safety standards',
                  'Genuine parts for long-term reliability',
                  'Preventive maintenance to reduce downtime and losses',
                  'Partnership approach focused on your success'
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex items-start group">
                    <CheckCircle2 strokeWidth={1} className="w-6 h-6 text-slate-900 mr-3 flex-shrink-0 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" />
                    <span className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-900 transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div variants={fadeInUp}>
                <button 
                  onClick={() => onNavigate?.('about')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#C5A059] text-white font-medium rounded-sm hover:bg-[#a38043] hover:shadow-lg transition-all duration-300 uppercase tracking-wide text-sm group cursor-pointer"
                >
                  Discover More About Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group w-full"
            >
               <div className="absolute inset-0 bg-slate-100 transform translate-x-4 translate-y-4 z-0 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
               <div className="relative z-10 w-full overflow-hidden rounded-sm shadow-lg bg-slate-100 aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]">
                 <img 
                   src={warehouseImg} 
                   alt="Hero Keg certified mobile keg fleet maintenance and storage facility in Addis Ababa, Ethiopia" 
                   width={800}
                   height={500}
                   loading="lazy"
                   decoding="async"
                   className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 block"
                   referrerPolicy="no-referrer"
                 />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO Frequently Asked Questions Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60 overflow-hidden" aria-labelledby="faq-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-serif text-slate-900 font-bold mb-4">
              Answers About Our Mobile Keg Services
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base">
              Learn how Hero Keg supports breweries, taprooms, and beverage operators across Ethiopia with specialized mobile keg maintenance.
            </p>
            <div className="w-12 h-1 bg-[#C5A059] mx-auto mt-6"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`border border-slate-200 rounded-sm bg-white overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-[#C5A059]/60 shadow-md' : 'hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-bold text-base transition-colors ${
                      isOpen ? 'text-[#C5A059]' : 'text-slate-900 group-hover:text-[#C5A059]'
                    }`}>
                      {faq.q}
                    </span>
                    <div className="shrink-0 ml-4">
                      <ChevronDown className={`w-5 h-5 text-[#C5A059] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Before/After Keg Restoration Slider Section (Lazy Loaded) */}
      <Suspense fallback={
        <div className="py-24 bg-slate-900 text-center flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C5A059]" />
        </div>
      }>
        <BeforeAfterSlider />
      </Suspense>
    </motion.div>
  );
});

