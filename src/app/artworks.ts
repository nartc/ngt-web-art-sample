import type { Vector3Tuple } from 'three'

export interface Artwork {
	audio?: string
	defaultPosition?: Vector3Tuple
	defaultRotation?: Vector3Tuple
	description?: string
	id?: number
	prompt?: string
	title?: string
	url: string
}

export const ARTWORKS: Artwork[] = [
	{ id: 0, title: 'Designer ', description: '', url: '/artworks/d2.webp' },
	{ id: 1, title: 'Designer_0', description: '', url: '/artworks/d0.jpeg' },
	{ id: 2, title: 'Almond Blossom', description: '', url: '/artworks/d3.jpeg' },
	{ id: 3, title: 'The Bedroom', description: '', url: '/artworks/d1.jpeg' },
	{ id: 4, title: 'Sunflowers', description: '', url: '/artworks/d6.jpeg' },
]
