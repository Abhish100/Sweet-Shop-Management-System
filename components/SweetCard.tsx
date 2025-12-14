import React, { useState, useEffect } from 'react';
import { Sweet, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getSweetImage } from '../services/geminiImageService';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (id: string) => Promise<void>; // Deprecated but kept for interface compatibility if needed
  onRestock?: (id: string, amount: number) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (sweet: Sweet) => void;
  isRecommended?: boolean;
  recommendationReason?: string;
}

const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onRestock, 
  onDelete, 
  onEdit,
  isRecommended,
  recommendationReason
}) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  
  // Image handling state
  const [imgSrc, setImgSrc] = useState<string>(sweet.imageUrl || '');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = sweet.quantity === 0;

  // Load or generate image when component mounts or sweet changes
  useEffect(() => {
    const loadImage = async () => {
      // If sweet has an imageUrl, use it directly
      if (sweet.imageUrl && sweet.imageUrl.trim() !== '') {
        setImgSrc(sweet.imageUrl);
        setImageError(false);
        setIsLoadingImage(false);
        return;
      }

      // If no imageUrl, try to generate using Gemini
      setIsLoadingImage(true);
      try {
        const generatedImage = await getSweetImage(sweet);
        setImgSrc(generatedImage);
        setImageError(false);
      } catch (error) {
        console.error(`Failed to generate image for ${sweet.name}:`, error);
        // Fallback to placeholder
        setImgSrc(`https://placehold.co/600x400/6B1318/FFFDD0?text=${encodeURIComponent(sweet.name)}`);
        setImageError(true);
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadImage();
  }, [sweet.id, sweet.name, sweet.imageUrl]);

  const handleAddToCart = () => {
    addToCart(sweet);
  };

  const handleImageError = async () => {
    if (imageError) return; // Already tried fallback
    
    console.log(`Image load error for ${sweet.name}, trying Gemini generation...`);
    setImageError(true);
    setIsLoadingImage(true);
    
    try {
      const generatedImage = await getSweetImage(sweet);
      setImgSrc(generatedImage);
    } catch (error) {
      console.error(`Failed to generate image:`, error);
      // Final fallback to placeholder
      setImgSrc(`https://placehold.co/600x400/6B1318/FFFDD0?text=${encodeURIComponent(sweet.name)}`);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-red-200 ${isRecommended ? 'ring-2 ring-red-500 transform -translate-y-1' : ''}`}>
      {isRecommended && (
        <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 text-center uppercase tracking-widest">
          Recommended
        </div>
      )}
      <div className="relative h-48 overflow-hidden bg-gray-100 group">
         {isLoadingImage && (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
             <div className="text-center">
               <div className="animate-spin text-2xl mb-2 text-red-600 inline-block">⏳</div>
               <p className="text-xs text-gray-500">Generating image...</p>
             </div>
           </div>
         )}
         {imgSrc ? (
           <img 
              key={imgSrc} // Crucial: Force re-mount on src change
              src={imgSrc} 
              alt={sweet.name} 
              onError={handleImageError}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''} ${isLoadingImage ? 'opacity-0' : 'opacity-100'}`}
              style={{ display: isLoadingImage ? 'none' : 'block' }}
           />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
             <span className="text-white text-2xl font-bold">{sweet.name}</span>
           </div>
         )}
         {isOutOfStock && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
             <span className="bg-red-600 text-white px-4 py-2 rounded shadow-lg text-sm font-bold uppercase tracking-widest border-2 border-white">Sold Out</span>
           </div>
         )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{sweet.name}</h3>
            <span className="text-[10px] uppercase tracking-wider text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded mt-1 inline-block border border-red-100">{sweet.category}</span>
          </div>
          <span className="font-bold text-red-700 text-xl font-serif">₹{sweet.price.toFixed(2)}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-1 mt-2 line-clamp-2">{sweet.description}</p>
        
        {isRecommended && recommendationReason && (
          <div className="mb-4 p-3 bg-red-50 rounded text-center border border-red-100">
             <p className="text-xs text-red-800 italic">"{recommendationReason}"</p>
          </div>
        )}

        <div className="text-sm text-gray-500 mb-4 flex justify-between items-center border-t border-gray-100 pt-2">
          <span>Availability:</span>
          <span className={`font-bold ${sweet.quantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Unavailable'}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {isOutOfStock ? (
            <div className="w-full py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider bg-gray-100 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2 border-2 border-gray-300">
              <span>🔴</span>
              <span>Sold Out</span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:scale-95"
            >
              <span>🛒</span>
              <span>Add to Cart</span>
            </button>
          )}

          {isAdmin && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
               <button onClick={() => onRestock && onRestock(sweet.id, 10)} className="flex-1 bg-green-50 text-green-700 text-xs py-1.5 rounded hover:bg-green-100 border border-green-200 font-medium">
                 +10
               </button>
               <button onClick={() => onEdit && onEdit(sweet)} className="flex-1 bg-blue-50 text-blue-700 text-xs py-1.5 rounded hover:bg-blue-100 border border-blue-200 font-medium">
                 Edit
               </button>
               <button onClick={() => onDelete && onDelete(sweet.id)} className="flex-1 bg-red-50 text-red-700 text-xs py-1.5 rounded hover:bg-red-100 border border-red-200 font-medium">
                 Del
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;