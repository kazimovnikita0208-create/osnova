export interface Category {
  id: string
  slug: string
  name: string
  icon: string
}

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  imageUrl: string
  categorySlug: string
  availability: 'in_stock' | 'out_of_stock' | 'coming_soon'
  description: string
  // Gastronomy-only fields
  weight?: number        // граммы / мл
  weightUnit?: 'г' | 'мл'
  composition?: string   // состав
  calories?: number      // ккал на 100 г
  proteins?: number      // белки г / 100 г
  fats?: number          // жиры г / 100 г
  carbs?: number         // углеводы г / 100 г
}

export const coffeeCategories: Category[] = [
  { id: '1', slug: 'all', name: 'Все', icon: '☕' },
  { id: '2', slug: 'coffee', name: 'Кофе', icon: '☕' },
  { id: '3', slug: 'pastries', name: 'Выпечка', icon: '🥐' },
  { id: '4', slug: 'fresh', name: 'Фреши', icon: '🍊' },
  { id: '5', slug: 'desserts', name: 'Десерты', icon: '🍰' },
]

export const coffeeProducts: Product[] = [
  {
    id: 'c1',
    slug: 'iced-latte',
    name: 'Iced Latte',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=90',
    categorySlug: 'coffee',
    availability: 'in_stock',
    description: 'Классический латте со льдом на свежем эспрессо. Мягкий, освежающий, сбалансированный.',
  },
  {
    id: 'c2',
    slug: 'artisan-baguette',
    name: 'Artisan Baguette',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=800&h=600&fit=crop&q=90',
    categorySlug: 'pastries',
    availability: 'in_stock',
    description: 'Хрустящий багет ручной работы с хрустящей корочкой и воздушным мякишем.',
  },
  {
    id: 'c3',
    slug: 'butter-croissant',
    name: 'Butter Croissant',
    price: 185,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&h=600&fit=crop&q=90',
    categorySlug: 'pastries',
    availability: 'in_stock',
    description: 'Классический французский круассан на сливочном масле. Слоистый, нежный, ароматный.',
  },
  {
    id: 'c4',
    slug: 'cold-pressed-oj',
    name: 'Cold-Pressed OJ',
    price: 210,
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&h=600&fit=crop&q=90',
    categorySlug: 'fresh',
    availability: 'in_stock',
    description: 'Свежевыжатый апельсиновый сок холодного отжима. Витамины и энергия.',
  },
  {
    id: 'c5',
    slug: 'cappuccino',
    name: 'Cappuccino',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=90',
    categorySlug: 'coffee',
    availability: 'in_stock',
    description: 'Классический капучино с плотной молочной пенкой и насыщенным эспрессо.',
  },
  {
    id: 'c6',
    slug: 'flat-white',
    name: 'Flat White',
    price: 170,
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&h=600&fit=crop&q=90',
    categorySlug: 'coffee',
    availability: 'in_stock',
    description: 'Австралийский flat white — двойной эспрессо с шелковистым молоком.',
  },
  {
    id: 'c7',
    slug: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    price: 195,
    imageUrl: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&h=600&fit=crop&q=90',
    categorySlug: 'pastries',
    availability: 'in_stock',
    description: 'Слоёная выпечка с бельгийским шоколадом внутри. Тает во рту.',
  },
  {
    id: 'c8',
    slug: 'green-smoothie',
    name: 'Green Smoothie',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&h=600&fit=crop&q=90',
    categorySlug: 'fresh',
    availability: 'in_stock',
    description: 'Зелёный смузи: шпинат, банан, яблоко, имбирь. Заряд бодрости.',
  },
  {
    id: 'c9',
    slug: 'tiramisu',
    name: 'Tiramisu',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&q=90',
    categorySlug: 'desserts',
    availability: 'in_stock',
    description: 'Классический итальянский тирамису с маскарпоне и эспрессо.',
  },
  {
    id: 'c10',
    slug: 'cheesecake',
    name: 'Cheesecake',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1524351199432-d330df18e1cd?w=800&h=600&fit=crop&q=90',
    categorySlug: 'desserts',
    availability: 'coming_soon',
    description: 'Нью-йоркский чизкейк с ванильным крем-чизом. Нежный и воздушный.',
  },
]
