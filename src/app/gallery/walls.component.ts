import {
	ChangeDetectionStrategy,
	Component,
	computed,
	CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders'

@Component({
	selector: 'app-walls',
	standalone: true,
	template: `
		<ngt-primitive
			*args="[model()]"
			[scale]="3"
			[rotation]="[0, (Math.PI / 3) * 2, 0]"
			[position]="[-1.5, 0, 0]"
		/>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtArgs],
})
export class Walls {
	protected Math = Math

	private gltf = injectNgtsGLTFLoader(() => 'models/galleryInnerWalls.glb')
	protected model = computed(() => {
		const gltf = this.gltf()
		if (!gltf) return null
		return gltf.scene
	})
}
