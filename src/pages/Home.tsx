import React, { useState, useEffect } from 'react';
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
  Shield,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

import heroImg from '../assets/images/home_hero_kegs_1779722365542.png';
import sanitationImg from '../assets/images/service_sanitation_1779717414016.png';
import repairImg from '../assets/images/service_repair_1779717434332.png';
import valveImg from '../assets/images/service_valves_1779717454901.png';
import partsImg from '../assets/images/service_parts_1779717475851.webp';
import warehouseImg from '../assets/images/home_hero_kegs_1779722365542.png';

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

export default React.memo(function Home({ onNavigate }: { onNavigate?: (page: 'home' | 'about' | 'services' | 'contact' | 'why-choose-us') => void }) {
  useSEO({
    title: 'Hero Keg Service and Trading PLC - Professional Mobile Keg Services',
    description: 'We provide Mobile Keg Service directly to your facility in Ethiopia. Professional keg maintenance, chime & neck repair, sanitation, valve servicing, and genuine spare parts.',
    keywords: 'mobile keg service, keg repair, brewery maintenance, keg sanitation, draught beer Ethiopia, Hero Keg',
    image: '/og-home.png',
    imageAlt: 'Hero Keg Service - Professional Mobile Keg Maintenance & Inspection',
    urlPath: '/'
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImg} 
            alt="Hero Keg Inspection" 
            className="w-full h-full object-cover object-center"
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
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
              Your Mobile<br />Keg Service
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-200 mb-10 leading-relaxed max-w-xl">
              We provide Mobile Keg Service directly to your facility. Professional keg maintenance, sanitation, repair, and genuine parts solutions that help breweries reduce losses, protect beer quality, and improve operational uptime.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {/* Service 1 */}
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={sanitationImg} alt="Sanitation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
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
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={repairImg} alt="Repair" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 bg-[#111827] text-white p-2 group-hover:bg-[#C5A059] transition-colors duration-300">
                  <Wrench className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors duration-300">Keg Repair & Structural Restoration</h3>
                <p className="text-sm text-slate-600 mb-6 flex-grow">Dent removal, neck straightening, chime restoration, inspection, and pressure integrity checks.</p>
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
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={valveImg} alt="Valves" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
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
            <motion.div variants={fadeInUp} className="bg-white shadow-sm hover:shadow-xl border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={partsImg} alt="Genuine Parts" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
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
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#161F2E] text-white overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700 text-center">
            <motion.div variants={fadeInUp} className="py-6 md:py-0 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors">13,639+</div>
              <div className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Kegs Maintained</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="py-6 md:py-0 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8 text-slate-400 mb-3 group-hover:text-[#C5A059] group-hover:scale-110 transition-all duration-300" strokeWidth={1.5} />
              <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors">17,000+</div>
              <div className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Spear & Gaskets Replaced</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="py-6 md:py-0 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
              <Gauge className="w-8 h-8 text-slate-400 mb-3 group-hover:text-[#C5A059] group-hover:rotate-45 transition-all duration-500" strokeWidth={1.5} />
              <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors">100%</div>
              <div className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Pressure Tested</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Partners */}
      <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted By Leading Breweries</h3>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex overflow-hidden relative w-full"
          >
            <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] py-4">
              {[...Array(8)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center justify-center mx-10 md:mx-20 min-w-[160px] opacity-70 hover:opacity-100 transition-all duration-300">
                    <img 
                      src="/dashen-logo.png" 
                      alt="Dashen Breweries S.C" 
                      className="h-16 md:h-20 object-contain" 
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none'; 
                        e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                        e.currentTarget.nextElementSibling?.classList.add('flex'); 
                      }} 
                    />
                    <div className="flex flex-col items-center justify-center mt-3">
                       <span className="text-xl font-black tracking-tight text-slate-800 uppercase">Dashen</span>
                       <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5 text-center">Breweries S.C</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mx-10 md:mx-20 min-w-[160px] opacity-70 hover:opacity-100 transition-all duration-300">
                    <img 
                      src="/heineken-logo.png" 
                      alt="Heineken" 
                      className="h-16 md:h-20 object-contain" 
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none'; 
                        e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                        e.currentTarget.nextElementSibling?.classList.add('flex'); 
                      }} 
                    />
                    <div className="flex flex-col items-center justify-center mt-3">
                       <span className="text-2xl font-bold tracking-tighter text-slate-800 font-serif">Heineken</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-[#C5A059] text-white font-medium rounded-sm hover:bg-[#a38043] hover:shadow-lg transition-all duration-300 uppercase tracking-wide text-sm group">
                  Discover More About Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
               <div className="absolute inset-0 bg-slate-100 transform translate-x-4 translate-y-4 z-0 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
               <img 
                 src={warehouseImg} 
                 alt="Hero Keg Warehouse" 
                 className="relative z-10 w-full h-[500px] object-contain bg-slate-50 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2"
                 referrerPolicy="no-referrer"
               />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Keg Restoration Slider Section */}
      <BeforeAfterSlider />
    </motion.div>
  );
});

