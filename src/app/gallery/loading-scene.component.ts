import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { extend, injectNgtRef, NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders'
import { Mesh, MeshBasicMaterial, PointLight, SphereGeometry, type Object3D } from 'three'
import type { OrbitControls } from 'three-stdlib'
import { Controls } from './controls.component'
import { Lights } from './lights.component'

extend({ Mesh, SphereGeometry, MeshBasicMaterial, PointLight })

@Component({
	standalone: true,
	template: `
		<app-lights />
		<app-controls [controlsRef]="controlsRef" />

		<ngt-primitive *args="[model()]" [position]="[0, 13, -100]" (beforeRender)="onBeforeRender($any($event).object)" />

		<ngt-mesh [position]="[0, 0, -90]" (beforeRender)="onParticleLightBeforeRender($any($event).object)">
			<ngt-sphere-geometry *args="[0.05, 8, 8]" />
			<ngt-mesh-basic-material />

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
	protected gltf = injectNgtsGLTFLoader(() => 'models/aLogo.glb')
	protected model = computed(() => {
		const gltf = this.gltf()
		if (!gltf) return null
		this.controlsRef.nativeElement.enabled = false
		return gltf.scene
	})

	protected onBeforeRender(object: Object3D) {
		object.rotation.y += 0.01
	}

	protected onParticleLightBeforeRender(object: Mesh) {
		const timer = Date.now() * 0.00025
		object.position.x = Math.sin(timer * 7) * 3
		object.position.y = Math.cos(timer * 5) * 4
		object.position.z = Math.cos(timer * 3) * 3
	}
}
