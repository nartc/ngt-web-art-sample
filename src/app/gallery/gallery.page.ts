import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgtCanvas, type NgtCanvasInputs } from 'angular-three'
import * as THREE from 'three'
import { Scene } from './scene.component'

@Component({
	standalone: true,
	template: `
		<ngt-canvas [sceneGraph]="scene" [options]="canvasOptions()" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'gallery-page' },
	styles: `
		:host {
			display: block;
			height: 100dvh;
		}
	`,
	imports: [NgtCanvas],
})
export default class GalleryPage {
	protected scene = Scene

	protected canvasOptions = signal<Partial<NgtCanvasInputs>>({
		scene: {
			background: new THREE.Color('black'),
			backgroundBlurriness: 0.3,
		},
		camera: {
			position: [0, 5, 0],
			fov: 45,
			near: 0.1,
			far: 500,
		},
		shadows: true,
		gl: {
			toneMappingExposure: 1.5,
			// NOTE: Uncomment the following line to enable WebXR
			// xr: {
			//     enabled: true
			// }
		},
	})
}
