import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { extend, NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders'

extend({})

@Component({
	selector: 'app-floor',
	standalone: true,
	template: `
		<ngt-primitive *args="[model()]" />
	`,
	imports: [NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Floor {
	protected gltf = injectNgtsGLTFLoader(() => 'models/floorModel.glb')
	protected model = computed(() => {
		const gltf = this.gltf()
		if (!gltf) return null
		const scene = gltf.scene
		console.log(scene)
		return scene

		// let material: Material = new MeshPhysicalMaterial({
		// 	// clearcoat: 0,
		// 	clearcoatRoughness: 0.1,
		// 	// metalness: 0,
		// 	roughness: 0.9,
		// 	color: 0x54001b, // Teal: 0x004a54,
		// 	// normalScale: new Vector2(0.15, 0.15)
		// })
		//
		// model.position.z = -0
		// model.scale.set(3, 3, 3)
		// model.traverse((obj: any) => {
		// 	if (obj.isMesh) {
		// 		meshesCount += 1
		// 		if (obj.name == 'Floor') {
		// 			material = this.materialsService.createFloorMaterial()
		// 		}
		//
		// 		obj.material = material
		//
		// 		obj.castShadow = true
		// 		obj.receiveShadow = true
		// 		obj.castShadow = true
		// 		obj.receiveShadow = true
		//
		// 		if (obj.material.map) {
		// 			obj.material.map.anisotropy = 16
		// 		}
		// 	}
		// })
	})
}
