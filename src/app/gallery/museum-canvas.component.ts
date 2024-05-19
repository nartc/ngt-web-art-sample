import { ChangeDetectionStrategy, Component, input, type Type } from '@angular/core'
import { NgtCanvas } from 'angular-three'
import { NgtsLoader } from 'angular-three-soba/loaders'
import * as THREE from 'three'

@Component({
	selector: 'app-museum-canvas',
	standalone: true,
	template: `
		<ngt-canvas
			[sceneGraph]="scene()"
			[scene]="sceneOptions"
			[camera]="$any(cameraOptions)"
			[gl]="glOptions"
			[shadows]="true"
		/>
		<ngts-loader />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtCanvas, NgtsLoader],
})
export class MuseumCanvas {
	scene = input.required<Type<any>>()

	protected sceneOptions = {
		background: new THREE.Color('black'),
		backgroundBlurriness: 0.3,
	}

	protected cameraOptions = {
		position: [0, 1.6, 0],
		fov: 45,
		near: 0.1,
		far: 500,
	}

	protected glOptions = {
		toneMappingExposure: 1.5,
		// NOTE: Uncomment the following line to enable WebXR
		// xr: {
		//     enabled: true
		// }
	}
}
