import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, effect } from '@angular/core'
import { extend, injectNgtStore } from 'angular-three'
import { HemisphereLight, SpotLight } from 'three'

extend({ HemisphereLight })

@Component({
	selector: 'app-lights',
	standalone: true,
	template: `
		<ngt-hemisphere-light skyColor="#ffffff" groundColor="#bbbbff" [intensity]="0.5" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lights {
	protected Math = Math

	private store = injectNgtStore()
	private camera = this.store.select('camera')
	private scene = this.store.select('scene')

	constructor() {
		effect(() => {
			const [camera, scene] = [this.camera(), this.scene()]
			if (!camera || !scene) return

			const spotLight = new SpotLight(0xffffff, 30, 30, Math.PI / 4, 0.5)
			spotLight.position.set(0, -2, 0.64)
			camera.add(spotLight)
			scene.add(camera)
		})
	}
}
