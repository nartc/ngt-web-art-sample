import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ArtworkStore } from '../services/artwork.store'
import { Controls } from './controls.component'
import { Floor } from './floor.component'
import { Frames } from './frames.component'
import { Lights } from './lights.component'
import { Walls } from './walls.component'

@Component({
	standalone: true,
	template: `
		<app-lights />
		<app-controls />
		<app-frames [artworks]="artworkStore.artworks()" />

		<app-floor />
		<app-walls />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'experience' },
	imports: [Lights, Controls, Frames, Floor, Walls],
})
export class Scene {
	protected artworkStore = inject(ArtworkStore)
}
