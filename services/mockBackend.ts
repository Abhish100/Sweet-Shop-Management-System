import { Sweet, User, UserRole, AuthResponse, Order, CartItem, Address } from '../types';

// Initial Data for the "Database"
// Using verified Wikimedia Commons images to ensure 100% accuracy for specific Indian sweets.
const INITIAL_SWEETS: Sweet[] = [
  { 
    id: '1', 
    name: 'Gulab Jamun', 
    category: 'Syrup Based', 
    price: 60.00, 
    quantity: 50, 
    description: 'Soft, deep-fried berry-sized balls made of milk solids and flour, soaked in rose-scented sugar syrup. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Gulab_jamun_%28Gibraltar%29.jpg/640px-Gulab_jamun_%28Gibraltar%29.jpg' 
  },
  { 
    id: '2', 
    name: 'Kaju Katli', 
    category: 'Dry Fruit', 
    price: 280.00, 
    quantity: 30, 
    description: 'Diamond-shaped traditional Indian sweet made with cashew nuts, sugar, and cardamom powder. (250g Box)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kaju_Katli_01.jpg/640px-Kaju_Katli_01.jpg' 
  },
  { 
    id: '3', 
    name: 'Rasmalai', 
    category: 'Dairy', 
    price: 90.00, 
    quantity: 20, 
    description: 'Flattened balls of chhana soaked in malai (clotted cream) flavoured with cardamom and saffron. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Ras_Malai_-_Wang_Kei.jpg/640px-Ras_Malai_-_Wang_Kei.jpg' 
  },
  { 
    id: '4', 
    name: 'Motichoor Laddu', 
    category: 'Laddu', 
    price: 160.00, 
    quantity: 60, 
    description: 'Soft, delicious balls made from tiny gram flour droplets, fried in ghee and soaked in sugar syrup. (250g Box)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Motichoor_Ladoo.jpg/640px-Motichoor_Ladoo.jpg' 
  },
  { 
    id: '5', 
    name: 'Jalebi', 
    category: 'Fried', 
    price: 50.00, 
    quantity: 25, 
    description: 'Crispy, orange, spiral-shaped funnel cakes made of fermented batter, soaked in saffron syrup. (100g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Jalebi_1.jpg/640px-Jalebi_1.jpg' 
  },
  { 
    id: '6', 
    name: 'Mysore Pak', 
    category: 'Ghee Based', 
    price: 180.00, 
    quantity: 15, 
    description: 'Rich, melting sweet made of generous amounts of ghee, sugar, and gram flour. (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mysore_Pak_%28cropped%29.jpg/640px-Mysore_Pak_%28cropped%29.jpg' 
  },
  { 
    id: '7', 
    name: 'Gajar Ka Halwa', 
    category: 'Halwa', 
    price: 120.00, 
    quantity: 20, 
    description: 'A slow-cooked traditional pudding made with grated carrots, milk, ghee, sugar, and nuts. (Serving)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Gajar_ka_halwa_with_dry_fruits.jpg/640px-Gajar_ka_halwa_with_dry_fruits.jpg' 
  },
  { 
    id: '8', 
    name: 'Soan Papdi', 
    category: 'Flaky', 
    price: 130.00, 
    quantity: 35, 
    description: 'Cube-shaped, crisp and flaky sweet made with gram flour, ghee, milk, and cardamom. (250g Box)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Soan_Papdi_Root.jpg/640px-Soan_Papdi_Root.jpg' 
  },
  { 
    id: '9', 
    name: 'Rasgulla', 
    category: 'Syrup Based', 
    price: 55.00, 
    quantity: 40, 
    description: 'Ball-shaped dumplings of chhena (an Indian cottage cheese) and semolina dough, cooked in light syrup.', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Rasgulla_1.jpg/640px-Rasgulla_1.jpg' 
  },
  { 
    id: '10', 
    name: 'Besan Laddu', 
    category: 'Laddu', 
    price: 140.00, 
    quantity: 45, 
    description: 'Aromatic roasted gram flour balls with ghee and sugar, garnished with pistachios.', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Besan_Ladoo_01.jpg/640px-Besan_Ladoo_01.jpg' 
  },
  { 
    id: '11', 
    name: 'Kalakand', 
    category: 'Dairy', 
    price: 220.00, 
    quantity: 12, 
    description: 'A rich milk cake made from solidified, sweetened milk and paneer.', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kalakand.jpg/640px-Kalakand.jpg' 
  },
  { 
    id: '12', 
    name: 'Peda', 
    category: 'Dairy', 
    price: 200.00, 
    quantity: 22, 
    description: 'Semi-soft milk fudge, traditionally from Mathura, made with khoa, sugar and cardamom.', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dharwad_Pedha.jpg/640px-Dharwad_Pedha.jpg' 
  }
];

