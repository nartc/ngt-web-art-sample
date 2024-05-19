import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { extend } from 'angular-three'
import { PointLight } from 'three'
import { Lights } from './lights.component'

extend({ PointLight })

@Component({
	selector: 'app-gallery-lights',
	standalone: true,
	template: `
		<app-lights />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[0, 3.2, -10]" />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[10, 3.2, 7.6]" />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[-10, 3.2, 7.6]" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [Lights],
})
export class GalleryLights {
	protected Math = Math
}
