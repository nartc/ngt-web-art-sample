import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders'

@Component({
	selector: 'app-walls',
	standalone: true,
	template: `
		<ngt-primitive *args="[model()]" />
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtArgs],
})
export class Walls {
	protected gltf = injectNgtsGLTFLoader(() => 'models/galleryInnerWalls.glb')
	protected model = computed(() => {
		const gltf = this.gltf()
		if (!gltf) return null

		const scene = gltf.scene

		scene.position.set(0, 0, 0)
		scene.scale.setScalar(3)

		return scene
	})
}
