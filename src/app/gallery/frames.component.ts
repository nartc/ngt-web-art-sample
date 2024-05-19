import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core'
import { checkUpdate, extend, injectNgtRef, NgtArgs } from 'angular-three'
import { animate, easeInOut } from 'popmotion'
import { CylinderGeometry, Group, MathUtils, Object3D, Vector3 } from 'three'
import type { Artwork } from '../services/artwork.store'
import { SpeechClient } from '../services/speech.client'
import { Frame } from './frame.component'

extend({ Group, CylinderGeometry })

@Component({
	selector: 'app-frames',
	standalone: true,
	template: `
		<ngt-cylinder-geometry [ref]="geometryRef" *args="[1, 0.85, 0.1, 64, 5]" attach="none" />
		<ngt-group
			[ref]="framesRef"
			name="Frames Group"
			[position]="[0, 1.6, 0]"
			(afterAttach)="onAfterAttach($any($event).node)"
		>
			@for (artwork of artworks(); track artwork.id) {
				<app-frame
					[artwork]="artwork"
					[geometryRef]="geometryRef"
					(frameAttached)="onFrameAttached($event, $index)"
					(next)="onNext($event)"
					(previous)="onPrevious($event)"
					(playInfo)="onPlayInfo($event)"
				/>
			}
		</ngt-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgtArgs, Frame],
})
export class Frames {
	artworks = input.required<Artwork[]>()
	protected angle = computed(() => (Math.PI * 2) / this.artworks().length || 5)

	protected geometryRef = injectNgtRef<CylinderGeometry>()
	protected framesRef = injectNgtRef<Group>()

	private speechClient = inject(SpeechClient)

	protected onNext(currentId: number) {
		const currentFrame = this.framesRef.nativeElement.children[currentId]
		this.resetFramePosition(currentFrame)

		// Rotate to Next frame
		const i = currentId < 5 - 1 ? currentId + 1 : 0
		this.rotateFrames(72)
		this.focusFrame(this.framesRef.nativeElement.children[i])
	}

	protected onPrevious(currentId: number) {
		const currentFrame = this.framesRef.nativeElement.children[currentId]
		this.resetFramePosition(currentFrame)

		// Rotate to Previous
		const i = currentId === 0 ? 5 - 1 : currentId - 1
		this.rotateFrames(-72)
		this.focusFrame(this.framesRef.nativeElement.children[i])
	}

	protected onPlayInfo(artwork: Artwork) {
		const text = artwork.description || artwork.title
		if (text) {
			void this.speechClient.speak(text)
		}
	}

	protected onFrameAttached(frame: Group, index: number) {
		frame.rotateY(Math.PI)
		const alpha = index * this.angle()
		const x = Math.sin(alpha) * 7 // 0 - 1
		const z = -Math.cos(alpha) * 7 // 0 - 0
		frame.position.set(x, 0, z)
		frame.rotation.y = alpha
		frame.userData['originalPosition'] = frame.position.clone()
		checkUpdate(frame)
	}

	protected onAfterAttach(frames: Group) {
		// NOTE: we want to run this after all frames are attached
		queueMicrotask(() => {
			const f = frames.children[0]
			this.focusFrame(f)
		})
	}

	protected focusFrame(frame: Object3D) {
		const x = (frame.position.x / 7) * 4
		const z = (frame.position.z / 7) * 4
		const p = new Vector3(x, frame.position.y, z)
		this.moveFrame(frame, p)
	}

	protected moveFrame(frame: Object3D, position: Vector3) {
		animate({
			from: frame.position,
			to: position,
			duration: 2500,
			ease: easeInOut,
			onUpdate: (latest) => {
				frame.position.x = latest.x
				frame.position.y = latest.y
				frame.position.z = latest.z
			},
			onComplete: () => {
				checkUpdate(frame)
			},
		})
	}

	protected resetFramePosition(frame: Object3D) {
		const position = frame.userData['originalPosition']
		this.moveFrame(frame, position)
	}

	protected rotateFrames(angle: number = 72) {
		// angle between frames and the current group rotation
		const y = MathUtils.degToRad(angle) + this.framesRef.nativeElement.rotation.y
		animate({
			from: this.framesRef.nativeElement.rotation.y,
			to: y,
			duration: 1000,
			ease: easeInOut,
			onUpdate: (latest) => (this.framesRef.nativeElement.rotation.y = latest),
		})
	}
}
