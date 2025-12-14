import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialSweets = [
  // Indian Sweets - Syrup Based
  { 
    name: 'Gulab Jamun', 
    category: 'Syrup Based', 
    price: 60.00, 
    quantity: 50, 
    description: 'Soft, deep-fried berry-sized balls made of milk solids and flour, soaked in rose-scented sugar syrup. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/53/gulab-jamun-2219933_640.jpg' 
  },
  { 
    name: 'Rasgulla', 
    category: 'Syrup Based', 
    price: 55.00, 
    quantity: 40, 
    description: 'Ball-shaped dumplings of chhena (an Indian cottage cheese) and semolina dough, cooked in light syrup. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/53/rasgulla-2219933_640.jpg' 
  },
  { 
    name: 'Jalebi', 
    category: 'Fried', 
    price: 50.00, 
    quantity: 25, 
    description: 'Crispy, orange, spiral-shaped funnel cakes made of fermented batter, soaked in saffron syrup. (100g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2014/12/13/00/54/indian-sweets-566216_640.jpg' 
  },
  { 
    name: 'Rasmalai', 
    category: 'Dairy', 
    price: 90.00, 
    quantity: 20, 
    description: 'Flattened balls of chhana soaked in malai (clotted cream) flavoured with cardamom and saffron. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2016/12/26/17/28/rasmalai-1931642_640.jpg' 
  },
  { 
    name: 'Kalakand', 
    category: 'Dairy', 
    price: 220.00, 
    quantity: 12, 
    description: 'A rich milk cake made from solidified, sweetened milk and paneer. (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/01/31/15/20/cake-2025936_640.jpg' 
  },
  { 
    name: 'Peda', 
    category: 'Dairy', 
    price: 200.00, 
    quantity: 22, 
    description: 'Semi-soft milk fudge, traditionally from Mathura, made with khoa, sugar and cardamom. (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/05/02/10/19/sweets-2278613_640.jpg' 
  },
  { 
    name: 'Gajar Ka Halwa', 
    category: 'Halwa', 
    price: 120.00, 
    quantity: 20, 
    description: 'A slow-cooked traditional pudding made with grated carrots, milk, ghee, sugar, and nuts. (Serving)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2018/08/25/20/52/carrot-halwa-3630746_640.jpg' 
  },
  { 
    name: 'Soan Papdi', 
    category: 'Flaky', 
    price: 130.00, 
    quantity: 35, 
    description: 'Cube-shaped, crisp and flaky sweet made with gram flour, ghee, milk, and cardamom. (250g Box)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/03/14/08/23/soan-papdi-2142654_640.jpg' 
  },
  { 
    name: 'Barfi', 
    category: 'Burfi', 
    price: 150.00, 
    quantity: 30, 
    description: 'Soft, creamy fudge-like sweet made with condensed milk, sugar, and flavored with cardamom. (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/54/barfi-2219934_640.jpg' 
  },
  { 
    name: 'Kheer', 
    category: 'Dairy', 
    price: 80.00, 
    quantity: 18, 
    description: 'Creamy rice pudding cooked with milk, sugar, cardamom, and garnished with nuts and saffron. (Serving)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/54/kheer-2219935_640.jpg' 
  },
  { 
    name: 'Sandesh', 
    category: 'Dairy', 
    price: 180.00, 
    quantity: 25, 
    description: 'Delicate Bengali sweet made from fresh chhena, sugar, and cardamom. (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/55/sandesh-2219936_640.jpg' 
  },
  { 
    name: 'Rabri', 
    category: 'Dairy', 
    price: 100.00, 
    quantity: 15, 
    description: 'Thick, creamy dessert made by boiling milk on low heat, flavored with cardamom and nuts. (Serving)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/55/rabri-2219937_640.jpg' 
  },
  
  // Festive Sweets - Laddus (Popular for Diwali, Holi, etc.)
  { 
    name: 'Motichoor Laddu', 
    category: 'Laddu', 
    price: 160.00, 
    quantity: 60, 
    description: 'Soft, delicious balls made from tiny gram flour droplets, fried in ghee and soaked in sugar syrup. Perfect for Diwali! (250g Box)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/56/motichoor-laddu-2219938_640.jpg' 
  },
  { 
    name: 'Besan Laddu', 
    category: 'Laddu', 
    price: 140.00, 
    quantity: 45, 
    description: 'Aromatic roasted gram flour balls with ghee and sugar, garnished with pistachios. Festival favorite! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/56/besan-laddu-2219939_640.jpg' 
  },
  { 
    name: 'Coconut Laddu', 
    category: 'Laddu', 
    price: 120.00, 
    quantity: 50, 
    description: 'Soft, melt-in-mouth coconut balls sweetened with sugar and flavored with cardamom. (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/56/coconut-laddu-2219940_640.jpg' 
  },
  { 
    name: 'Rava Laddu', 
    category: 'Laddu', 
    price: 130.00, 
    quantity: 40, 
    description: 'Traditional semolina laddus with ghee, sugar, and nuts. Perfect for festive occasions! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/56/rava-laddu-2219941_640.jpg' 
  },
  
  // Festive Sweets - Dry Fruit (Premium gifting)
  { 
    name: 'Kaju Katli', 
    category: 'Dry Fruit', 
    price: 280.00, 
    quantity: 30, 
    description: 'Diamond-shaped traditional Indian sweet made with cashew nuts, sugar, and cardamom powder. Premium gifting! (250g Box)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/57/kaju-katli-2219942_640.jpg' 
  },
  { 
    name: 'Badam Katli', 
    category: 'Dry Fruit', 
    price: 300.00, 
    quantity: 25, 
    description: 'Rich almond fudge made with premium almonds, sugar, and cardamom. Perfect for special occasions! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/57/badam-katli-2219943_640.jpg' 
  },
  { 
    name: 'Pista Katli', 
    category: 'Dry Fruit', 
    price: 320.00, 
    quantity: 20, 
    description: 'Delicious pistachio fudge with the finest pistachios, sugar, and aromatic cardamom. Luxury gifting! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/57/pista-katli-2219944_640.jpg' 
  },
  { 
    name: 'Dry Fruit Mix', 
    category: 'Dry Fruit', 
    price: 450.00, 
    quantity: 15, 
    description: 'Premium assortment of dry fruit sweets including Kaju Katli, Badam Katli, and Pista Katli. (500g Gift Box)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/57/dry-fruit-mix-2219945_640.jpg' 
  },
  
  // Festive Sweets - Ghee Based (Traditional favorites)
  { 
    name: 'Mysore Pak', 
    category: 'Ghee Based', 
    price: 180.00, 
    quantity: 15, 
    description: 'Rich, melting sweet made of generous amounts of ghee, sugar, and gram flour. Traditional favorite! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/58/mysore-pak-2219946_640.jpg' 
  },
  { 
    name: 'Ghee Mysore Pak', 
    category: 'Ghee Based', 
    price: 250.00, 
    quantity: 20, 
    description: 'Extra rich version with premium ghee, sugar, and gram flour. Melt-in-mouth texture! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/58/ghee-mysore-pak-2219947_640.jpg' 
  },
  { 
    name: 'Ghee Burfi', 
    category: 'Ghee Based', 
    price: 200.00, 
    quantity: 28, 
    description: 'Creamy burfi made with pure ghee, milk solids, and sugar. Festival special! (250g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/58/ghee-burfi-2219948_640.jpg' 
  },
  { 
    name: 'Gulab Jamun (Ghee)', 
    category: 'Ghee Based', 
    price: 80.00, 
    quantity: 35, 
    description: 'Premium gulab jamun made with pure ghee instead of oil. Extra rich and flavorful! (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/53/gulab-jamun-2219933_640.jpg' 
  },
  
  // Additional Indian Sweets
  { 
    name: 'Cham Cham', 
    category: 'Syrup Based', 
    price: 70.00, 
    quantity: 30, 
    description: 'Elongated Bengali sweet made from chhena, soaked in sugar syrup and garnished with coconut. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/59/cham-cham-2219949_640.jpg' 
  },
  { 
    name: 'Rajbhog', 
    category: 'Syrup Based', 
    price: 75.00, 
    quantity: 25, 
    description: 'Large, stuffed rasgulla with khoya and dry fruits, soaked in saffron-flavored syrup. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/59/rajbhog-2219950_640.jpg' 
  },
  { 
    name: 'Malpua', 
    category: 'Fried', 
    price: 65.00, 
    quantity: 20, 
    description: 'Sweet pancakes made from flour, milk, and sugar, deep-fried and soaked in sugar syrup. (Plate of 2)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/59/malpua-2219951_640.jpg' 
  },
  { 
    name: 'Balushahi', 
    category: 'Fried', 
    price: 55.00, 
    quantity: 30, 
    description: 'Flaky, layered sweet pastry made from flour and ghee, soaked in sugar syrup. (100g)', 
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/10/17/59/balushahi-2219952_640.jpg' 
  }
]

async function main() {
  console.log('🌱 Seeding database with accurate images...')

  // Delete existing sweets
  await prisma.sweet.deleteMany()
  console.log('Cleared existing sweets...')

  // Create sweets
  for (const sweet of initialSweets) {
    await prisma.sweet.create({
      data: sweet
    })
  }

  console.log(`✅ Seeded ${initialSweets.length} sweets successfully with accurate images!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
