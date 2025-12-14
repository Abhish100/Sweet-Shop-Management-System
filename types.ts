export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  token: string;
  savedAddresses?: Address[];
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface CartItem extends Sweet {
  cartQuantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Delivered';
  createdAt: string;
  deliveryAddress: Address;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type SweetFilter = {
  category: string;
  minPrice: number;
  maxPrice: number;
};