import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ARTWORKS } from '../artworks'
import { Controls } from './controls.component'
import { Floor } from './floor.component'
import { Frames } from './frames.component'
import { GalleryLights } from './gallery-lights.component'
import { Walls } from './walls.component'

@Component({
	standalone: true,
	template: `
		<app-gallery-lights />
		<app-controls />
		<app-frames [artworks]="artworks" />

		<app-floor />
		<app-walls />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'experience' },
	imports: [Controls, Frames, Floor, Walls, GalleryLights],
})
export class GalleryScene {
	protected artworks = ARTWORKS
}
