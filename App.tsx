import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { api } from './services/api';
import { Sweet, SweetFilter } from './types';
import SweetCard from './components/SweetCard';
import AdminPanel from './components/AdminPanel';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import AiSommelier from './components/AiSommelier';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CartDrawer from './components/CartDrawer';

// --- Inner App Component to use AuthContext & CartContext ---
const AbhishekSweetsApp = () => {
  const { user, isAdmin } = useAuth(); // removed logout here, used in UserProfile
  const { toggleCart, cartCount } = useCart();
  
  // State
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loadingSweets, setLoadingSweets] = useState(true);
  
  // Filters State
  const [filter, setFilter] = useState<SweetFilter>({
    category: '',
    minPrice: 0,
    maxPrice: 2000 
  });
  
  const [sortOption, setSortOption] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  
  // AI Recommendations State
  const [recommendations, setRecommendations] = useState<{ sweetId: string; reason: string }[]>([]);

  // Admin State
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  // Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Navigation Section States
  const [activeSection, setActiveSection] = useState<'all' | 'india' | 'international' | 'festive'>('all');
  const [showOurStory, setShowOurStory] = useState(false);
  const [showCraftsmanship, setShowCraftsmanship] = useState(false);

  // Fetch Data
  const fetchSweets = async () => {
    setLoadingSweets(true);
    try {
      const data = await api.getSweets();
      setSweets(data);
    } catch (e) {
      console.error("Failed to load sweets", e);
    } finally {
      setLoadingSweets(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleRestock = async (id: string, amount: number) => {
    try {
      await api.restockSweet(id, amount);
      await fetchSweets();
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.deleteSweet(id);
      await fetchSweets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSweet = async (sweet: Omit<Sweet, 'id'>) => {
    try {
      await api.addSweet(sweet);
      await fetchSweets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSweet = async (id: string, updates: Partial<Sweet>) => {
    try {
      await api.updateSweet(id, updates);
      await fetchSweets();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Filtering Logic ---
  const filteredSweets = sweets.filter(sweet => {
    const matchesCategory = filter.category ? sweet.category === filter.category : true;
    const matchesPrice = sweet.price >= filter.minPrice && sweet.price <= filter.maxPrice;
    
    // Apply section filter
    let matchesSection = true;
    if (activeSection === 'india') {
      // All sweets are Indian sweets, so show all
      matchesSection = true;
    } else if (activeSection === 'international') {
      // International sweets - for now, show none (coming soon)
      matchesSection = false;
    } else if (activeSection === 'festive') {
      // Show sweets that are popular for festivals
      const festiveCategories = ['Laddu', 'Dry Fruit', 'Ghee Based'];
      matchesSection = festiveCategories.includes(sweet.category);
    }
    
    return matchesCategory && matchesPrice && matchesSection;
  });
  
  // Sort Logic: AI recommendations always first, then user sort preference
  const displayedSweets = [...filteredSweets].sort((a, b) => {
     const isARec = recommendations.some(r => r.sweetId === a.id);
     const isBRec = recommendations.some(r => r.sweetId === b.id);
     
     // Primary Sort: AI Recommendations
     if (isARec && !isBRec) return -1;
     if (!isARec && isBRec) return 1;

     // Secondary Sort: User Selection
     if (sortOption === 'priceAsc') return a.price - b.price;
     if (sortOption === 'priceDesc') return b.price - a.price;
     
     return 0;
  });

  const categories = Array.from(new Set(sweets.map(s => s.category)));

  const handleUserIconClick = () => {
    if (user) {
      setShowProfileModal(true);
    } else {
      setShowAuthModal(true);
    }
  };
  
  const resetFilters = () => {
    setFilter({
      category: '',
      minPrice: 0,
      maxPrice: 2000
    });
    setSortOption('default');
    setActiveSection('all');
  };

  return (
    <div className="min-h-screen bg-[#FFFDD0] flex flex-col font-sans relative">
      <CartDrawer />
      
      {/* Top Bar - Maroon */}
      <div className="bg-[#6B1318] text-[#F5E6D3] text-center py-2 text-[11px] font-bold tracking-[0.15em] uppercase z-50">
        Free Shipping Pan India <span className="text-[#FFD700] ml-1">ORDER NOW!</span>
      </div>

      {/* Main Navigation - Cream Background */}
      <nav className="bg-[#FDFBF7] sticky top-0 z-40 shadow-sm border-b border-[#E5DCC5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Left Links (Desktop) */}
            <div className="hidden lg:flex gap-8 text-[11px] font-semibold tracking-widest uppercase flex-1 justify-start items-center text-gray-800">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('all');
                  setShowOurStory(false);
                  setShowCraftsmanship(false);
                  setTimeout(() => {
                    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                  activeSection === 'all' 
                    ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                    : 'border-transparent hover:border-[#6B1318]'
                }`}
              >
                All
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('india');
                  setShowOurStory(false);
                  setShowCraftsmanship(false);
                  setTimeout(() => {
                    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                  activeSection === 'india' 
                    ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                    : 'border-transparent hover:border-[#6B1318]'
                }`}
              >
                Shop India
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('international');
                  setShowOurStory(false);
                  setShowCraftsmanship(false);
                  setTimeout(() => {
                    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                  activeSection === 'international' 
                    ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                    : 'border-transparent hover:border-[#6B1318]'
                }`}
              >
                Shop International
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('festive');
                  setShowOurStory(false);
                  setShowCraftsmanship(false);
                  setTimeout(() => {
                    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                  activeSection === 'festive' 
                    ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                    : 'border-transparent hover:border-[#6B1318]'
                }`}
              >
                Festive Gifting
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0 flex items-center justify-center px-4 transform transition duration-500 hover:scale-105 cursor-pointer" onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); setActiveSection('all'); setShowOurStory(false); setShowCraftsmanship(false); }}>
               <svg width="180" height="85" viewBox="0 0 300 150">
                  <ellipse cx="150" cy="75" rx="145" ry="70" fill="#E61E25" />
                  <g transform="translate(150, 45)">
                     <circle cx="0" cy="0" r="24" fill="none" stroke="white" strokeWidth="2.5" />
                     <text x="0" y="8" textAnchor="middle" fill="white" fontFamily="'Great Vibes', cursive" fontSize="28">AS</text>
                     <path d="M-8,14 Q0,22 8,14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <text x="150" y="105" textAnchor="middle" fill="white" fontFamily="'Playfair Display', serif" fontSize="32" letterSpacing="0.5px">Abhishek Sweets</text>
               </svg>
            </div>

            {/* Right Links & Icons */}
            <div className="flex items-center gap-6 lg:gap-8 flex-1 justify-end">
               <div className="hidden lg:flex gap-8 text-[11px] font-semibold tracking-widest uppercase text-gray-800 items-center">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowOurStory(true);
                      setShowCraftsmanship(false);
                      setTimeout(() => {
                        document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                      showOurStory 
                        ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                        : 'border-transparent hover:border-[#6B1318]'
                    }`}
                  >
                    Our Story
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCraftsmanship(true);
                      setShowOurStory(false);
                      setTimeout(() => {
                        document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className={`hover:text-[#6B1318] transition border-b-2 pb-1 cursor-pointer ${
                      showCraftsmanship 
                        ? 'text-[#6B1318] border-[#6B1318] font-bold' 
                        : 'border-transparent hover:border-[#6B1318]'
                    }`}
                  >
                    Craftsmanship
                  </button>
               </div>

               <div className="flex items-center gap-6 text-gray-900">
                  {/* Cart Icon */}
                  <button onClick={toggleCart} className="hover:text-[#6B1318] transition relative group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#6B1318] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-slow">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  {/* User Icon (Triggers Auth or Profile) */}
                  <button 
                    onClick={handleUserIconClick}
                    className={`transition flex items-center gap-2 relative ${user ? 'text-[#6B1318]' : 'hover:text-[#6B1318]'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>}
                  </button>
               </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Mobile Navigation Section Selector */}
      <div className="lg:hidden bg-white border-b border-[#E5DCC5] sticky top-[96px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => {
                setActiveSection('all');
                setShowOurStory(false);
                setShowCraftsmanship(false);
              }}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded transition ${
                activeSection === 'all' 
                  ? 'bg-[#6B1318] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => {
                setActiveSection('india');
                setShowOurStory(false);
                setShowCraftsmanship(false);
              }}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded transition ${
                activeSection === 'india' 
                  ? 'bg-[#6B1318] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shop India
            </button>
            <button 
              onClick={() => {
                setActiveSection('international');
                setShowOurStory(false);
                setShowCraftsmanship(false);
              }}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded transition ${
                activeSection === 'international' 
                  ? 'bg-[#6B1318] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              International
            </button>
            <button 
              onClick={() => {
                setActiveSection('festive');
                setShowOurStory(false);
                setShowCraftsmanship(false);
              }}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap rounded transition ${
                activeSection === 'festive' 
                  ? 'bg-[#6B1318] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Festive
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
        
        {/* Our Story Section */}
        {showOurStory && (
          <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5DCC5]">
            <div className="bg-gradient-to-r from-[#6B1318] to-[#8B1A1F] text-white p-8">
              <h1 className="text-4xl font-serif font-bold mb-2">Our Story</h1>
              <p className="text-[#F5E6D3] text-lg">A Journey of Passion, Tradition, and Love</p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/800px-Indian_sweets_ds.jpg" 
                    alt="Traditional Indian sweets display" 
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/800x600/6B1318/FFFDD0?text=Indian+Sweets`;
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif text-[#6B1318] font-bold">Humble Beginnings</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    It all started in 1985, in a small corner shop in the heart of the old city. With just a single counter, 
                    a traditional wood-fired stove, and an unwavering passion for creating the perfect sweet, Abhishek Sweets 
                    was born. Our founder, a master confectioner with generations of recipes passed down through his family, 
                    opened the doors with a simple dream: to share the authentic taste of India with the world.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    That small shop, barely 200 square feet, became a beloved neighborhood treasure. Every morning, the aroma 
                    of fresh ghee, cardamom, and saffron would fill the air, drawing customers from near and far. Word spread 
                    quickly about the exceptional quality and the secret family recipes that made our sweets truly special.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div className="order-2 md:order-1 space-y-4">
                  <h2 className="text-3xl font-serif text-[#6B1318] font-bold">Growing with Love</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    As the years passed, our reputation grew. What started as a single shop became a destination for sweet lovers 
                    across the region. Families would travel for hours to taste our signature Laddus, Barfis, and Halwas. 
                    Weddings, festivals, and celebrations weren't complete without a box from Abhishek Sweets.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    But through all the growth, we never forgot our roots. Every sweet is still made with the same care, the same 
                    traditional methods, and most importantly, the same love that went into that first batch in 1985. Our master 
                    craftsmen, many of whom have been with us for decades, ensure that every piece meets our exacting standards.
                  </p>
                </div>
                <div className="order-1 md:order-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/800px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Traditional sweets - Gulab Jamun" 
                    className="w-full h-auto rounded-lg shadow-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x600/6B1318/FFFDD0?text=Gulab+Jamun`;
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFFDD0] to-[#F5E6D3] p-8 rounded-xl border-l-4 border-[#6B1318]">
                <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-[#6B1318] font-bold mb-4">Today & Tomorrow</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      Today, Abhishek Sweets has grown from that single shop to a trusted name across India, with the ability to 
                      deliver our authentic sweets to your doorstep. We've embraced technology to reach more customers, but our 
                      commitment to traditional craftsmanship remains unchanged.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      As we look to the future, we carry forward the legacy of that small shop - where every sweet is made with love, 
                      every recipe is a family secret, and every customer is treated like family. Join us on this sweet journey, 
                      and taste the difference that passion and tradition make.
                    </p>
                  </div>
                  <div>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/600px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                      alt="Rasgulla - Traditional sweet" 
                      className="w-full h-auto rounded-lg shadow-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x500/6B1318/FFFDD0?text=Rasgulla`;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setShowOurStory(false);
                    setActiveSection('all');
                  }}
                  className="bg-[#6B1318] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B1A1F] transition shadow-lg"
                >
                  Explore Our Sweets
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Craftsmanship Section */}
        {showCraftsmanship && (
          <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5DCC5]">
            <div className="bg-gradient-to-r from-[#6B1318] to-[#8B1A1F] text-white p-8">
              <h1 className="text-4xl font-serif font-bold mb-2">Craftsmanship</h1>
              <p className="text-[#F5E6D3] text-lg">The Secret Art of Making Sweets with Love</p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="mb-12 text-center">
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Behind every sweet at Abhishek Sweets lies a secret - not just a recipe, but a way of preparing sweets 
                  that has been perfected over generations. It's a process infused with love, patience, and an unwavering 
                  commitment to excellence.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-[#FFFDD0] to-[#F5E6D3] p-6 rounded-xl shadow-md">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/600px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Gulab Jamun - Handcrafted sweets" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/6B1318/FFFDD0?text=Gulab+Jamun`;
                    }}
                  />
                  <h3 className="text-2xl font-serif text-[#6B1318] font-bold mb-3">The Secret of Timing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every ingredient is added at the perfect moment. Our master craftsmen know exactly when to add the ghee, 
                    when to stir, and when to let the mixture rest. This timing, passed down through generations, creates 
                    the perfect texture and flavor that sets our sweets apart.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#FFFDD0] to-[#F5E6D3] p-6 rounded-xl shadow-md">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/600px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Kaju Katli - Premium dry fruit sweets" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/6B1318/FFFDD0?text=Kaju+Katli`;
                    }}
                  />
                  <h3 className="text-2xl font-serif text-[#6B1318] font-bold mb-3">Premium Ingredients, Pure Love</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We source only the finest ingredients - pure desi ghee, premium dry fruits, aromatic cardamom, and the 
                    finest saffron. But more than the quality, it's the love with which we select and prepare each ingredient 
                    that makes the difference. Every batch is a labor of love.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#E5DCC5]">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/400px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Peda - Master craftsmanship" 
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/6B1318/FFFDD0?text=Peda`;
                    }}
                  />
                  <h4 className="text-xl font-serif text-[#6B1318] font-bold mb-2">Master Craftsmen</h4>
                  <p className="text-gray-600 text-sm">
                    Our artisans have dedicated their lives to perfecting the art of sweet-making, with many having over 30 years of experience.
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#E5DCC5]">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/400px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Jalebi - Traditional methods" 
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/6B1318/FFFDD0?text=Jalebi`;
                    }}
                  />
                  <h4 className="text-xl font-serif text-[#6B1318] font-bold mb-2">Traditional Methods</h4>
                  <p className="text-gray-600 text-sm">
                    We still use traditional wood-fired stoves and copper vessels, ensuring authentic taste and texture in every bite.
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md border border-[#E5DCC5]">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/400px-Indian_sweets_ds.jpg"
                    loading="lazy" 
                    alt="Rasmalai - Made with love" 
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/6B1318/FFFDD0?text=Rasmalai`;
                    }}
                  />
                  <h4 className="text-xl font-serif text-[#6B1318] font-bold mb-2">Made with Love</h4>
                  <p className="text-gray-600 text-sm">
                    Every sweet is prepared with the same care and attention as if it were being made for our own family.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#6B1318] to-[#8B1A1F] text-white p-8 rounded-xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-serif font-bold mb-4">The Secret Recipe</h3>
                    <p className="text-[#F5E6D3] leading-relaxed text-lg mb-4">
                      While we can't share all our family secrets, we can tell you this: every recipe has been refined over 
                      generations. Each batch is made in small quantities to ensure quality, and every sweet is tasted and 
                      approved by our master craftsmen before it reaches you.
                    </p>
                    <p className="text-[#F5E6D3] leading-relaxed text-lg">
                      The secret isn't just in the ingredients or the method - it's in the love, the patience, and the 
                      dedication that goes into every single piece. That's what makes Abhishek Sweets truly special.
                    </p>
                  </div>
                  <div>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Indian_sweets_ds.jpg/600px-Indian_sweets_ds.jpg"
                      loading="lazy" 
                      alt="Traditional sweet making" 
                      className="w-full h-auto rounded-lg shadow-2xl object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x500/6B1318/FFFDD0?text=Traditional+Sweets`;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setShowCraftsmanship(false);
                    setActiveSection('all');
                  }}
                  className="bg-[#6B1318] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#8B1A1F] transition shadow-lg"
                >
                  Taste Our Craftsmanship
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Header Banner */}
        {activeSection !== 'all' && !showOurStory && !showCraftsmanship && (
          <div className="mb-8 bg-gradient-to-r from-[#6B1318] to-[#8B1A1F] text-white p-8 rounded-xl shadow-lg">
            {activeSection === 'india' && (
              <div>
                <h2 className="text-3xl font-serif font-bold mb-3">🇮🇳 Shop India</h2>
                <p className="text-[#F5E6D3] text-lg">Discover authentic Indian sweets made with traditional recipes and premium ingredients. From classic favorites to regional specialties, experience the rich flavors of India.</p>
                <button 
                  onClick={() => setActiveSection('all')}
                  className="mt-4 text-sm underline hover:text-[#FFFDD0] transition"
                >
                  View All Sections
                </button>
              </div>
            )}
            {activeSection === 'international' && (
              <div>
                <h2 className="text-3xl font-serif font-bold mb-3">🌍 Shop International</h2>
                <p className="text-[#F5E6D3] text-lg mb-4">Coming soon in your location! We're expanding our collection to include international desserts and sweets from around the world.</p>
                <div className="mt-6 p-6 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-lg font-semibold mb-3">🌎 What's Coming:</p>
                  <ul className="space-y-2 text-[#F5E6D3] text-sm mb-4">
                    <li>• French Macarons & Éclairs</li>
                    <li>• Italian Tiramisu & Cannoli</li>
                    <li>• American Cheesecakes & Brownies</li>
                    <li>• Turkish Baklava & Lokum</li>
                    <li>• Japanese Mochi & Dorayaki</li>
                  </ul>
                  <p className="text-sm text-[#FFFDD0] mb-4">Stay tuned for exciting new additions to our international collection!</p>
                  <div className="flex gap-4 flex-wrap">
                    <button 
                      onClick={() => setActiveSection('india')}
                      className="bg-white text-[#6B1318] px-6 py-2 rounded font-bold hover:bg-[#FFFDD0] transition"
                    >
                      Shop India
                    </button>
                    <button 
                      onClick={() => setActiveSection('festive')}
                      className="bg-white/20 text-white px-6 py-2 rounded font-bold hover:bg-white/30 transition border border-white/30"
                    >
                      Festive Gifting
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveSection('all')}
                  className="mt-4 text-sm underline hover:text-[#FFFDD0] transition block"
                >
                  View All Sections
                </button>
              </div>
            )}
            {activeSection === 'festive' && (
              <div>
                <h2 className="text-3xl font-serif font-bold mb-3">🎁 Festive Gifting</h2>
                <p className="text-[#F5E6D3] text-lg">Perfect sweets for festivals and celebrations! Our premium selection includes traditional favorites like Laddus, Dry Fruit sweets, and Ghee-based delicacies - ideal for gifting during Diwali, Holi, Raksha Bandhan, and other special occasions.</p>
                <div className="mt-4 flex gap-4 flex-wrap">
                  <span className="bg-white/20 px-3 py-1 rounded text-sm">Diwali Special</span>
                  <span className="bg-white/20 px-3 py-1 rounded text-sm">Holi Collection</span>
                  <span className="bg-white/20 px-3 py-1 rounded text-sm">Wedding Gifts</span>
                  <span className="bg-white/20 px-3 py-1 rounded text-sm">Corporate Gifting</span>
                </div>
                <button 
                  onClick={() => setActiveSection('all')}
                  className="mt-4 text-sm underline hover:text-[#FFFDD0] transition"
                >
                  View All Sections
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Admin Dashboard */}
        {isAdmin && (
          <AdminPanel 
            onAdd={handleAddSweet}
            onUpdate={handleUpdateSweet}
            editingSweet={editingSweet}
            setEditingSweet={setEditingSweet}
          />
        )}

        {/* AI Assistant */}
        <AiSommelier 
          sweets={sweets} 
          onRecommendationsFound={setRecommendations} 
        />
        
        {/* Recommendation Reset */}
        {recommendations.length > 0 && (
          <div className="flex items-center justify-between bg-[#6B1318]/5 p-4 rounded-lg shadow-sm mb-6 border-l-4 border-[#6B1318]">
            <div>
              <h3 className="font-bold text-[#6B1318] font-serif">Showing AI Recommendations</h3>
              <p className="text-sm text-gray-600">Found {recommendations.length} matches for your craving.</p>
            </div>
            <button 
              onClick={() => setRecommendations([])}
              className="text-[#6B1318] hover:text-red-900 text-sm font-bold underline"
            >
              Show All Sweets
            </button>
          </div>
        )}

        {/* Improved Filters Section */}
        <div className="bg-white p-6 mb-12 shadow-md border border-[#E5DCC5] rounded-xl transition-all hover:shadow-lg">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
             
             {/* Category */}
             <div className="md:col-span-4">
               <label className="text-[10px] font-bold text-[#6B1318] uppercase tracking-widest mb-2 block">Category</label>
               <select 
                 className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-3 py-2.5 focus:border-[#6B1318] focus:ring-1 focus:ring-[#6B1318] focus:outline-none transition-colors text-sm"
                 value={filter.category}
                 onChange={(e) => setFilter({...filter, category: e.target.value})}
               >
                 <option value="" className="text-gray-900">All Categories</option>
                 {categories.map(c => <option key={c} value={c} className="text-gray-900">{c}</option>)}
               </select>
             </div>

             {/* Price Range */}
             <div className="md:col-span-4">
               <label className="text-[10px] font-bold text-[#6B1318] uppercase tracking-widest mb-2 block">Price Range (₹)</label>
               <div className="flex gap-2">
                 <input 
                   type="number" 
                   placeholder="Min"
                   className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-2 py-2.5 focus:border-[#6B1318] focus:outline-none text-sm"
                   value={filter.minPrice || ''}
                   onChange={(e) => setFilter({...filter, minPrice: Number(e.target.value)})}
                 />
                 <span className="text-gray-400 self-center">-</span>
                 <input 
                   type="number" 
                   placeholder="Max"
                   className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-2 py-2.5 focus:border-[#6B1318] focus:outline-none text-sm"
                   value={filter.maxPrice === 2000 ? '' : filter.maxPrice} // Show empty if default max
                   onChange={(e) => setFilter({...filter, maxPrice: e.target.value ? Number(e.target.value) : 2000})}
                 />
               </div>
             </div>

             {/* Sort */}
             <div className="md:col-span-4">
                <label className="text-[10px] font-bold text-[#6B1318] uppercase tracking-widest mb-2 block">Sort</label>
                <select 
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-3 py-2.5 focus:border-[#6B1318] focus:ring-1 focus:ring-[#6B1318] focus:outline-none transition-colors text-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="default" className="text-gray-900">Featured</option>
                  <option value="priceAsc" className="text-gray-900">Price: Low to High</option>
                  <option value="priceDesc" className="text-gray-900">Price: High to Low</option>
                </select>
             </div>
           </div>
           
           {/* Results Bar */}
           <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Showing {displayedSweets.length} Result{displayedSweets.length !== 1 && 's'}
              </span>
              
              <button 
                onClick={resetFilters}
                className="text-xs text-red-500 font-bold uppercase tracking-wider hover:text-red-700 hover:underline transition flex items-center gap-1"
              >
                <span>✕</span> Clear Filters
              </button>
           </div>
        </div>

        {/* Grid - Only show when not viewing Our Story or Craftsmanship */}
        {!showOurStory && !showCraftsmanship && loadingSweets ? (
          <div className="text-center py-32">
            <div className="animate-spin text-4xl mb-4 text-[#6B1318] inline-block">⏳</div>
            <p className="text-gray-500 font-serif text-lg">Preparing fresh sweets...</p>
          </div>
        ) : !showOurStory && !showCraftsmanship ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedSweets.map(sweet => {
              const rec = recommendations.find(r => r.sweetId === sweet.id);
              return (
                <SweetCard 
                  key={sweet.id} 
                  sweet={sweet}
                  onRestock={handleRestock}
                  onDelete={handleDelete}
                  onEdit={setEditingSweet}
                  isRecommended={!!rec}
                  recommendationReason={rec?.reason}
                />
              );
            })}
          </div>
        ) : null}

        {!showOurStory && !showCraftsmanship && !loadingSweets && displayedSweets.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-xl shadow-inner border border-gray-100">
            {activeSection === 'international' ? (
              <>
                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-400 text-2xl font-serif mb-4">🌍 Coming Soon in Your Location!</p>
                  <p className="text-gray-500 text-lg mb-6">We're expanding our collection to include international desserts and sweets from around the world.</p>
                  <div className="bg-gradient-to-r from-[#6B1318] to-[#8B1A1F] text-white p-6 rounded-lg mb-6">
                    <p className="font-semibold mb-3">What's Coming:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-left">
                      <div>• French Macarons</div>
                      <div>• Italian Tiramisu</div>
                      <div>• American Cheesecake</div>
                      <div>• Turkish Baklava</div>
                      <div>• Japanese Mochi</div>
                      <div>• And More!</div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button onClick={() => setActiveSection('india')} className="bg-[#6B1318] text-white px-6 py-2 rounded font-bold hover:bg-[#8B1A1F] transition">
                      Shop India
                    </button>
                    <button onClick={() => setActiveSection('festive')} className="bg-[#6B1318] text-white px-6 py-2 rounded font-bold hover:bg-[#8B1A1F] transition">
                      Festive Gifting
                    </button>
                    <button onClick={() => setActiveSection('all')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300 transition">
                      View All
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
            <p className="text-gray-400 text-lg font-serif">No sweets found matching your criteria. 🍪</p>
                <button onClick={() => { resetFilters(); setActiveSection('all'); }} className="mt-4 text-[#6B1318] font-bold underline">
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Show message when viewing Our Story or Craftsmanship */}
        {showOurStory && (
          <div className="text-center py-8">
            <button 
              onClick={() => {
                setShowOurStory(false);
                setActiveSection('all');
              }}
              className="text-[#6B1318] hover:underline font-bold"
            >
              ← Back to Shop
            </button>
          </div>
        )}
        
        {showCraftsmanship && (
          <div className="text-center py-8">
            <button 
              onClick={() => {
                setShowCraftsmanship(false);
                setActiveSection('all');
              }}
              className="text-[#6B1318] hover:underline font-bold"
            >
              ← Back to Shop
            </button>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthForm onClose={() => setShowAuthModal(false)} />
      )}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfile onClose={() => setShowProfileModal(false)} />
      )}
      
      {/* Brand Footer */}
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AbhishekSweetsApp />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;