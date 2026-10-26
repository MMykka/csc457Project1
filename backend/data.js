// In-memory dataset. Resets every time the server restarts.
// Shoe: id (number), name (string), brand (string), category (string), price (number),
// color (string), sizes (array of numbers, US sizes), inStock (boolean), image (string path, '' = no photo yet)
export const shoes = [
  { id: 1, name: 'Alne BUGrip', brand: 'Icebug', category: 'Winter', price: 229.95, color: 'Black', sizes: [7, 8, 9, 10, 11, 12], inStock: true, image: '/images/shoes/alne-bugrip-black.jpg' },
  { id: 2, name: 'Moen NT', brand: 'Icebug', category: 'Winter', price: 149.95, color: 'Olive/Black', sizes: [6, 7, 8, 9, 10, 11], inStock: true, image: '/images/shoes/moen-olive.jpg' },
  { id: 3, name: 'Metro2 BUGrip', brand: 'Icebug', category: 'Winter', price: 229.95, color: 'Cognac', sizes: [6, 7, 8, 9, 10], inStock: true, image: '/images/shoes/metro-chelsea-cognac.jpg' },
  { id: 4, name: 'Rover RB9X GTX', brand: 'Icebug', category: 'Hiking', price: 179.95, color: 'Green', sizes: [7, 8, 9, 10, 11], inStock: false, image: '/images/shoes/rover-boa-green.jpg' },
  { id: 5, name: 'Spirit OLX', brand: 'Icebug', category: 'Trail', price: 139.95, color: 'Black/Olive', sizes: [6, 7, 8, 9, 10, 11, 12], inStock: true, image: '/images/shoes/trail-black-olive.jpg' },
  { id: 6, name: 'Arcus RB9X', brand: 'Icebug', category: 'Running', price: 159.95, color: 'Black', sizes: [6, 7, 8, 9, 10, 11, 12], inStock: true, image: '/images/shoes/trail-runner-black.jpg' },
  { id: 7, name: 'Boda NT', brand: 'Icebug', category: 'Winter', price: 199.95, color: 'Cognac', sizes: [5, 6, 7, 8, 9, 10], inStock: false, image: '/images/shoes/chelsea-zip-cognac.jpg' },
  { id: 8, name: 'Juvas NT', brand: 'Icebug', category: 'Winter', price: 219.95, color: 'Black', sizes: [7, 8, 9, 10, 11, 12], inStock: true, image: '/images/shoes/wool-boot-black.jpg' },
]
