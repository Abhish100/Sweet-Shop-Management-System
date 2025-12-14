import React, { useState } from 'react';
import { getSweetRecommendations } from '../services/geminiService';
import { Sweet } from '../types';

interface AiSommelierProps {
  sweets: Sweet[];
  onRecommendationsFound: (recs: { sweetId: string; reason: string }[]) => void;
}

const AiSommelier: React.FC<AiSommelierProps> = ({ sweets, onRecommendationsFound }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await getSweetRecommendations(sweets, prompt);
      onRecommendationsFound(result.recommendations);
      setPrompt('');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("AI is taking a nap. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl shadow-md border border-red-700 flex items-center justify-between hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl bg-white/20 p-2 rounded-lg">🤖</span>
            <div className="text-left">
              <h3 className="font-bold text-lg">Ask the Sweet Expert</h3>
              <p className="text-sm text-red-100 group-hover:text-white">Get AI-powered recommendations based on your mood</p>
            </div>
          </div>
          <span className="bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm shadow">Start Chat &rarr;</span>
        </button>
      ) : (
        <div className="bg-white border-2 border-red-500 rounded-xl p-6 shadow-xl animate-fade-in relative">
           <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
             <h3 className="font-bold text-red-700 flex items-center gap-2 text-lg">
               <span>🤖</span> Sweet Recommendation Engine
             </h3>
             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
           </div>
           
           <form onSubmit={handleAskAi}>
             <label className="block text-sm text-gray-600 mb-2">Tell us who is this for or what you are craving:</label>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="e.g., 'I need a gift for my grandma who loves nuts' or 'Something spicy and sweet'"
               className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] text-gray-800 placeholder-gray-400 bg-gray-50"
             />
             <div className="mt-4 flex justify-end">
               <button 
                 type="submit" 
                 disabled={loading || !prompt.trim()}
                 className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-transform active:scale-95"
               >
                 {loading ? (
                   <>Processing... <span className="animate-pulse">🍬</span></>
                 ) : (
                   'Find Sweets'
                 )}
               </button>
             </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AiSommelier;