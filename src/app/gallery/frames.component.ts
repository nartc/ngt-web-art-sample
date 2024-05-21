import {
	ChangeDetectionStrategy,
	Component,
	computed,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	input,
	signal,
} from '@angular/core'
import { checkUpdate, extend, NgtArgs } from 'angular-three'
import { animate, easeInOut } from 'popmotion'
import { CylinderGeometry, Group, MathUtils, Object3D, Vector3 } from 'three'
import type { Artwork } from '../artworks'
import { SpeechClient } from '../speech.client'
import { Frame } from './frame.component'

extend({ Group })

@Component({
	selector: 'app-frames',
	standalone: true,
	template: `
		<ngt-group name="Frames Group" [position]="[0, 1.6, 0]" (afterAttach)="onFramesGroupAttached($any($event).node)">
			@for (artwork of artworks(); track artwork.id) {
				<app-frame
					[artwork]="artwork"
					[geometry]="geometry"
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

	protected geometry = new CylinderGeometry(1, 0.85, 0.1, 64, 5)

	private speechClient = inject(SpeechClient)

	private frames = signal<Group>(null!)
	private angle = computed(() => (Math.PI * 2) / this.artworks().length || 5)

	onNext(currentId: number) {
		const currentFrame = this.frames().children[currentId]
		this.resetFramePosition(currentFrame)

		// Rotate to Next frame
		const i = currentId < 5 - 1 ? currentId + 1 : 0
		this.rotateFrames(72)
		this.focusFrame(this.frames().children[i])
	}

	onPrevious(currentId: number) {
		const currentFrame = this.frames().children[currentId]
		this.resetFramePosition(currentFrame)

		// Rotate to Previous
		const i = currentId === 0 ? 5 - 1 : currentId - 1
		this.rotateFrames(-72)
		this.focusFrame(this.frames().children[i])
	}

	onPlayInfo(artwork: Artwork) {
		const text = artwork.description || artwork.title
		if (text) {
			void this.speechClient.speak(text)
		}
	}

	onFrameAttached(frame: Group, index: number) {
		frame.rotateY(Math.PI)
		const alpha = index * this.angle()
		const x = Math.sin(alpha) * 7 // 0 - 1
		const z = -Math.cos(alpha) * 7 // 0 - 0
		frame.position.set(x, 0, z)
		frame.rotation.y = alpha
		frame.userData['originalPosition'] = frame.position.clone()
		checkUpdate(frame)
	}

	onFramesGroupAttached(frames: Group) {
		this.frames.set(frames)
		// NOTE: we want to run this after all frames are attached
		queueMicrotask(() => {
			const f = frames.children[0]
			this.focusFrame(f)
		})
	}

	private focusFrame(frame: Object3D) {
		const x = (frame.position.x / 7) * 4
		const z = (frame.position.z / 7) * 4
		const p = new Vector3(x, frame.position.y, z)
		this.moveFrame(frame, p)
	}

	private moveFrame(frame: Object3D, position: Vector3) {
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

	private resetFramePosition(frame: Object3D) {
		const position = frame.userData['originalPosition']
		this.moveFrame(frame, position)
	}

	private rotateFrames(angle: number = 72) {
		// angle between frames and the current group rotation
		const y = MathUtils.degToRad(angle) + this.frames().rotation.y
		animate({
			from: this.frames().rotation.y,
			to: y,
			duration: 1000,
			ease: easeInOut,
			onUpdate: (latest) => (this.frames().rotation.y = latest),
		})
	}
}
