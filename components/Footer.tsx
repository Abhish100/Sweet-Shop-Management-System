import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-[#6B1318] text-[#F5E6D3] mt-24 pt-20 pb-8 overflow-hidden font-serif border-t-4 border-[#F5E6D3]">
      
      {/* Top Wavy Separator mimicking the scalloped edge */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -mt-[1px]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#FFFDD0" fillOpacity="1"></path>
        </svg>
      </div>

      {/* Decorative Floral Pattern - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 opacity-10 text-[#F5E6D3] pointer-events-none transform translate-y-10 -translate-x-10">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100 0 C 120 50 150 50 200 100 C 150 150 120 150 100 200 C 80 150 50 150 0 100 C 50 50 80 50 100 0 Z M 100 20 C 90 60 40 60 20 100 C 40 140 90 140 100 180 C 110 140 160 140 180 100 C 160 60 110 60 100 20 Z" />
          <path d="M100 0 C 80 40 40 20 0 0 C 40 80 20 120 0 200 C 40 180 80 160 100 200 C 120 160 160 180 200 200 C 180 120 160 80 200 0 C 160 20 120 40 100 0 Z" opacity="0.5"/>
        </svg>
      </div>
      
      {/* Decorative Floral Pattern - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-10 text-[#F5E6D3] pointer-events-none transform translate-y-10 translate-x-10 scale-x-[-1]">
         <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100 0 C 120 50 150 50 200 100 C 150 150 120 150 100 200 C 80 150 50 150 0 100 C 50 50 80 50 100 0 Z M 100 20 C 90 60 40 60 20 100 C 40 140 90 140 100 180 C 110 140 160 140 180 100 C 160 60 110 60 100 20 Z" />
          <path d="M100 0 C 80 40 40 20 0 0 C 40 80 20 120 0 200 C 40 180 80 160 100 200 C 120 160 160 180 200 200 C 180 120 160 80 200 0 C 160 20 120 40 100 0 Z" opacity="0.5"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-normal tracking-wider uppercase border-b border-[#F5E6D3]/30 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3 text-sm tracking-wide text-[#F5E6D3]/80 font-sans">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Our Brands</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Shop</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Bespoke Weddings</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Corporate Gifting</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div className="space-y-6">
            <h3 className="text-xl font-normal tracking-wider uppercase border-b border-[#F5E6D3]/30 pb-2 inline-block">Policies</h3>
            <ul className="space-y-3 text-sm tracking-wide text-[#F5E6D3]/80 font-sans">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Payment & Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Return & Refund</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Terms and Conditions</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-normal tracking-wider uppercase border-b border-[#F5E6D3]/30 pb-2 inline-block">Contact</h3>
            <div className="space-y-4 text-sm tracking-wide text-[#F5E6D3]/80 font-sans">
              <p className="flex items-center gap-2">
                <span>+91 9959334007</span>
              </p>
              <p>
                <a href="mailto:sales@abhisheksweets.in" className="hover:text-white transition-colors">sales@abhisheksweets.in</a>
              </p>
              <p className="leading-relaxed opacity-90">
                Liberty Road, Opp TTD Temple,<br/>
                Himayatnagar, Hyderabad, 500029
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-normal tracking-wider uppercase border-b border-[#F5E6D3]/30 pb-2 inline-block">Newsletter</h3>
            <p className="text-sm tracking-wide text-[#F5E6D3]/80 font-sans">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="relative mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent border border-[#F5E6D3]/40 text-[#F5E6D3] px-4 py-3 focus:outline-none focus:border-[#F5E6D3] placeholder-[#F5E6D3]/30 transition-colors font-sans"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#F5E6D3] hover:text-white p-2"
              >
                ↗
              </button>
            </form>
          </div>
        </div>

        {/* Center Logo Section */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-4">
          <div className="bg-[#F5E6D3] text-[#6B1318] w-20 h-20 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition duration-500">
             <span className="font-[Great_Vibes] text-2xl">AS</span>
          </div>
          <div className="text-center">
             <h2 className="text-3xl font-[Great_Vibes] tracking-wide text-[#F5E6D3]">Abhishek Sweets</h2>
             <p className="text-[#F5E6D3]/60 text-sm tracking-[0.2em] uppercase mt-2 font-serif">Taste <span className="italic font-playfair lowercase text-lg">the</span> Legacy <span className="italic font-playfair lowercase text-lg">of</span> Craftsmanship</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F5E6D3]/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#F5E6D3]/50 font-sans tracking-wider">
          <p>© Copyright 2025, ABHISHEK SWEETS</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
             <span>FACEBOOK</span>
             <span>INSTAGRAM</span>
             <span>TWITTER</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button (Optional visual touch) */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
        <button className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition duration-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;