import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { extend } from 'angular-three'
import { PointLight } from 'three'
import { Lights } from './lights.component'

extend({ PointLight })

@Component({
	selector: 'app-gallery-lights',
	standalone: true,
	template: `
		<!-- addLights -->
		<app-lights />

		<!-- addCornerLights -->
		@for (position of lightPositions; track $index) {
			<ngt-point-light
				[intensity]="Math.PI"
				[distance]="13"
				[decay]="1"
				[position]="position"
			/>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [Lights],
})
export class GalleryLights {
	protected Math = Math
	protected lightPositions = [
		[0, 3.2, -10],
		[10, 3.2, 7.6],
		[-10, 3.2, 7.6],
	]
}
