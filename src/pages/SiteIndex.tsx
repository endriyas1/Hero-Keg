import React from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import {
  FileText,
  Compass,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Wrench,
  Layers,
  Package,
  Disc,
  PenTool,
  Beer,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  CheckCircle2
} from 'lucide-react';

interface SiteIndexProps {
  onNavigate?: (page: 'home' | 'about' | 'services' | 'contact' | 'why-choose-us' | 'sitemap') => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default React.memo(function SiteIndex({ onNavigate }: SiteIndexProps) {
  const sitemapSchema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Site Index & Directory – All Pages | Hero Keg Service",
      "url": "https://www.herokegservice.com/sitemap",
      "description": "Comprehensive HTML directory and index of all pages, technical services, keg repairs, and brewery resources available from Hero Keg Service & Trading PLC.",
      "publisher": {
        "@type": "Organization",
        "name": "Hero Keg Service and Trading PLC",
        "logo": "/hero_keg_logo_1780328932509.png"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.herokegservice.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Site Index",
          "item": "https://www.herokegservice.com/sitemap"
        }
      ]
    }
  ];

  useSEO({
    title: 'Site Index & Directory – All Pages | Hero Keg Service',
    description: 'Complete index of all pages, technical services, keg repairs, and brewery resources available from Hero Keg Service & Trading PLC across Ethiopia.',
    keywords: 'hero keg sitemap, site index, all pages, brewery maintenance directory, mobile keg services index Ethiopia',
    image: '/og-home.png',
    imageAlt: 'Hero Keg Service and Trading PLC Site Directory',
    urlPath: '/sitemap',
    schema: sitemapSchema
  });

  const mainPages = [
    {
      title: 'Home Page',
      path: '/',
      pageId: 'home' as const,
      description: 'Overview of mobile keg maintenance, nationwide brewery partnerships, facility inspection lab, and customer testimonials across Ethiopia.',
      priority: '1.0 (Highest)',
      changeFreq: 'Weekly'
    },
    {
      title: 'Our Core Services',
      path: '/services',
      pageId: 'services' as const,
      description: 'Complete suite of 7 specialized services: ultrasonic sanitation, structural neck and chime restoration, spear overhauls, genuine parts, and AISI 304 keg supply.',
      priority: '0.9',
      changeFreq: 'Weekly'
    },
    {
      title: 'About Us',
      path: '/about',
      pageId: 'about' as const,
      description: 'Company background, industry heritage, technical leadership, certified Addis Ababa workshop facility, and quality assurance principles.',
      priority: '0.8',
      changeFreq: 'Monthly'
    },
    {
      title: 'Why Breweries Choose Hero Keg',
      path: '/why-choose-us',
      pageId: 'why-choose-us' as const,
      description: 'Key operational benefits including reduced beverage wastage, hygiene validation, 24-72 hour rapid turnaround, and preventive fleet maintenance.',
      priority: '0.8',
      changeFreq: 'Monthly'
    },
    {
      title: 'Contact Us & Service Booking',
      path: '/contact',
      pageId: 'contact' as const,
      description: 'Service request form, mobile maintenance dispatch inquiry, corporate office coordinates in Bole Bulbula, Addis Ababa, and direct telephone lines.',
      priority: '0.8',
      changeFreq: 'Monthly'
    }
  ];

  const coreServices = [
    {
      num: '01',
      title: 'Keg Maintenance & Sanitation',
      icon: Droplet,
      desc: 'Multi-stage ultrasonic cleaning, stubborn beer stone removal, steam sterilization, and pressure leak validation.',
      path: '/services'
    },
    {
      num: '02',
      title: 'Keg Repair, Restoration & Service Kits',
      icon: Wrench,
      desc: 'Hydraulic chime re-rolling, neck collar straightening, dent correction, spear extraction keys, torque wrenches, and on-site toolkits.',
      path: '/services'
    },
    {
      num: '03',
      title: 'Spear & Valve Services',
      icon: Layers,
      desc: 'Complete spear overhaul, food-grade EPDM gasket replacements, safety latch release checks, and CO2 calibration.',
      path: '/services'
    },
    {
      num: '04',
      title: 'Genuine Spare Parts Supply',
      icon: Package,
      desc: 'High-quality replacement spears, safety O-rings, burst discs, springs, clamps, and beverage-grade sealing components.',
      path: '/services'
    },
    {
      num: '05',
      title: 'Stainless Steel Keg Supply',
      icon: Disc,
      desc: 'AISI 304 food-grade stainless steel kegs in standard DIN, FINN, and EURO formats (20L, 30L, 50L) with customized branding.',
      path: '/services'
    },
    {
      num: '06',
      title: 'Draught Dispensing Taps',
      icon: Beer,
      desc: 'Forward-sealing flow control taps, heavy-duty event faucets, line-flush adapters, and A/S/D type coupler fittings.',
      path: '/services'
    }
  ];

  const crawlerFiles = [
    {
      title: 'XML Sitemap (Search Engine Protocol)',
      path: '/sitemap.xml',
      url: 'https://www.herokegservice.com/sitemap.xml',
      desc: 'Standard Sitemaps.org XML schema listing all canonical URLs, last modification timestamps, and crawler priorities.',
      type: 'XML'
    },
    {
      title: 'Robots Protocol File',
      path: '/robots.txt',
      url: 'https://www.herokegservice.com/robots.txt',
      desc: 'Crawler directive granting unrestricted indexing access to all public pages and declaring the XML sitemap location.',
      type: 'TXT'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" /> All Pages & Crawlable Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Site Index & Directory
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Explore the complete hierarchy of pages, mobile technical solutions, repair services, and machine-readable sitemaps provided by Hero Keg Service and Trading PLC.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section 1: Main Canonical Pages */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-sm bg-[#183346] text-[#C5A059] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Primary Website Pages</h2>
              <p className="text-sm text-slate-500">Core navigation routes indexed for search engines</p>
            </div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mainPages.map((page, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white border border-slate-200/80 rounded-sm p-6 hover:shadow-lg hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {page.path}
                    </span>
                    <span className="text-xs text-[#C5A059] font-semibold">
                      Priority: {page.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#C5A059] transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {page.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Freq: {page.changeFreq}</span>
                  <a
                    href={page.path}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page.pageId === 'why-choose-us') {
                        onNavigate?.('why-choose-us');
                      } else {
                        onNavigate?.(page.pageId);
                      }
                    }}
                    className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    Visit Page <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2: Core Services Index */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-sm bg-[#183346] text-[#C5A059] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">7 Core Specialized Services</h2>
              <p className="text-sm text-slate-500">Comprehensive breakdown of technical capabilities across Ethiopia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coreServices.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-[#C5A059]" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400">SERVICE {service.num}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">{service.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{service.desc}</p>
                  </div>
                  <a
                    href="/services"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate?.('services');
                    }}
                    className="text-xs font-semibold text-[#C5A059] hover:underline inline-flex items-center mt-2 cursor-pointer"
                  >
                    View in Services Page <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Machine-Readable Crawl Files */}
        <div className="mb-16 bg-white border border-slate-200 rounded-sm p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-sm bg-[#183346] text-[#C5A059] flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Search Engine Indexing Files</h2>
              <p className="text-sm text-slate-500">Standardized resources for search engine bots (Googlebot, Bingbot)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crawlerFiles.map((file, idx) => (
              <div key={idx} className="border border-slate-100 bg-slate-50/60 p-5 rounded-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{file.title}</span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {file.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{file.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <code className="text-xs text-slate-500 font-mono">{file.path}</code>
                  <a
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-slate-900 hover:text-[#C5A059] transition-colors"
                  >
                    Open Raw File <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-sm bg-[#183346]/5 border border-[#183346]/10 flex items-start gap-3 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All canonical URLs declare <code>robots: index, follow</code> meta headers with complete OpenGraph, Twitter card, and Schema.org JSON-LD structured data for rich search snippet indexing.
            </span>
          </div>
        </div>

        {/* Section 4: Physical Location & Quick Support */}
        <div className="bg-[#183346] text-white rounded-sm p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Need Direct Technical Support?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contact our head office or schedule a certified mobile technical unit directly to your brewery plant in Ethiopia.
              </p>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Bole Bulbula Medhanialem Mall, 4th Floor, Addis Ababa</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+251 943 739 086</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>herokegservice@gmail.com</span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('contact');
                }}
                className="inline-flex items-center px-6 py-3 bg-[#C5A059] text-white font-semibold text-xs rounded-sm hover:bg-[#a38043] transition-colors uppercase tracking-wider cursor-pointer shadow-md"
              >
                Book Inspection <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
});
