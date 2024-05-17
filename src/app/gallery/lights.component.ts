import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { extend } from 'angular-three'
import { HemisphereLight, PointLight, SpotLight } from 'three'

extend({ SpotLight, HemisphereLight, PointLight })

@Component({
	selector: 'app-lights',
	standalone: true,
	template: `
		<ngt-spot-light [intensity]="30" [distance]="30" [angle]="Math.PI / 4" [penumbra]="0.5" />
		<ngt-hemisphere-light skyColor="#ffffff" groundColor="#bbbbff" [intensity]="0.5" />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[0, 3.2, -10]" />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[10, 3.2, 7.6]" />
		<ngt-point-light [intensity]="Math.PI" [distance]="13" [decay]="1" [position]="[-10, 3.2, 7.6]" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lights {
	protected Math = Math
}
