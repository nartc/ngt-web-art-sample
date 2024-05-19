import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core'
import { injectNgtRef } from 'angular-three'
import { NgtsOrbitControls } from 'angular-three-soba/controls'
import { OrbitControls } from 'three-stdlib'

@Component({
	selector: 'app-controls',
	standalone: true,
	template: `
		<ngts-orbit-controls
			[controlsRef]="controlsRef()"
			[target]="[0, 1.6, -5]"
			[dampingFactor]="0.05"
			[enableZoom]="true"
			[screenSpacePanning]="false"
			[minDistance]="5"
			[maxDistance]="60"
			[maxPolarAngle]="Math.PI / 2 - 0.05"
			[minPolarAngle]="Math.PI / 4"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgtsOrbitControls],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Controls {
	protected Math = Math
	controlsRef = input(injectNgtRef<OrbitControls>())
}
