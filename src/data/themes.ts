export interface Theme {
  id: string
  name: string
  category: 'nature' | 'city' | 'ghibli' | 'lofi' | 'minimal' | 'animated'
  imageUrl: string
  videoUrl?: string
  overlayOpacity: number
  accentColor?: string
}

export const themes: Theme[] = [
  // --- Ghibli Inspired ---
  {
    id: 'spirited-away',
    name: 'Train Ride',
    category: 'ghibli',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.3,
    accentColor: '#fb923c',
  },
  {
    id: 'totoro-forest',
    name: 'Spirit Forest',
    category: 'ghibli',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.35,
    accentColor: '#4ade80',
  },
  {
    id: 'kiki-city',
    name: 'Ocean City',
    category: 'ghibli',
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.3,
    accentColor: '#60a5fa',
  },
  {
    id: 'howl-meadow',
    name: 'Mountain Meadow',
    category: 'ghibli',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.35,
    accentColor: '#fbbf24',
  },

  // --- Lofi Aesthetic ---
  {
    id: 'lofi-study',
    name: 'Quiet Study',
    category: 'lofi',
    imageUrl: 'https://images.unsplash.com/photo-1516383748286-5704338dfef1?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.45,
    accentColor: '#a78bfa',
  },
  {
    id: 'lofi-window',
    name: 'Rainy Window',
    category: 'lofi',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.5,
    accentColor: '#818cf8',
  },
  {
    id: 'lofi-sunset',
    name: 'Retro Sunset',
    category: 'lofi',
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.4,
    accentColor: '#f472b6',
  },
  {
    id: 'lofi-cafe',
    name: 'Evening Café',
    category: 'lofi',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.45,
    accentColor: '#fb923c',
  },

  // --- Animated / Video (Public Assets) ---
  {
    id: 'animated-lofi-girl',
    name: 'Lofi Girl (Loop)',
    category: 'animated',
    imageUrl: 'https://images.unsplash.com/photo-1516383748286-5704338dfef1?w=1920&q=80&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-studying-in-her-room-with-the-lights-on-42680-large.mp4',
    overlayOpacity: 0.4,
    accentColor: '#a78bfa',
  },
  {
    id: 'animated-rain',
    name: 'Rainy Night',
    category: 'animated',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-a-window-at-night-1538-large.mp4',
    overlayOpacity: 0.5,
    accentColor: '#818cf8',
  },
  {
    id: 'animated-waves',
    name: 'Gentle Waves',
    category: 'animated',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sea-water-waves-crashing-on-the-shore-at-sunset-1210-large.mp4',
    overlayOpacity: 0.35,
    accentColor: '#fbbf24',
  },

  // --- Nature & Others ---
  {
    id: 'lavender-fields',
    name: 'Lavender Fields',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.35,
    accentColor: '#c4b5fd',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'minimal',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.6,
  },
]