const STORAGE_KEYS = {
  SWEETS: 'sugarrush_sweets_v2',
  USERS_DB: 'sugarrush_users_db',
  PENDING_USERS: 'sugarrush_pending_regs', // For OTP flow
  CURRENT_USER: 'sugarrush_current_user',
  ORDERS: 'sugarrush_orders',
};

// Internal type for stored user with password
interface StoredUser extends User {
  password: string; 
}

interface PendingRegistration {
  username: string;
  email: string;
  password: string;
  otp: string;
  createdAt: number;
}

// --- Helper Functions ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredSweets = (): Sweet[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SWEETS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(INITIAL_SWEETS));
    return INITIAL_SWEETS;
  }
  return JSON.parse(stored);
};

const saveSweets = (sweets: Sweet[]) => {
  localStorage.setItem(STORAGE_KEYS.SWEETS, JSON.stringify(sweets));
};

const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  return stored ? JSON.parse(stored) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
};

const getPendingRegistrations = (): Record<string, PendingRegistration> => {
  const stored = localStorage.getItem(STORAGE_KEYS.PENDING_USERS);
  return stored ? JSON.parse(stored) : {};
};

const savePendingRegistration = (email: string, data: PendingRegistration) => {
  const pending = getPendingRegistrations();
  pending[email] = data;
  localStorage.setItem(STORAGE_KEYS.PENDING_USERS, JSON.stringify(pending));
};

const removePendingRegistration = (email: string) => {
  const pending = getPendingRegistrations();
  delete pending[email];
  localStorage.setItem(STORAGE_KEYS.PENDING_USERS, JSON.stringify(pending));
};

