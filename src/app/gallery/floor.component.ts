import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { checkUpdate, NgtArgs } from 'angular-three'
import { injectNgtsGLTFLoader, injectNgtsTextureLoader } from 'angular-three-soba/loaders'
import { MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, type Mesh } from 'three'

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
	private gltf = injectNgtsGLTFLoader(() => 'models/floorModel.glb')
	private textures = injectNgtsTextureLoader(() => ({
		diffuse: 'textures/hardwood_diffuse.jpg',
		bump: 'textures/hardwood_bump.jpg',
		roughness: 'textures/hardwood_roughness.jpg',
	}))

	protected model = computed(() => {
		const [gltf, textures] = [this.gltf(), this.textures()]
		if (!gltf || !textures) return null
		const { diffuse, roughness, bump } = textures
		const scene = gltf.scene

		let material: MeshStandardMaterial | MeshPhysicalMaterial = new MeshPhysicalMaterial({
			// clearcoat: 0,
			clearcoatRoughness: 0.1,
			// metalness: 0,
			roughness: 0.9,
			color: 0x54001b, // Teal: 0x004a54,
			// normalScale: new Vector2(0.15, 0.15)
		})

		scene.position.z = -0
		scene.scale.setScalar(3)

		scene.traverse((obj) => {
			if ((obj as Mesh).isMesh) {
				if (obj.name === 'Floor') {
					// Diffuse
					diffuse.wrapS = RepeatWrapping
					diffuse.wrapT = RepeatWrapping
					diffuse.anisotropy = 16
					diffuse.repeat.set(10, 24)
					diffuse.colorSpace = SRGBColorSpace
					checkUpdate(diffuse)

					// bump
					bump.wrapS = RepeatWrapping
					bump.wrapT = RepeatWrapping
					bump.anisotropy = 4
					bump.repeat.set(10, 24)
					checkUpdate(bump)

					// roughness
					roughness.wrapS = RepeatWrapping
					roughness.wrapT = RepeatWrapping
					roughness.anisotropy = 4
					roughness.repeat.set(10, 24)
					checkUpdate(roughness)

					material = new MeshStandardMaterial({
						roughness: 0.8,
						color: 0xffffff,
						metalness: 0.2,
						bumpScale: 0.0005,
						map: diffuse,
						bumpMap: bump,
						roughnessMap: roughness,
					})
				}

				;(obj as Mesh).material = material
				obj.castShadow = true
				obj.receiveShadow = true

				if (((obj as Mesh).material as MeshPhysicalMaterial).map) {
					;((obj as Mesh).material as MeshPhysicalMaterial).map!.anisotropy = 16
				}
			}
		})

		return scene
	})
}
