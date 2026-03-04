export interface Sound {
  id: string
  name: string
  emoji: string
  url: string
}

export const sounds: Sound[] = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', url: 'https://cdn.freesound.org/previews/359/359538_5121236-lq.mp3' },
  { id: 'fire', name: 'Fireplace', emoji: '🔥', url: 'https://cdn.freesound.org/previews/432/432544_7588598-lq.mp3' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', url: 'https://cdn.freesound.org/previews/4/4926_35187-lq.mp3' },
  { id: 'forest', name: 'Forest', emoji: '🌲', url: 'https://cdn.freesound.org/previews/135/135776_1829486-lq.mp3' },
  { id: 'coffee', name: 'Café', emoji: '☕', url: 'https://cdn.freesound.org/previews/167/167261_1477378-lq.mp3' },
  { id: 'wind', name: 'Wind', emoji: '💨', url: 'https://cdn.freesound.org/previews/459/459679_7088485-lq.mp3' },
  { id: 'thunder', name: 'Thunder', emoji: '⛈️', url: 'https://cdn.freesound.org/previews/398/398156_7588598-lq.mp3' },
  { id: 'birds', name: 'Birds', emoji: '🐦', url: 'https://cdn.freesound.org/previews/219/219453_4056464-lq.mp3' },
]