const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return stored ? JSON.parse(stored) : [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

// --- API Methods ---

export const api = {
  // --- Auth ---
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    await delay(500); 
    
    // 1. Check Hardcoded Admin
    if (identifier === 'admin' && password === 'admin123') {
      const user: User = { 
        id: 'admin-1', 
        username: 'admin', 
        role: UserRole.ADMIN, 
        token: 'mock-jwt-admin',
        savedAddresses: []
      };
      
      // OPTIONAL: Ensure admin exists in DB so adding addresses works
      const users = getStoredUsers();
      if (!users.find(u => u.id === 'admin-1')) {
         const adminUser: StoredUser = {
           id: 'admin-1',
           username: 'admin',
           email: 'admin@abhisheksweets.in',
           password: 'admin123',
           role: UserRole.ADMIN,
           token: 'mock-jwt-admin',
           savedAddresses: []
        };
        users.push(adminUser);
        saveStoredUsers(users);
      } else {
        // If admin exists, sync savedAddresses to current session
        const existingAdmin = users.find(u => u.id === 'admin-1');
        if (existingAdmin) user.savedAddresses = existingAdmin.savedAddresses;
      }

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { user, token: user.token };
    }

    // 2. Check Registered Users
    const users = getStoredUsers();
    const foundUser = users.find(u => 
      (u.username === identifier || u.email === identifier) && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      const user = { ...userWithoutPassword, token: `mock-jwt-${userWithoutPassword.id}` };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { user, token: user.token };
    }

    throw new Error('Invalid credentials');
  },

  // Step 1: Request OTP
  initiateRegister: async (username: string, email: string, password: string): Promise<{ message: string; otp: string }> => {
    await delay(500);
    
    const users = getStoredUsers();
    
    if (users.some(u => u.username === username)) throw new Error('Username already exists');
    if (users.some(u => u.email === email)) throw new Error('Email already exists');

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store temporarily
    savePendingRegistration(email, {
      username,
      email,
      password,
      otp,
      createdAt: Date.now()
    });

    console.log(`[MOCK EMAIL SERVICE] OTP for ${email}: ${otp}`);
    return { message: "OTP Sent to " + email, otp }; // Return OTP for demo convenience
  },

  // Step 2: Verify OTP
  verifyRegister: async (email: string, otp: string): Promise<AuthResponse> => {
    await delay(600);
    
    const pending = getPendingRegistrations();
    const record = pending[email];

    if (!record) throw new Error("No pending registration found for this email.");
    if (record.otp !== otp) throw new Error("Invalid OTP. Please try again.");

    // Expire after 10 mins
    if (Date.now() - record.createdAt > 10 * 60 * 1000) {
      removePendingRegistration(email);
      throw new Error("OTP expired. Please register again.");
    }

    // Success - Create Real User
    const users = getStoredUsers();
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      username: record.username,
      email: record.email,
      password: record.password, 
      role: UserRole.USER,
      token: `mock-jwt-${Date.now()}`,
      savedAddresses: []
    };

    users.push(newUser);
    saveStoredUsers(users);
    
    // Clean up pending
    removePendingRegistration(email);

    // Auto Login
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return { user: userWithoutPassword, token: newUser.token };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  addUserAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<User> => {
    await delay(300);
    const users = getStoredUsers();
    let userIndex = users.findIndex(u => u.id === userId);
    
    // Special handling for hardcoded Admin who might not be in the DB array if storage was cleared
    if (userIndex === -1 && userId === 'admin-1') {
       const adminUser: StoredUser = {
           id: 'admin-1',
           username: 'admin',
           email: 'admin@abhisheksweets.in',
           password: 'admin123',
           role: UserRole.ADMIN,
           token: 'mock-jwt-admin',
           savedAddresses: []
        };
        users.push(adminUser);
        userIndex = users.length - 1;
    }

    if (userIndex === -1) throw new Error('User not found');
    
    const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
    const user = users[userIndex];
    
    if (!user.savedAddresses) user.savedAddresses = [];
    user.savedAddresses.push(newAddress);
    
    users[userIndex] = user;
    saveStoredUsers(users);
    
    // Update session if it's the current user
    const { password, ...safeUser } = user;
    const currentUser = api.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    }

    return safeUser;
  },

  // --- Sweets ---
  getSweets: async (): Promise<Sweet[]> => {
    await delay(300);
    return getStoredSweets();
  },

  addSweet: async (sweet: Omit<Sweet, 'id'>): Promise<Sweet> => {
    await delay(400);
    const sweets = getStoredSweets();
    const newSweet: Sweet = { ...sweet, id: Date.now().toString() };
    saveSweets([...sweets, newSweet]);
    return newSweet;
  },

  updateSweet: async (id: string, updates: Partial<Sweet>): Promise<Sweet> => {
    await delay(300);
    const sweets = getStoredSweets();
    const index = sweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    
    const updatedSweet = { ...sweets[index], ...updates };
    sweets[index] = updatedSweet;
    saveSweets(sweets);
    return updatedSweet;
  },

  deleteSweet: async (id: string): Promise<void> => {
    await delay(300);
    const sweets = getStoredSweets();
    saveSweets(sweets.filter(s => s.id !== id));
  },

  restockSweet: async (id: string, amount: number): Promise<Sweet> => {
    await delay(300);
    const sweets = getStoredSweets();
    const index = sweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    sweets[index].quantity += amount;
    saveSweets(sweets);
    return sweets[index];
  },

  // --- Orders & Inventory Transaction ---
  createOrder: async (userId: string, cartItems: CartItem[], address: Address): Promise<Order> => {
    await delay(800); // Simulate processing time
    const sweets = getStoredSweets();
    
    // 1. Validate Stock
    for (const item of cartItems) {
      const stockItem = sweets.find(s => s.id === item.id);
      if (!stockItem) throw new Error(`Item ${item.name} no longer exists.`);
      if (stockItem.quantity < item.cartQuantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${stockItem.quantity}`);
      }
    }

    // 2. Deduct Stock
    for (const item of cartItems) {
      const index = sweets.findIndex(s => s.id === item.id);
      sweets[index].quantity -= item.cartQuantity;
    }
    saveSweets(sweets);

    // 3. Create Order
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId,
      items: cartItems,
      totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0),
      status: 'Processing', // Default status
      createdAt: new Date().toISOString(),
      deliveryAddress: address
    };

    const orders = getStoredOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return newOrder;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    await delay(400);
    const orders = getStoredOrders();
    // Sort by date desc
    return orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};