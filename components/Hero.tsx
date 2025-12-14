import React, { useState } from 'react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // TRIO of high-availability images. If one fails, we try the next.
  const IMAGES = [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2000&auto=format&fit=crop", // Unsplash
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/1280px-Indian_sweets_ds.jpg", // Wikimedia
    "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Pexels
  ];

  const handleImageError = () => {
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < IMAGES.length) {
      console.log(`Image source ${currentImageIndex} failed. Switching to source ${nextIndex}.`);
      setCurrentImageIndex(nextIndex);
    } else {
      console.log("All image sources failed. Activating CSS fallback pattern.");
      setHasError(true);
    }
  };

  const scrollToShop = () => {
    window.scrollTo({
      top: 700,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full h-[600px] md:h-[750px] overflow-hidden bg-[#6B1318]">
      
      {/* 1. IMAGE LAYER */}
      {!hasError && (
        <img 
          key={currentImageIndex} // Key forces a complete re-render when index changes
          src={IMAGES[currentImageIndex]}
          alt="Authentic Indian Sweets"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-105 z-0"
          onError={handleImageError}
        />
      )}

      {/* 2. FALLBACK PATTERN LAYER (Visible only if all images fail) */}
      {hasError && (
        <div className="absolute inset-0 w-full h-full z-0 opacity-20"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5E6D3' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundColor: '#6B1318'
             }}>
        </div>
      )}

      {/* 3. GRADIENT OVERLAY (Lighter opacity to ensure image is visible) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10 pointer-events-none"></div>

      {/* 4. CONTENT LAYER */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-white pt-10">
        
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-6 drop-shadow-2xl">
            <span className="block italic font-light tracking-wide text-[#F5E6D3]">Festive Specials</span>
            <span className="block font-medium mt-2 text-white">to Timeless Favourites</span>
          </h1>

          <p className="text-sm md:text-base tracking-[0.25em] uppercase font-light mb-12 drop-shadow-md text-gray-100 border-l-2 border-[#F5E6D3] pl-6">
            Find something to sweeten every moment under one roof.
          </p>

          <button 
            onClick={scrollToShop}
            className="bg-[#FFFDD0] text-[#6B1318] px-10 py-4 font-serif text-lg tracking-widest uppercase hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-xl border border-white"
          >
            Explore Now
          </button>
        </div>
      </div>

      {/* 5. DECORATIVE SCALLOPED EDGE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 -mb-[1px] z-20">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[70px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#FFFDD0" fillOpacity="1"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;