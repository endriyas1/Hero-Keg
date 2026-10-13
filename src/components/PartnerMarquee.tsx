import React from 'react';
import { motion } from 'motion/react';

interface Partner {
  name: string;
  logo: React.ReactNode;
}

export function PartnerMarquee() {
  const partners: Partner[] = [
    {
      name: "Dashen Beer",
      logo: (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-8 h-8 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Symmetrical Left Leaf (Green) & Right Stem */}
            <path 
              d="M 56 8
                 C 51.5 8, 49 11, 49 16
                 L 49 68
                 C 49 76, 43 82, 35 84
                 C 25 86.5, 11 87, 11 87
                 C 11 87, 10 81, 12 68
                 C 14.5 50, 25 39, 39 39
                 C 44 39, 48 40, 51 42
                 L 51 49
                 C 48 46.5, 44 46, 39 46
                 C 30 46, 20.5 54, 17.5 68
                 C 16.5 73, 16 79, 15.5 81
                 C 21 80.5, 27 79, 32 76
                 C 36 73.5, 38.5 69, 38.5 62
                 L 38.5 51
                 C 38.5 46.5, 41.5 44, 45.5 44
                 L 49.5 44
                 L 49.5 16
                 C 49.5 11, 51.5 8, 56 8 Z" 
              fill="#76B72A" 
            />
            {/* Symmetrical Right Leaf (Tan/Gold) & Left Stem */}
            <path 
              d="M 44 8
                 C 48.5 8, 51 11, 51 16
                 L 49 68
                 C 51 76, 57 82, 65 84
                 C 75 86.5, 89 87, 89 87
                 C 89 87, 90 81, 88 68
                 C 85.5 50, 75 39, 61 39
                 C 56 39, 52 40, 49 42
                 L 49 49
                 C 52 46.5, 56 46, 61 46
                 C 70 46, 79.5 54, 82.5 68
                 C 83.5 73, 84 79, 84.5 81
                 C 79 80.5, 73 79, 68 76
                 C 64 73.5, 61.5 69, 61.5 62
                 L 61.5 51
                 C 61.5 46.5, 58.5 44, 54.5 44
                 L 50.5 44
                 L 50.5 16
                 C 50.5 11, 48.5 8, 44 8 Z" 
              fill="#C5A059" 
            />
            {/* TM symbol */}
            <text x="91" y="90" fill="#C5A059" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TM</text>
          </svg>
          <span className="font-serif font-black tracking-wider text-[#183346] uppercase text-sm md:text-base">DASHEN BEER</span>
        </div>
      )
    },
    {
      name: "Heineken",
      logo: (
        <div className="flex items-center gap-1.5 select-none">
          <svg className="w-5 h-5 text-[#00B140]" viewBox="0 0 24 24" fill="currentColor">
            {/* Iconic Green Star */}
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.4 8.168L12 18.896l-7.334 3.856 1.4-8.168L.132 9.21l8.2-1.192z" />
          </svg>
          <span className="font-sans font-black tracking-normal text-[#1F2937] text-sm md:text-base">Heineken</span>
          <span className="text-[9px] font-bold text-[#E02424] align-super">®</span>
        </div>
      )
    }
  ];

  // We repeat the array so the continuous marquee stays smooth and endless
  const duplicatedPartners = Array(8).fill(partners).flat();

  return (
    <section className="py-8 bg-slate-50 border-b border-slate-100 overflow-hidden relative select-none">
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-slate-100 px-3 py-0.5 rounded-full">
          Trusted by Ethiopia's Premier Breweries
        </span>
      </div>

      <div className="w-full relative flex items-center">
        <motion.div
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105"
            >
              {partner.logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
