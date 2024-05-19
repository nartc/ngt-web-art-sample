import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { extend, injectBeforeRender, NgtArgs, type NgtThreeEvent } from 'angular-three'
import { Color } from 'three'
import { Block, Text, update } from 'three-mesh-ui'
import type { Artwork } from '../services/artwork.store'

extend({ MeshBlock: Block, MeshText: Text })

@Component({
	selector: 'app-frame-buttons',
	standalone: true,
	template: `
		<ngt-mesh-block
			*args="[
				{
					name: 'Button Panel Container',
					justifyContent: 'center',
					contentDirection: 'row-reverse',
					fontFamily: FontJSON,
					fontTexture: FontImage,
					fontSize: 0.1,
					padding: 0.02,
					borderRadius: 0.11,
					height: 0.2,
					width: buttons.length / 2
				}
			]"
			[position]="[0, -0.7, -0.2]"
			(afterAttach)="onAfterAttach($any($event).node)"
		>
			@for (button of buttons; track button.name) {
				<ngt-mesh-block
					*args="[
						{
							name: 'Frame ' + artwork().id + ' ' + button.name,
							width: 0.4,
							height: 0.15,
							justifyContent: 'center',
							offset: 0.05,
							margin: 0.02,
							borderRadius: 0.075
						}
					]"
					[position]="button.position"
					(click)="button.onClick($any($event))"
					(afterAttach)="onAfterButtonAttach($any($event).node)"
				>
					<ngt-mesh-text *args="[{ content: button.text, name: button.name + ' Text' }]" />
				</ngt-mesh-block>
			}
		</ngt-mesh-block>
	`,
	imports: [NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameButtons {
	protected Math = Math

	protected FontJSON = 'fonts/Roboto-msdf.json'
	protected FontImage = 'fonts/Roboto-msdf.png'

	protected buttons = [
		{
			name: 'Next Button',
			text: 'Next',
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.next.emit()
				}
			},
			position: [-0.75, 0, 0.0],
		},
		{
			name: 'Info Button',
			text: 'Info',
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.playInfo.emit()
				}
			},
			position: [-0.8, 0.8, -0.1],
		},
		{
			name: 'Previous Button',
			text: 'Previous',
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.previous.emit()
				}
			},
			position: [0.75, 0, 0],
		},
	]

	artwork = input.required<Artwork>()
	next = output()
	previous = output()
	playInfo = output()

	constructor() {
		injectBeforeRender(() => {
			update()
		})
	}

	protected onAfterAttach(panel: Block) {
		panel.rotateY(Math.PI)
		panel.rotateX(-0.55)
	}

	protected onAfterButtonAttach(button: Block) {
		// @ts-expect-error - we are setting up the state
		button.setupState({
			state: 'idle',
			attributes: {
				width: 0.4,
				height: 0.15,
				offset: 0.035,
				backgroundColor: new Color(0x666666),
				backgroundOpacity: 0.3,
				fontColor: new Color(0xffffff),
			},
		})

		// @ts-expect-error - we are setting up the state
		button.setupState({
			state: 'hovered',
			attributes: {
				width: 0.4,
				height: 0.15,
				offset: 0.035,
				backgroundColor: new Color(0x999999),
				backgroundOpacity: 1,
				fontColor: new Color(0xffffff),
			},
		})

		// @ts-expect-error - we are setting up the state
		button.setupState({
			state: 'selected',
			attributes: {
				offset: 0.02,
				backgroundColor: new Color(0x777777),
				fontColor: new Color(0x222222),
			},
		})
	}
}
