import React, { useState } from 'react';
import { Sweet } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface AdminPanelProps {
  onAdd: (sweet: Omit<Sweet, 'id'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Sweet>) => Promise<void>;
  editingSweet: Sweet | null;
  setEditingSweet: (s: Sweet | null) => void;
  sweets?: Sweet[];
  onRefresh?: () => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAdd, onUpdate, editingSweet, setEditingSweet, sweets = [], onRefresh }) => {
  const { logout } = useAuth();
  const initialState = {
    name: '',
    category: 'Syrup Based',
    price: '',
    quantity: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800'
  };

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Sync form data when editingSweet changes
  React.useEffect(() => {
    if (editingSweet) {
      setFormData({
        name: editingSweet.name,
        category: editingSweet.category,
        price: editingSweet.price.toString(),
        quantity: editingSweet.quantity.toString(),
        description: editingSweet.description,
        imageUrl: editingSweet.imageUrl
      });
      setImagePreview(editingSweet.imageUrl);
      setImageFile(null);
    } else {
      setFormData(initialState);
      setImagePreview('');
      setImageFile(null);
    }
  }, [editingSweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingSweet) {
        // First update image if new file selected
        if (imageFile) {
          setUploading(true);
          const formDataForUpload = new FormData();
          formDataForUpload.append('file', imageFile);
          // Using the imageUrl from preview which is base64 encoded
          sweetData.imageUrl = imagePreview;
        }
        
        await onUpdate(editingSweet.id, sweetData);
        setEditingSweet(null);
      } else {
        await onAdd(sweetData);
      }
      setFormData(initialState);
      setImageFile(null);
      setImagePreview('');
      if (onRefresh) await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving sweet');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setFormData({ ...formData, imageUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600 mb-8">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
         <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           <span className="text-red-600 text-2xl">⚙️</span>
           {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
         </h2>
         <div className="flex gap-2">
           {editingSweet && (
             <button onClick={() => setEditingSweet(null)} className="text-sm text-red-500 hover:text-red-700 font-medium">Cancel Edit</button>
           )}
           <button 
             onClick={logout}
             className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition"
           >
             Logout
           </button>
         </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Name</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
          <select
             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
             value={formData.category}
             onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Syrup Based">Syrup Based</option>
            <option value="Dry Fruit">Dry Fruit</option>
            <option value="Dairy">Dairy</option>
            <option value="Laddu">Laddu</option>
            <option value="Fried">Fried</option>
            <option value="Ghee Based">Ghee Based</option>
            <option value="Halwa">Halwa</option>
            <option value="Burfi">Burfi</option>
            <option value="Flaky">Flaky</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Initial Quantity</label>
          <input
            type="number"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Product Image</label>
            <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 text-sm mb-2"
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Enter Image URL or Upload"
                    />
                    <div className="relative inline-block">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded border border-gray-300 text-xs font-bold flex items-center gap-2 transition">
                           <span>📂</span> Upload from Device
                        </button>
                    </div>
                </div>
                
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                    )}
                </div>
            </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
          <textarea
            required
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        
        <div className="md:col-span-2 mt-2">
           <button 
             type="submit" 
             disabled={uploading}
             className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <span>{uploading ? 'Uploading...' : (editingSweet ? 'Update Inventory' : 'Add to Inventory')}</span>
             {!uploading && <span>&rarr;</span>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;