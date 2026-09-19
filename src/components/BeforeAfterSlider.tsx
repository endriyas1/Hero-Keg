import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftRight, Check, Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, Hammer, ChevronLeft, ChevronRight } from 'lucide-react';
import beforeBody from '../assets/images/keg_before_restoration_1779874960410.png';
import afterBody from '../assets/images/keg_after_restoration_1779874979965.png';
import beforeValve from '../assets/images/valve_before_1779884838991.png';
import afterValve from '../assets/images/valve_after_1779884859346.png';
import beforeChime from '../assets/images/chime_before_1779884875862.png';
import afterChime from '../assets/images/chime_after_1779884891335.png';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  phase: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: {
    title: string;
    desc: string;
    specs: string[];
  };
}

export function BeforeAfterSlider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: SlideItem[] = [
    {
      id: "body",
      title: "Full Body Shell",
      subtitle: "Multi-point cosmetic reconditioning",
      description: "We rescue and polish weathered, dirty, and carbonized keg shells, removing persistent beer stone deposits for a clean finish.",
      beforeImg: beforeBody,
      afterImg: afterBody,
      phase: "Cosmetic & Sanitation",
      icon: Layers,
      highlight: {
        title: "Acid & Ultrasonic Sanitation",
        desc: "Advanced non-corrosive chemical circulation and high-frequency agitation strip away years of organic buildup and calcium scale formulation.",
        specs: ["Deep de-scaling process", "Original satin grain retention", "100% surface sanitation standard"]
      }
    },
    {
      id: "valve",
      title: "Valve & Spear Assembly",
      subtitle: "Safety seal and flow calibration",
      description: "Full high-pressure tear-down, extractor safety gasket renewal, and spring calibrating for airtight pressure retention.",
      beforeImg: beforeValve,
      afterImg: afterValve,
      phase: "Leak Prevention & Safety",
      icon: ShieldCheck,
      highlight: {
        title: "Micro-Seal Calibration",
        desc: "Pressure extraction spears are fully dismounted, fitted with custom medical-grade EPDM gaskets, and tested for persistent zero-leakage.",
        specs: ["EPDM food-safe safe sealing", "Hydraulic gas-tight testing", "Spring tension compliance audit"]
      }
    },
    {
      id: "chime",
      title: "Chime & Rim Re-Rolling",
      subtitle: "Hydraulic structural straightening",
      description: "Heavy-duty hydraulic alignment of flat, dented, or warped rims, ensuring absolute stacking symmetry on conveyer lines.",
      beforeImg: beforeChime,
      afterImg: afterChime,
      phase: "Structural Tolerances",
      icon: Hammer,
      highlight: {
        title: "Wobble-Free Alignment",
        desc: "Precise metallurgical calibration and hydraulic presses straighten major chime dents, allowing safe automated plant handling and stacking.",
        specs: ["100% stacking stability rating", "TIG weld line restoration", "High-impact stress testing"]
      }
    }
  ];

  const currentSlide = slides[activeSlideIndex];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setSliderPosition(50);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setSliderPosition(50);
  };

  return (
    <section className="py-24 bg-white border-t border-b border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold text-[#C5A059] tracking-widest uppercase block bg-[#C5A059]/10 w-fit px-3 py-1 rounded-full mx-auto mb-4">
            Interactive Restoration Laboratory
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#183346] leading-tight mb-4">
            Compare Before & After Results
          </h2>
          <div className="w-12 h-1 bg-slate-900 mx-auto mb-6"></div>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Choose from three inspection modules and drag the slider handle to inspect our multi-point industrial reconditioning process.
          </p>
        </div>

        {/* Slide Selection Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          {slides.map((slide, idx) => {
            const IconComponent = slide.icon;
            const isActive = idx === activeSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setSliderPosition(50); // reset slider to center for nice comparison layout
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-sm border transition-all duration-300 text-left cursor-pointer group ${
                  isActive
                    ? 'bg-[#183346] border-[#183346] text-white shadow-lg shadow-slate-900/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#C5A059] hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-sm transition-colors ${
                  isActive ? 'bg-[#C5A059] text-[#183346]' : 'bg-slate-100 text-slate-500 group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/10'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider uppercase opacity-60">
                    Phase 0{idx + 1}
                  </div>
                  <div className="font-serif font-bold text-sm leading-tight mt-0.5">
                    {slide.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive Slider Area (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              id="keg-comparison-container"
              ref={containerRef}
              className="relative w-full max-w-[640px] aspect-[4/3] rounded-sm overflow-hidden select-none shadow-xl border border-slate-200 bg-slate-100 group"
              onTouchMove={handleTouchMove}
            >
              <AnimatePresence mode="wait">
                {/* After Product Image (Base Layer) */}
                <motion.img 
                  key={`after-${currentSlide.id}`}
                  initial={{ opacity: 0.1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.1 }}
                  transition={{ duration: 0.4 }}
                  src={currentSlide.afterImg} 
                  alt={`Restored polished clean ${currentSlide.title} after maintenance`} 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* After label */}
              <div className="absolute right-4 top-4 bg-[#10B981] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-md pointer-events-none z-20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" /> RESTORED (AFTER)
              </div>

              {/* Before Product Image (Overlay Layer with clip-path matching slider) */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={`before-${currentSlide.id}`}
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.1 }}
                    transition={{ duration: 0.4 }}
                    src={currentSlide.beforeImg} 
                    alt={`Dented and dirty old ${currentSlide.title} before restoration`} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>
              
              {/* Before label */}
              <div className="absolute left-4 top-4 bg-[#EF4444] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-md pointer-events-none z-20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> DAMAGED (BEFORE)
              </div>

              {/* Carousel Navigation Buttons */}
              <button 
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-[#C5A059] hover:text-slate-950 hover:border-[#C5A059] transition-all cursor-pointer hover:scale-110 active:scale-95 pointer-events-auto"
                aria-label="Previous Module"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button 
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-[#C5A059] hover:text-slate-950 hover:border-[#C5A059] transition-all cursor-pointer hover:scale-110 active:scale-95 pointer-events-auto"
                aria-label="Next Module"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Interactive Sliding Bar Indicator & Handle */}
              <div 
                className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Vertical Divider line */}
                <div className="absolute left-[-1.5px] top-0 bottom-0 w-[4px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"></div>
                
                {/* Handle circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#111827] border-4 border-white text-[#C5A059] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95">
                  <ArrowLeftRight className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Invisible native range slider over the workspace for mouse interactions */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                aria-label="Keg restoration slider"
              />
            </div>

            {/* Slider Instructions and Indicator Dots */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between w-full max-w-[640px] gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin duration-3000" />
                <span>Drag slider to inspect or use arrows to cycle modules</span>
              </div>
              
              {/* Carousel Dot Indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSlideIndex(idx);
                      setSliderPosition(50);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeSlideIndex ? 'w-8 bg-[#183346]' : 'w-2 bg-slate-300 hover:bg-slate-450'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Value Panel & Explanations (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#C5A059] tracking-wider uppercase bg-[#C5A059]/10 px-3 py-1 rounded-full">
                {currentSlide.phase}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#183346] mt-2">
                {currentSlide.title}
              </h3>
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {currentSlide.description}
              </p>
            </div>

            {/* Dynamic Card Highlight */}
            <div className="p-6 border border-slate-100 rounded-sm hover:border-[#C5A059] hover:bg-slate-50/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono text-slate-400">
                  RECON SPECIFICATION
                </span>
                <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold group-hover:bg-[#C5A059] group-hover:text-slate-900 transition-colors duration-300">
                  <Check className="w-3 h-3" />
                </div>
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base leading-snug group-hover:text-[#C5A059] transition-colors">
                {currentSlide.highlight.title}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mt-2 mb-4">
                {currentSlide.highlight.desc}
              </p>
              
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {currentSlide.highlight.specs.map((spec, sidx) => (
                  <div key={sidx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Pass Banner */}
            <div className="pt-2">
              <div className="bg-[#111827] text-white p-6 rounded-sm relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 font-serif font-black text-7xl select-none">
                  HERO
                </div>
                <h4 className="font-serif font-medium text-lg text-[#C5A059] mb-1">
                  100% Quality Pass Guaranteed
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
                  Every single keg passes strict food-safe cleanliness verification tests, water-bath pressure leak checks, and final clearance.
                </p>
                <div className="text-xs text-white/80 font-semibold">
                  SOP-Grade Brewery Engineering
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
