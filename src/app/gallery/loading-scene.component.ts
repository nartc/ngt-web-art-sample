import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { extend, injectNgtRef, NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders'
import { Mesh, PointLight, SphereGeometry, type Object3D } from 'three'
import type { OrbitControls } from 'three-stdlib'
import { Controls } from './controls.component'
import { Lights } from './lights.component'

extend({ Mesh, SphereGeometry, PointLight })

@Component({
	standalone: true,
	template: `
		<!-- addLights -->
		<app-lights />

		<!-- addControls -->
		<app-controls [controlsRef]="controlsRef" />

		<!-- angular logo model -->
		<ngt-primitive *args="[model()]" [position]="[0, 13, -100]" (beforeRender)="onBeforeRender($any($event).object)" />

		<!-- particle light -->
		<ngt-mesh [position]="[0, 0, -90]" (beforeRender)="onParticleLightBeforeRender($any($event).object)">
			<ngt-sphere-geometry *args="[0.05, 8, 8]" />
			<ngt-point-light [intensity]="30" [rotation]="[-Math.PI / 2, 0, 0]" />
		</ngt-mesh>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgtArgs, Lights, Controls],
})
export class LoadingScene {
	protected Math = Math

	protected controlsRef = injectNgtRef<OrbitControls>()

	private gltf = injectNgtsGLTFLoader(() => 'models/aLogo.glb')
	protected model = computed(() => {
		const gltf = this.gltf()
		if (!gltf) return null
		this.controlsRef.nativeElement.enabled = false
		return gltf.scene
	})

	onBeforeRender(object: Object3D) {
		object.rotation.y += 0.01
	}

	onParticleLightBeforeRender(object: Mesh) {
		const timer = Date.now() * 0.00025
		object.position.x = Math.sin(timer * 7) * 3
		object.position.y = Math.cos(timer * 5) * 4
		object.position.z = Math.cos(timer * 3) * 3
	}
}
