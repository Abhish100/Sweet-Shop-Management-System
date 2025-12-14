import { Sweet, User, UserRole, AuthResponse, Order, CartItem, Address } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<{ token: string; user: { id: string; username: string; email: string; role: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      }
    );

    // Store token
    localStorage.setItem('auth_token', response.token);

    // Convert backend user format to frontend User format
    const user: User = {
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role as UserRole,
      token: response.token,
      savedAddresses: [], // Will be loaded separately if needed
    };

    return { user, token: response.token };
  },

  initiateRegister: async (username: string, email: string, password: string): Promise<{ message: string; otp: string }> => {
    return apiRequest<{ message: string; otp: string }>(
      '/auth/register/initiate',
      {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }
    );
  },

  verifyOtp: async (email: string, otp: string, username: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<{ token: string; user: { id: string; username: string; email: string; role: string } }>(
      '/auth/register/verify',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp, username, password }),
      }
    );

    // Store token
    localStorage.setItem('auth_token', response.token);

    // Convert backend user format to frontend User format
    const user: User = {
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role as UserRole,
      token: response.token,
      savedAddresses: [],
    };

    return { user, token: response.token };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    // In a real app, you might want to decode the JWT or make an API call
    // For now, we'll return null and let the app fetch user data when needed
    return null;
  },
};

// Sweets API
export const sweetsApi = {
  getSweets: async (): Promise<Sweet[]> => {
    const sweets = await apiRequest<any[]>('/sweets');
    // Transform backend format to frontend format (add defaults for missing fields)
    return sweets.map(sweet => ({
      ...sweet,
      description: sweet.description || '',
      imageUrl: sweet.imageUrl || '',
    }));
  },

  addSweet: async (sweet: Omit<Sweet, 'id'>): Promise<Sweet> => {
    const result = await apiRequest<any>('/sweets', {
      method: 'POST',
      body: JSON.stringify(sweet),
    });
    return {
      ...result,
      description: result.description || '',
      imageUrl: result.imageUrl || '',
    };
  },

  updateSweet: async (id: string, updates: Partial<Sweet>): Promise<Sweet> => {
    const result = await apiRequest<any>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return {
      ...result,
      description: result.description || '',
      imageUrl: result.imageUrl || '',
    };
  },

  deleteSweet: async (id: string): Promise<void> => {
    return apiRequest<void>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  },

  restockSweet: async (id: string, amount: number): Promise<Sweet> => {
    const result = await apiRequest<any>(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return {
      ...result,
      description: result.description || '',
      imageUrl: result.imageUrl || '',
    };
  },
};

// Combined API object (for backward compatibility with existing code)
export const api = {
  ...authApi,
  ...sweetsApi,
  
  // Additional methods that might be needed
  addUserAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<User> => {
    // This would need a backend endpoint - for now, we'll store in localStorage
    // In production, implement a proper backend endpoint
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');
    
    // For now, return a mock response
    // TODO: Implement proper backend endpoint for addresses
    throw new Error('Address management not yet implemented in backend');
  },

  createOrder: async (userId: string, cartItems: CartItem[], address: Address): Promise<Order> => {
    const response = await apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cartItems,
        deliveryAddress: address,
      }),
    });
    return response;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const orders = await apiRequest<Order[]>('/orders');
    return orders;
  },
};

