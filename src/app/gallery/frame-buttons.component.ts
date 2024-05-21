import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { extend, injectBeforeRender, NgtArgs } from 'angular-three'
import { Color } from 'three'
import { Block, Text, update } from 'three-mesh-ui'
import type { Artwork } from '../artworks'

extend({ MeshBlock: Block, MeshText: Text })

const DEFAULT_BUTTON_OPTIONS = {
	width: 0.4,
	height: 0.15,
	justifyContent: 'center',
	offset: 0.05,
	margin: 0.02,
	borderRadius: 0.075,
}

const idleAttributes = {
	width: 0.4,
	height: 0.15,
	offset: 0.035,
	backgroundColor: new Color(0x666666),
	backgroundOpacity: 0.3,
	fontColor: new Color(0xffffff),
}

const hoveredAttributes = {
	width: 0.4,
	height: 0.15,
	offset: 0.035,
	backgroundColor: new Color(0x999999),
	backgroundOpacity: 1,
	fontColor: new Color(0xffffff),
}

const selectedAttributes = {
	offset: 0.02,
	backgroundColor: new Color(0x777777),
	fontColor: new Color(0x222222),
}

@Component({
	selector: 'app-frame-buttons',
	standalone: true,
	template: `
		<ngt-mesh-block *args="[buttonsPanelArgs]" [position]="[0, -0.7, -0.2]" [rotation]="[0.55, Math.PI, 0]">
			@for (button of buttons; track $index) {
				<ngt-mesh-block
					*args="[buttonOptions]"
					[name]="'Frame ' + artwork().id + ' ' + button.text + ' Button'"
					[position]="button.position"
					(click)="$any($event).object.name === 'MeshUI-Frame' && button.onClick()"
					(afterAttach)="onButtonAttached($any($event).node)"
				>
					<ngt-mesh-text
						*args="[{ content: button.text, name: 'Frame ' + artwork().id + ' ' + button.text + ' Button Text' }]"
					/>
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

	artwork = input.required<Artwork>()
	next = output()
	previous = output()
	playInfo = output()

	protected buttonOptions = DEFAULT_BUTTON_OPTIONS
	protected buttons = [
		{
			onClick: this.next.emit.bind(this.next),
			text: 'Next',
			position: [-0.75, 0, 0.0],
		},
		{
			onClick: this.playInfo.emit.bind(this.playInfo),
			text: 'Info',
			position: [-0.8, 0.8, -0.1],
		},
		{
			onClick: this.previous.emit.bind(this.previous),
			text: 'Previous',
			position: [0.75, 0, 0],
		},
	]
	protected buttonsPanelArgs = {
		name: 'Button Panel Container',
		justifyContent: 'center',
		contentDirection: 'row-reverse',
		fontFamily: 'fonts/Roboto-msdf.json',
		fontTexture: 'fonts/Roboto-msdf.png',
		fontSize: 0.1,
		padding: 0.02,
		borderRadius: 0.11,
		height: 0.2,
		width: this.buttons.length / 2,
	}

	constructor() {
		injectBeforeRender(() => {
			update()
		})
	}

	onButtonAttached(button: Block) {
		// @ts-expect-error - we are setting up the state
		button.setupState({ state: 'idle', attributes: idleAttributes })

		// @ts-expect-error - we are setting up the state
		button.setupState({ state: 'hovered', attributes: hoveredAttributes })

		// @ts-expect-error - we are setting up the state
		button.setupState({ state: 'selected', attributes: selectedAttributes })
	}
}
