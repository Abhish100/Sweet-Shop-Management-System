import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Address } from '../types';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal, checkout, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  
  // Checkout Steps: 'cart' -> 'address' -> 'payment' -> 'processing'
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'processing'>('cart');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [showNotLiveModal, setShowNotLiveModal] = useState(false);
  
  // Inline Address Form State
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', street: '', city: '', state: '', zip: '' });

  const resetState = () => {
    setStep('cart');
    setIsAddingAddr(false);
    setShowNotLiveModal(false);
  };

  const handleClose = () => {
    toggleCart();
    // Delay reset to avoid UI flicker while closing
    setTimeout(resetState, 300);
  };

  const proceedToAddress = () => {
    if (!user) {
      alert("Please log in to continue.");
      return;
    }
    setStep('address');
    // Pre-select first address if available
    if (user.savedAddresses && user.savedAddresses.length > 0) {
      setSelectedAddressId(user.savedAddresses[0].id);
    } else {
      setIsAddingAddr(true); // Force add address if none exist
    }
  };

  const proceedToPayment = () => {
    if (!selectedAddressId && !isAddingAddr) {
      alert("Please select a delivery address.");
      return;
    }
    setStep('payment');
  };

  const handleSaveAndSelectAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addAddress(newAddr);
    setIsAddingAddr(false);
    // Optimistically assuming the new address is added to the end or we just let user pick from refreshed list
    // In a real app, we'd get the ID back. For now, user sees it in list and selects it.
  };

  // Triggered when "Place Order" is clicked
  const handlePlaceOrderClick = () => {
    setShowNotLiveModal(true);
  };

  // Option 1: User clicks "OK" -> Returns to Home (Closes Drawer)
  const handleNotLiveOk = () => {
    setShowNotLiveModal(false);
    handleClose();
  };

  // Option 2: User clicks "Simulate Success" -> Actually creates mock order
  const handleSimulateOrder = async () => {
    setShowNotLiveModal(false);
    
    const addressToUse = user?.savedAddresses?.find(a => a.id === selectedAddressId);
    if (!addressToUse) return;

    setStep('processing');
    try {
      await checkout(addressToUse);
      // Checkout in context usually closes drawer, but we want to show success state or just close
      setTimeout(handleClose, 500);
    } catch (e: any) {
      alert(e.message);
      setStep('payment');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-[#FFFDD0] shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col border-l-4 border-[#6B1318] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 bg-[#6B1318] text-[#F5E6D3] flex justify-between items-center shadow-md">
          <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
            {step === 'cart' && '🛒 Your Cart'}
            {step === 'address' && '📍 Delivery Details'}
            {step === 'payment' && '💳 Payment Method'}
            {step === 'processing' && '✨ Processing'}
          </h2>
          <button onClick={handleClose} className="text-[#F5E6D3] hover:text-white transition text-2xl leading-none">&times;</button>
        </div>

        {/* --- STEP 1: CART ITEMS --- */}
        {step === 'cart' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <span className="text-6xl opacity-20">🥡</span>
                <p className="font-serif text-xl">Your cart is empty.</p>
                <button onClick={handleClose} className="text-[#6B1318] underline font-bold text-sm hover:text-red-800">Start Shopping</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-[#E5DCC5]">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md border border-gray-100" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 font-serif">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    <p className="text-[#6B1318] font-bold text-sm">₹{item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 rounded bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition">-</button>
                        <span className="px-3 font-bold text-sm text-gray-800">{item.cartQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition">+</button>
                      </div>
                      <span className="text-sm font-semibold text-gray-500">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- STEP 2: ADDRESS SELECTION --- */}
        {step === 'address' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!isAddingAddr && user?.savedAddresses?.map(addr => (
              <label key={addr.id} className={`block p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddressId === addr.id ? 'border-[#6B1318] bg-red-50' : 'border-gray-200 hover:border-red-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    name="address" 
                    checked={selectedAddressId === addr.id} 
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 text-[#6B1318] focus:ring-[#6B1318]"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{addr.label}</span>
                    <p className="font-bold text-gray-800 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.zip}</p>
                  </div>
                </div>
              </label>
            ))}

            {!isAddingAddr && (
               <button 
                 onClick={() => setIsAddingAddr(true)}
                 className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-[#6B1318] hover:text-[#6B1318] transition"
               >
                 + Add New Address
               </button>
            )}

            {isAddingAddr && (
              <form onSubmit={handleSaveAndSelectAddress} className="bg-white p-4 rounded-lg shadow-inner border border-gray-200">
                <h3 className="font-bold text-[#6B1318] mb-3">Add New Address</h3>
                <div className="space-y-3">
                   <input required placeholder="Label (e.g. Home)" className="w-full p-2 border rounded text-sm text-gray-900" value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} />
                   <input required placeholder="Street" className="w-full p-2 border rounded text-sm text-gray-900" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
                   <div className="flex gap-2">
                     <input required placeholder="City" className="w-1/2 p-2 border rounded text-sm text-gray-900" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                     <input required placeholder="Zip" className="w-1/2 p-2 border rounded text-sm text-gray-900" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} />
                   </div>
                   <input required placeholder="State" className="w-full p-2 border rounded text-sm text-gray-900" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} />
                   <div className="flex gap-2 pt-2">
                     <button type="button" onClick={() => setIsAddingAddr(false)} className="flex-1 py-2 text-sm bg-gray-200 rounded text-gray-700">Cancel</button>
                     <button type="submit" className="flex-1 py-2 text-sm bg-[#6B1318] text-white rounded font-bold">Save</button>
                   </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- STEP 3: PAYMENT METHOD --- */}
        {step === 'payment' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-gray-700 font-bold mb-2">Select Payment Method</h3>
            
            {/* UPI */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${paymentMethod === 'upi' ? 'border-[#6B1318] bg-red-50' : 'border-gray-200 bg-white'}`}>
               <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#6B1318] focus:ring-[#6B1318]" />
               <div className="flex-1">
                 <span className="font-bold text-gray-800 block">UPI (GPay / PhonePe / Paytm)</span>
                 <span className="text-xs text-gray-500">Pay securely using your UPI ID</span>
               </div>
               <span className="text-2xl">📱</span>
            </label>

            {/* Card */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${paymentMethod === 'card' ? 'border-[#6B1318] bg-red-50' : 'border-gray-200 bg-white'}`}>
               <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#6B1318] focus:ring-[#6B1318]" />
               <div className="flex-1">
                 <span className="font-bold text-gray-800 block">Credit / Debit Card</span>
                 <span className="text-xs text-gray-500">Visa, Mastercard, RuPay</span>
               </div>
               <span className="text-2xl">💳</span>
            </label>

            {/* Net Banking */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${paymentMethod === 'netbanking' ? 'border-[#6B1318] bg-red-50' : 'border-gray-200 bg-white'}`}>
               <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#6B1318] focus:ring-[#6B1318]" />
               <div className="flex-1">
                 <span className="font-bold text-gray-800 block">Net Banking</span>
                 <span className="text-xs text-gray-500">All major banks supported</span>
               </div>
               <span className="text-2xl">🏦</span>
            </label>

            {/* COD */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-[#6B1318] bg-red-50' : 'border-gray-200 bg-white'}`}>
               <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#6B1318] focus:ring-[#6B1318]" />
               <div className="flex-1">
                 <span className="font-bold text-gray-800 block">Cash on Delivery</span>
                 <span className="text-xs text-gray-500">Pay when you receive</span>
               </div>
               <span className="text-2xl">💵</span>
            </label>
          </div>
        )}

        {/* --- STEP 4: PROCESSING --- */}
        {step === 'processing' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
             <div className="text-6xl animate-bounce">🍬</div>
             <h3 className="text-xl font-bold font-serif text-[#6B1318]">Confirming your order...</h3>
             <p className="text-gray-500">Getting the sweets ready for you.</p>
           </div>
        )}

        {/* Footer Actions */}
        {cart.length > 0 && step !== 'processing' && (
          <div className="p-6 bg-white border-t border-[#E5DCC5] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-gray-800">
              <span className="font-bold uppercase tracking-wider text-sm">Total</span>
              <span className="font-bold text-2xl font-serif text-[#6B1318]">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            {!user && (
              <p className="text-xs text-red-500 mb-3 text-center bg-red-50 p-2 rounded">
                Please log in to checkout.
              </p>
            )}

            {step === 'cart' && (
              <button 
                onClick={proceedToAddress}
                disabled={!user}
                className="w-full bg-[#6B1318] text-[#F5E6D3] py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#500e12] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Checkout &rarr;
              </button>
            )}

            {step === 'address' && (
               <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('cart')}
                    className="px-4 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={proceedToPayment}
                    disabled={isAddingAddr || (!selectedAddressId && !isAddingAddr)}
                    className="flex-1 bg-[#6B1318] text-[#F5E6D3] py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#500e12] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Payment
                  </button>
               </div>
            )}

            {step === 'payment' && (
               <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('address')}
                    className="px-4 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrderClick}
                    className="flex-1 bg-[#6B1318] text-[#F5E6D3] py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#500e12] transition shadow-lg"
                  >
                    Place Order
                  </button>
               </div>
            )}
          </div>
        )}
      </div>

      {/* --- NOT LIVE MODAL --- */}
      {showNotLiveModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center border-t-8 border-yellow-500">
             <div className="text-5xl mb-4">🚧</div>
             <h3 className="text-2xl font-bold text-gray-800 mb-2 font-serif">We aren't live yet!</h3>
             <p className="text-gray-600 mb-6">
               This is a demonstration of the Abhishek Sweets application. Actual payments are disabled.
             </p>
             
             <div className="flex flex-col gap-3">
               <button 
                 onClick={handleNotLiveOk}
                 className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-black transition"
               >
                 OK
               </button>
               
               <button 
                 onClick={handleSimulateOrder}
                 className="w-full text-sm text-gray-500 underline hover:text-gray-800"
               >
                 Simulate Successful Order (Demo)
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;