import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MuseumCanvas } from './canvas.component'
import { GalleryScene } from './gallery-scene.component'
import { LoadingScene } from './loading-scene.component'

@Component({
	standalone: true,
	template: `
		@defer (prefetch on idle) {
			<app-museum-canvas [scene]="galleryScene" />
		} @placeholder (minimum 5s) {
			<app-museum-canvas [scene]="loadingScene" />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'gallery-page' },
	styles: `
		:host {
			display: block;
			height: 100dvh;
		}
	`,
	imports: [MuseumCanvas],
})
export default class GalleryPage {
	galleryScene = GalleryScene
	loadingScene = LoadingScene
}
