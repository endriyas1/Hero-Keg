import React, { useState, Suspense, lazy, useCallback } from 'react';
import { Facebook, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Services = lazy(() => import('./pages/Services'));
const ContactUs = lazy(() => import('./pages/ContactUs'));

import logoImg from './assets/images/hero_keg_logo_1780328932509.png';

export const HeroKegLogo = ({ className = "" }: { className?: string }) => (
  <img src={logoImg} alt="Hero Keg Logo" className={`object-contain ${className}`} />
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'services' | 'contact' | 'why-choose-us'>('home');

  const handleNavigate = useCallback((page: 'home' | 'about' | 'services' | 'contact' | 'why-choose-us') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToWhyChooseUs = useCallback(() => {
    setCurrentPage('why-choose-us');
    setTimeout(() => {
      document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigate('home')}
            >
              <HeroKegLogo className="h-12 w-12 text-[#183346]" />
              <div className="leading-tight">
                <div className="font-bold text-xl tracking-tight text-slate-900">HERO KEG</div>
                <div className="text-[0.6rem] font-semibold text-slate-500 tracking-wider">SERVICE AND TRADING PLC</div>
              </div>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigate('home')}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'home' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigate('about')}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'about' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                About Us
              </button>
              <button 
                onClick={() => handleNavigate('services')}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'services' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Services
              </button>
              <button 
                onClick={scrollToWhyChooseUs}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'why-choose-us' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Why Choose Us
              </button>
              <button 
                onClick={() => handleNavigate('contact')}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'contact' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >Contact Us</button>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <button 
                onClick={() => handleNavigate('contact')}
                className="bg-[#C5A059] text-white text-sm font-semibold px-6 py-3 rounded-sm hover:bg-[#a38043] transition-colors uppercase tracking-wide cursor-pointer"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div></div>}>
          {(currentPage === 'home' || currentPage === 'why-choose-us') ? (
            <Home onNavigate={handleNavigate} />
          ) : currentPage === 'about' ? (
            <AboutUs onNavigate={handleNavigate} />
          ) : currentPage === 'contact' ? (
            <ContactUs />
          ) : (
            <Services onNavigate={handleNavigate} />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] pt-16 pb-8 text-white border-t-4 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1 */}
            <div>
              <div 
                className="flex items-center gap-2 mb-6 cursor-pointer"
                onClick={() => handleNavigate('home')}
              >
                <HeroKegLogo className="h-12 w-12 text-white" />
                <div className="leading-tight">
                  <div className="font-bold text-xl tracking-tight text-white">HERO KEG</div>
                  <div className="text-[0.6rem] font-semibold text-slate-400 tracking-wider">SERVICE AND TRADING PLC</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Professional keg maintenance, sanitation, repair, and genuine parts solutions for breweries and draught beverage operations across Ethiopia.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059]">
                  <Facebook className="w-4 h-4" />
                </button>
                <a href="https://www.linkedin.com/company/hero-keg-service-and-trading-plc/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059] inline-flex items-center justify-center">
                  <Linkedin className="w-4 h-4" />
                </a>
                <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059]">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleNavigate('home')} className="text-sm text-slate-400 hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => handleNavigate('about')} className="text-sm text-slate-400 hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors">Services</button></li>
                <li><button onClick={scrollToWhyChooseUs} className="text-sm text-slate-400 hover:text-white transition-colors">Why Choose Us</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="text-sm text-slate-400 hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Our Services</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Keg Sanitation & Cleaning</button></li>
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Structural Repair & Welding</button></li>
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Valve Maintenance & Replacement</button></li>
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Pressure & Leak Testing</button></li>
                <li><button onClick={() => handleNavigate('services')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Genuine Spare Parts Supply</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#C5A059] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400 leading-relaxed">Bole Bulbula Medhanialem Mall, 4th Floor<br/>Office No. 420, Addis Ababa, Ethiopia</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-[#C5A059] mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-400">+251 943 739 086</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-[#C5A059] mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-400">herokegservice@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              © 2026 Hero Keg Service and Trading PLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
