import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { extend, injectNgtRef, NgtArgs, type NgtInjectedRef } from 'angular-three'
import { injectNgtsTextureLoader } from 'angular-three-soba/loaders'
import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	Mesh,
	MeshPhongMaterial,
	SpotLight,
	SRGBColorSpace,
	Texture,
	UVMapping,
} from 'three'
import type { Artwork } from '../services/artwork.store'

extend({ Group, Mesh, BoxGeometry, MeshPhongMaterial, SpotLight })

@Component({
	selector: 'app-frame',
	standalone: true,
	template: `
		<ngt-group
			#frameGroup
			[name]="artwork().title + ' frame group'"
			[rotation]="[0, Math.PI, 0]"
			[scale]="1.3"
			[userData]="{ description: artwork().description }"
			(afterAttach)="frameAttached.emit($any(frameGroup))"
		>
			<ngt-mesh [ref]="frameMeshRef" [name]="artwork().title + ' frame mesh'" [geometry]="geometryRef().nativeElement">
				<ngt-mesh-phong-material color="rgb(165, 187, 206)" [needsUpdate]="true" />
			</ngt-mesh>

			<ngt-mesh #canvasMesh name="Canvas">
				<ngt-box-geometry *args="[1, 1, 0.12]" />
				<ngt-mesh-phong-material name="Canvas material" [map]="artworkTexture()" />
			</ngt-mesh>

			<ngt-spot-light
				[intensity]="30"
				[distance]="30"
				[angle]="Math.PI / 4"
				[penumbra]="0.5"
				[target]="canvasMesh"
				[position]="[0, 2, 0]"
			/>
		</ngt-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgtArgs],
})
export class Frame {
	protected Math = Math

	geometryRef = input.required<NgtInjectedRef<CylinderGeometry>>()
	artwork = input.required<Artwork>()
	frameAttached = output<Group>()

	protected frameMeshRef = injectNgtRef<Mesh>()

	constructor() {
		queueMicrotask(() => {
			this.frameMeshRef.nativeElement.geometry.rotateX(Math.PI / 2)
		})
	}

	protected artworkTexture = injectNgtsTextureLoader(() => this.artwork().url, {
		onLoad: (t) => {
			const texture = t as Texture
			texture.colorSpace = SRGBColorSpace
			texture.mapping = UVMapping
		},
	})
}
