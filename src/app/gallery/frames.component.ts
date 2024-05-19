import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core'
import { checkUpdate, extend, injectNgtRef, NgtArgs } from 'angular-three'
import { CylinderGeometry, Group, Object3D, Vector3 } from 'three'
import type { Artwork } from '../services/artwork.store'
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

	protected onNext(currentId: number) {
		console.log('showing next frame')
	}

	protected onPrevious(currentId: number) {
		console.log('showing previous frame')
	}

	protected onFrameAttached(frame: Group, index: number) {
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
		// const to = new Vector3(position.x, position.y, position.z)
		frame.position.copy(position)
		checkUpdate(frame)
	}
}
