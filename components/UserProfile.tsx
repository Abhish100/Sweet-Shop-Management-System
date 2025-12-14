import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Order, Address } from '../types';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, logout, addAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New Address Form State
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', state: '', zip: '' });

  useEffect(() => {
    if (user?.id) {
      setLoadingOrders(true);
      api.getUserOrders(user.id)
        .then(setOrders)
        .catch(err => {
          console.warn('Orders API not available:', err);
          setOrders([]);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(newAddr);
    setShowAddAddr(false);
    setNewAddr({ label: '', street: '', city: '', state: '', zip: '' });
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FFFDD0] rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden border-t-8 border-[#6B1318]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E5DCC5] flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#6B1318]">Namaste, {user.username}</h2>
            <p className="text-sm text-gray-500">{user.email || 'Valued Customer'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#6B1318] transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5DCC5] bg-white">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'orders' ? 'border-b-4 border-[#6B1318] text-[#6B1318] bg-[#FFFDD0]/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            My Orders
          </button>
          <button 
             onClick={() => setActiveTab('addresses')}
             className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'addresses' ? 'border-b-4 border-[#6B1318] text-[#6B1318] bg-[#FFFDD0]/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Addresses
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FDFBF7]">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="text-center py-10 text-gray-500">Loading your sweets history...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl block mb-2">🤷‍♂️</span>
                  <p className="text-gray-500 font-serif">No orders yet. Time to treat yourself!</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white border border-[#E5DCC5] rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-200 pb-2">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Order #{order.id.slice(-6)}</span>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-800"><span className="font-bold text-[#6B1318]">{item.cartQuantity}x</span> {item.name}</span>
                          <span className="text-gray-600">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">
                         📍 {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </span>
                      <span className="font-bold text-[#6B1318] font-serif text-lg">Total: ₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 {user.savedAddresses?.map((addr) => (
                   <div key={addr.id} className="bg-white p-4 rounded-lg border border-[#E5DCC5] relative group">
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                       {/* Future: Add delete/edit */}
                     </div>
                     <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">{addr.label}</span>
                     <p className="font-bold text-gray-800">{addr.street}</p>
                     <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.zip}</p>
                   </div>
                 ))}
                 
                 <button 
                   onClick={() => setShowAddAddr(true)}
                   className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-[#6B1318] hover:text-[#6B1318] transition min-h-[120px]"
                 >
                   <span className="text-2xl mb-1">+</span>
                   <span className="text-xs font-bold uppercase">Add New Address</span>
                 </button>
              </div>

              {showAddAddr && (
                <form onSubmit={handleSaveAddress} className="bg-white p-4 rounded-lg border border-[#6B1318] animate-fade-in-up">
                  <h3 className="font-bold text-[#6B1318] mb-3 text-sm uppercase">New Delivery Location</h3>
                  <div className="space-y-3">
                    <input required placeholder="Label (e.g. Home, Office)" className="w-full p-2 border rounded text-sm" value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} />
                    <input required placeholder="Street Address" className="w-full p-2 border rounded text-sm" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
                    <div className="flex gap-2">
                       <input required placeholder="City" className="w-1/2 p-2 border rounded text-sm" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                       <input required placeholder="State" className="w-1/2 p-2 border rounded text-sm" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} />
                    </div>
                    <input required placeholder="ZIP / Pincode" className="w-full p-2 border rounded text-sm" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} />
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddAddr(false)} className="flex-1 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded">Cancel</button>
                      <button type="submit" className="flex-1 py-2 text-sm bg-[#6B1318] text-white rounded font-bold hover:bg-[#500e12]">Save Address</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E5DCC5]">
          <button 
            onClick={handleLogout} 
            className="w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold uppercase text-xs tracking-widest transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;