import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Facebook, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const loadHome = () => import('./pages/Home');
const loadAbout = () => import('./pages/AboutUs');
const loadServices = () => import('./pages/Services');
const loadContact = () => import('./pages/ContactUs');
const loadSiteIndex = () => import('./pages/SiteIndex');

const Home = lazy(loadHome);
const AboutUs = lazy(loadAbout);
const Services = lazy(loadServices);
const ContactUs = lazy(loadContact);
const SiteIndex = lazy(loadSiteIndex);

import logoImg from './assets/images/hero_keg_logo_1780328932509.png';

export const HeroKegLogo = ({ className = "" }: { className?: string }) => (
  <img 
    src={logoImg} 
    alt="Hero Keg Service and Trading PLC Logo" 
    width={48}
    height={48}
    loading="eager"
    decoding="async"
    className={`object-contain object-center shrink-0 block ${className}`} 
  />
);

type Page = 'home' | 'about' | 'services' | 'contact' | 'why-choose-us' | 'sitemap';

function getPageFromUrl(): Page {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (path === 'about' || hash === 'about') return 'about';
  if (path === 'services' || hash === 'services') return 'services';
  if (path === 'contact' || hash === 'contact') return 'contact';
  if (path === 'why-choose-us' || hash === 'why-choose-us') return 'why-choose-us';
  if (path === 'sitemap' || path === 'site-index' || hash === 'sitemap') return 'sitemap';
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => getPageFromUrl());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToWhyChooseUs = useCallback(() => {
    setCurrentPage('why-choose-us');
    if (window.location.pathname !== '/why-choose-us') {
      window.history.pushState({}, '', '/why-choose-us');
    }
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
              <a 
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
                onMouseEnter={loadHome}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'home' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Home
              </a>
              <a 
                href="/about"
                onClick={(e) => { e.preventDefault(); handleNavigate('about'); }}
                onMouseEnter={loadAbout}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'about' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                About Us
              </a>
              <a 
                href="/services"
                onClick={(e) => { e.preventDefault(); handleNavigate('services'); }}
                onMouseEnter={loadServices}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'services' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Services
              </a>
              <a 
                href="/why-choose-us"
                onClick={(e) => { e.preventDefault(); scrollToWhyChooseUs(); }}
                onMouseEnter={loadHome}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'why-choose-us' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Why Choose Us
              </a>
              <a 
                href="/contact"
                onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
                onMouseEnter={loadContact}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  currentPage === 'contact' 
                    ? 'text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                Contact Us
              </a>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <a 
                href="/contact"
                onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
                onMouseEnter={loadContact}
                className="bg-[#C5A059] text-white text-sm font-semibold px-6 py-3 rounded-sm hover:bg-[#a38043] transition-colors uppercase tracking-wide cursor-pointer inline-block"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Loading page content">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
          </div>
        }>
          {(currentPage === 'home' || currentPage === 'why-choose-us') ? (
            <Home onNavigate={handleNavigate} />
          ) : currentPage === 'about' ? (
            <AboutUs onNavigate={handleNavigate} />
          ) : currentPage === 'contact' ? (
            <ContactUs />
          ) : currentPage === 'sitemap' ? (
            <SiteIndex onNavigate={handleNavigate} />
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
              <a 
                href="/"
                className="flex items-center gap-2 mb-6 cursor-pointer"
                onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
              >
                <HeroKegLogo className="h-12 w-12 text-white" />
                <div className="leading-tight">
                  <div className="font-bold text-xl tracking-tight text-white">HERO KEG</div>
                  <div className="text-[0.6rem] font-semibold text-slate-400 tracking-wider">SERVICE AND TRADING PLC</div>
                </div>
              </a>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Professional keg maintenance, sanitation, repair, and genuine parts solutions for breweries and draught beverage operations across Ethiopia.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059]" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </button>
                <a href="https://www.linkedin.com/company/hero-keg-service-and-trading-plc/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059] inline-flex items-center justify-center" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:herokegservice@gmail.com" className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-[#C5A059] inline-flex items-center justify-center" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }} className="text-sm text-slate-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); handleNavigate('about'); }} className="text-sm text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="/why-choose-us" onClick={(e) => { e.preventDefault(); scrollToWhyChooseUs(); }} className="text-sm text-slate-400 hover:text-white transition-colors">Why Choose Us</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="text-sm text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Our Services</h4>
              <ul className="space-y-3">
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Keg Maintenance & Sanitation</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Keg Repair & Service Kits</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Spear & Valve Services</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Genuine Parts Supply</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Stainless Steel Keg Supply</a></li>
                <li><a href="/services" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left block">Dispensing Taps</a></li>
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
                  <a href="tel:+251943739086" className="text-sm text-slate-400 hover:text-white transition-colors">+251 943 739 086</a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-[#C5A059] mr-3 flex-shrink-0" />
                  <a href="mailto:herokegservice@gmail.com" className="text-sm text-slate-400 hover:text-white transition-colors">herokegservice@gmail.com</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs text-slate-500">
              © 2026 Hero Keg Service and Trading PLC. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <a href="/sitemap" onClick={(e) => { e.preventDefault(); handleNavigate('sitemap'); }} className="hover:text-[#C5A059] transition-colors">
                HTML Site Index
              </a>
              <span className="text-slate-600">•</span>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                XML Sitemap
              </a>
              <span className="text-slate-600">•</span>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                Robots.txt
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
