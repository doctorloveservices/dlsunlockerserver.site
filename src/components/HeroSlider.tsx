import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Settings, Play, Pause, Layers } from 'lucide-react';
import { SlideItem } from '../types';

interface HeroSliderProps {
  slides: SlideItem[];
  onSelectSlideLink: (tab: string) => void;
  onOpenSliderManager?: () => void;
  isAdminMode?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  onSelectSlideLink,
  onOpenSliderManager,
  isAdminMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeSlides = slides.filter((s) => s.isActive !== false);

  // Auto-play interval disabled to prevent auto scrolling
  useEffect(() => {
    // Disabled auto-rotation
  }, []);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg border border-teal-800/40 bg-slate-900"
      id="hero-banner-slider"
    >
      {/* Slide Container with Background Image or Gradient */}
      <div
        className={`relative transition-all duration-700 ease-in-out ${
          currentSlide.desktopImageUrl || currentSlide.imageUrl
            ? 'bg-slate-950'
            : `bg-gradient-to-r ${currentSlide.bgGradient}`
        } min-h-[220px] sm:min-h-[280px] md:min-h-[320px] flex flex-col justify-between`}
      >
        {/* Full Banner Bright Background Image */}
        {(currentSlide.desktopImageUrl || currentSlide.imageUrl) && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={currentSlide.desktopImageUrl || currentSlide.imageUrl}
              alt="Banner Slide"
              className="w-full h-full object-cover brightness-105 contrast-105 transition-transform duration-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};
