import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { checkUpdate, extend, NgtArgs, type NgtInjectedRef } from 'angular-three'
import { injectNgtsTextureLoader } from 'angular-three-soba/loaders'
import {
	BoxGeometry,
	CylinderGeometry,
	Group,
	Mesh,
	MeshPhongMaterial,
	SpotLight,
	SRGBColorSpace,
	UVMapping,
} from 'three'
import type { Artwork } from '../services/artwork.store'
import { FrameButtons } from './frame-buttons.component'

extend({ Group, Mesh, BoxGeometry, MeshPhongMaterial, SpotLight })

@Component({
	selector: 'app-frame',
	standalone: true,
	template: `
		<ngt-group
			#frameGroup
			[name]="artwork().title + ' frame group'"
			[scale]="1.3"
			[userData]="{
				description: artwork().description,
				originalPosition: frameGroup['userData']?.['originalPosition']
			}"
			(afterAttach)="frameAttached.emit($any(frameGroup))"
		>
			<ngt-mesh
				#frameMesh
				[name]="artwork().title + ' frame mesh'"
				[geometry]="geometryRef().nativeElement"
				(afterAttach)="onAfterAttach($any(frameMesh))"
			>
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

			<app-frame-buttons
				[artwork]="artwork()"
				(next)="next.emit(artwork().id!)"
				(previous)="previous.emit(artwork().id!)"
				(playInfo)="playInfo.emit(artwork())"
			/>
		</ngt-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgtArgs, FrameButtons],
})
export class Frame {
	protected Math = Math

	geometryRef = input.required<NgtInjectedRef<CylinderGeometry>>()
	artwork = input.required<Artwork>()

	frameAttached = output<Group>()
	next = output<number>()
	previous = output<number>()
	playInfo = output<Artwork>()

	protected artworkTexture = injectNgtsTextureLoader(() => this.artwork().url, {
		onLoad: ([texture]) => {
			texture.colorSpace = SRGBColorSpace
			texture.mapping = UVMapping
			checkUpdate(texture)
		},
	})

	protected onAfterAttach(frameMesh: Mesh) {
		queueMicrotask(() => {
			frameMesh.geometry.rotateX(Math.PI / 2)
		})
	}
}
