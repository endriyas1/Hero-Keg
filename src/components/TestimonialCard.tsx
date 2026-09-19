import React from 'react';
import { Quote, Star } from 'lucide-react';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating?: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const rating = testimonial.rating || 5;

  return (
    <div className="bg-white border border-slate-200/60 rounded-sm p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative group min-h-[280px]">
      {/* Decorative quote icon */}
      <div className="absolute top-6 right-8 text-slate-100 group-hover:text-[#C5A059]/10 transition-colors duration-500">
        <Quote className="w-16 h-16 rotate-180" strokeWidth={1} />
      </div>

      <div className="relative z-10 flex-grow">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: rating }).map((_, idx) => (
            <Star key={idx} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1.5} />
          ))}
        </div>

        {/* Quote Content */}
        <p className="text-slate-600 italic leading-relaxed text-base mb-8 font-sans">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author Details */}
      <div className="relative z-10 flex items-center gap-4 mt-auto border-t border-slate-100 pt-6">
        <div className="w-12 h-12 rounded-full bg-slate-900 text-[#C5A059] flex items-center justify-center font-serif font-bold text-base select-none group-hover:bg-[#C5A059] group-hover:text-slate-900 transition-colors duration-300 shrink-0 border border-slate-200">
          {testimonial.company.substring(0, 1)}
        </div>
        <div>
          <h4 className="font-bold text-[#183346] text-sm leading-tight transition-colors duration-300 group-hover:text-[#C5A059]">
            {testimonial.author}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {testimonial.role} &bull; <span className="font-semibold text-slate-800">{testimonial.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
