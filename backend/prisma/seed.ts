import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

const initialSweets = [
  // Indian Sweets - Syrup Based
  { 
    name: 'Gulab Jamun', 
    category: 'Syrup Based', 
    price: 60.00, 
    quantity: 50, 
    description: 'Soft, deep-fried berry-sized balls made of milk solids and flour, soaked in rose-scented sugar syrup. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg/1280px-Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg' 
  },
  { 
    name: 'Rasgulla', 
    category: 'Syrup Based', 
    price: 55.00, 
    quantity: 40, 
    description: 'Ball-shaped dumplings of chhena (an Indian cottage cheese) and semolina dough, cooked in light syrup. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rasgulla.jpg/1280px-Rasgulla.jpg' 
  },
  { 
    name: 'Jalebi', 
    category: 'Fried', 
    price: 50.00, 
    quantity: 25, 
    description: 'Crispy, orange, spiral-shaped funnel cakes made of fermented batter, soaked in saffron syrup. (100g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jalebi_-_Jagannath_Temple.jpg/1280px-Jalebi_-_Jagannath_Temple.jpg' 
  },
  { 
    name: 'Rasmalai', 
    category: 'Dairy', 
    price: 90.00, 
    quantity: 20, 
    description: 'Flattened balls of chhana soaked in malai (clotted cream) flavoured with cardamom and saffron. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/RasMalai.jpg/1280px-RasMalai.jpg' 
  },
  { 
    name: 'Kalakand', 
    category: 'Dairy', 
    price: 220.00, 
    quantity: 12, 
    description: 'A rich milk cake made from solidified, sweetened milk and paneer. (250g)', 
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop' 
  },
  { 
    name: 'Peda', 
    category: 'Dairy', 
    price: 200.00, 
    quantity: 22, 
    description: 'Semi-soft milk fudge, traditionally from Mathura, made with khoa, sugar and cardamom. (250g)', 
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33fdf?w=800&h=600&fit=crop' 
  },
  { 
    name: 'Gajar Ka Halwa', 
    category: 'Halwa', 
    price: 120.00, 
    quantity: 20, 
    description: 'A slow-cooked traditional pudding made with grated carrots, milk, ghee, sugar, and nuts. (Serving)', 
    imageUrl: 'https://images.unsplash.com/photo-1585507252444-b3c9a1f04f1f?w=800&h=600&fit=crop' 
  },
  { 
    name: 'Soan Papdi', 
    category: 'Flaky', 
    price: 130.00, 
    quantity: 35, 
    description: 'Cube-shaped, crisp and flaky sweet made with gram flour, ghee, milk, and cardamom. (250g Box)', 
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop' 
  },
  { 
    name: 'Barfi', 
    category: 'Burfi', 
    price: 150.00, 
    quantity: 30, 
    description: 'Soft, creamy fudge-like sweet made with condensed milk, sugar, and flavored with cardamom. (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Barfi.jpg/800px-Barfi.jpg' 
  },
  { 
    name: 'Kheer', 
    category: 'Dairy', 
    price: 80.00, 
    quantity: 18, 
    description: 'Creamy rice pudding cooked with milk, sugar, cardamom, and garnished with nuts and saffron. (Serving)', 
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    name: 'Sandesh', 
    category: 'Dairy', 
    price: 180.00, 
    quantity: 25, 
    description: 'Delicate Bengali sweet made from fresh chhena, sugar, and cardamom. (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sandesh_%28Bengali_sweets%29.jpg/800px-Sandesh_%28Bengali_sweets%29.jpg' 
  },
  { 
    name: 'Rabri', 
    category: 'Dairy', 
    price: 100.00, 
    quantity: 15, 
    description: 'Thick, creamy dessert made by boiling milk on low heat, flavored with cardamom and nuts. (Serving)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Basundi.jpg/800px-Basundi.jpg' 
  },
  
  // Festive Sweets - Laddus (Popular for Diwali, Holi, etc.)
  { 
    name: 'Motichoor Laddu', 
    category: 'Laddu', 
    price: 160.00, 
    quantity: 60, 
    description: 'Soft, delicious balls made from tiny gram flour droplets, fried in ghee and soaked in sugar syrup. Perfect for Diwali! (250g Box)', 
    imageUrl: 'https://images.pexels.com/photos/1999920/pexels-photo-1999920.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    name: 'Besan Laddu', 
    category: 'Laddu', 
    price: 140.00, 
    quantity: 45, 
    description: 'Aromatic roasted gram flour balls with ghee and sugar, garnished with pistachios. Festival favorite! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Besan_Laddu.jpg/1280px-Besan_Laddu.jpg' 
  },
  { 
    name: 'Coconut Laddu', 
    category: 'Laddu', 
    price: 120.00, 
    quantity: 50, 
    description: 'Soft, melt-in-mouth coconut balls sweetened with sugar and flavored with cardamom. (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Laddu.jpg/800px-Laddu.jpg' 
  },
  { 
    name: 'Rava Laddu', 
    category: 'Laddu', 
    price: 130.00, 
    quantity: 40, 
    description: 'Traditional semolina laddus with ghee, sugar, and nuts. Perfect for festive occasions! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Laddu.jpg/800px-Laddu.jpg' 
  },
  
  // Festive Sweets - Dry Fruit (Premium gifting)
  { 
    name: 'Kaju Katli', 
    category: 'Dry Fruit', 
    price: 280.00, 
    quantity: 30, 
    description: 'Diamond-shaped traditional Indian sweet made with cashew nuts, sugar, and cardamom powder. Premium gifting! (250g Box)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kaju_katli.jpg/800px-Kaju_katli.jpg' 
  },
  { 
    name: 'Badam Katli', 
    category: 'Dry Fruit', 
    price: 300.00, 
    quantity: 25, 
    description: 'Rich almond fudge made with premium almonds, sugar, and cardamom. Perfect for special occasions! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kaju_katli.jpg/800px-Kaju_katli.jpg' 
  },
  { 
    name: 'Pista Katli', 
    category: 'Dry Fruit', 
    price: 320.00, 
    quantity: 20, 
    description: 'Delicious pistachio fudge with the finest pistachios, sugar, and aromatic cardamom. Luxury gifting! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kaju_katli.jpg/800px-Kaju_katli.jpg' 
  },
  { 
    name: 'Dry Fruit Mix', 
    category: 'Dry Fruit', 
    price: 450.00, 
    quantity: 15, 
    description: 'Premium assortment of dry fruit sweets including Kaju Katli, Badam Katli, and Pista Katli. (500g Gift Box)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kaju_katli.jpg/800px-Kaju_katli.jpg' 
  },
  
  // Festive Sweets - Ghee Based (Traditional favorites)
  { 
    name: 'Mysore Pak', 
    category: 'Ghee Based', 
    price: 180.00, 
    quantity: 15, 
    description: 'Rich, melting sweet made of generous amounts of ghee, sugar, and gram flour. Traditional favorite! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mysore_Pak.jpg/800px-Mysore_Pak.jpg' 
  },
  { 
    name: 'Ghee Mysore Pak', 
    category: 'Ghee Based', 
    price: 250.00, 
    quantity: 20, 
    description: 'Extra rich version with premium ghee, sugar, and gram flour. Melt-in-mouth texture! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mysore_Pak.jpg/800px-Mysore_Pak.jpg' 
  },
  { 
    name: 'Ghee Burfi', 
    category: 'Ghee Based', 
    price: 200.00, 
    quantity: 28, 
    description: 'Creamy burfi made with pure ghee, milk solids, and sugar. Festival special! (250g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Barfi.jpg/800px-Barfi.jpg' 
  },
  { 
    name: 'Gulab Jamun (Ghee)', 
    category: 'Ghee Based', 
    price: 80.00, 
    quantity: 35, 
    description: 'Premium gulab jamun made with pure ghee instead of oil. Extra rich and flavorful! (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg/800px-Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg' 
  },
  
  // Additional Indian Sweets
  { 
    name: 'Cham Cham', 
    category: 'Syrup Based', 
    price: 70.00, 
    quantity: 30, 
    description: 'Elongated Bengali sweet made from chhena, soaked in sugar syrup and garnished with coconut. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Cham_Cham.jpg/800px-Cham_Cham.jpg' 
  },
  { 
    name: 'Rajbhog', 
    category: 'Syrup Based', 
    price: 75.00, 
    quantity: 25, 
    description: 'Large, stuffed rasgulla with khoya and dry fruits, soaked in saffron-flavored syrup. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rasgulla.jpg/800px-Rasgulla.jpg' 
  },
  { 
    name: 'Malpua', 
    category: 'Fried', 
    price: 65.00, 
    quantity: 20, 
    description: 'Sweet pancakes made from flour, milk, and sugar, deep-fried and soaked in sugar syrup. (Plate of 2)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Malpua.jpg/800px-Malpua.jpg' 
  },
  { 
    name: 'Balushahi', 
    category: 'Fried', 
    price: 55.00, 
    quantity: 30, 
    description: 'Flaky, layered sweet pastry made from flour and ghee, soaked in sugar syrup. (100g)', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Balushahi.jpg/800px-Balushahi.jpg' 
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin user already exists
  const adminExists = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!adminExists) {
    const hashedPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@abhisheksweets.com',
        password: hashedPassword,
        role: 'admin'
      }
    })
    console.log('✅ Admin user created: admin / admin123')
  }

  // Check if sweets already exist
  const existingSweets = await prisma.sweet.findMany()
  if (existingSweets.length > 0) {
    console.log(`✅ Database already has ${existingSweets.length} sweets. Skipping sweet seed.`)
    return
  }

  // Create sweets
  for (const sweet of initialSweets) {
    await prisma.sweet.create({
      data: sweet
    })
  }

  console.log(`✅ Seeded ${initialSweets.length} sweets successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

