import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core'
import { extend, injectBeforeRender, NgtArgs, type NgtThreeEvent } from 'angular-three'
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

@Component({
	selector: 'app-frame-buttons',
	standalone: true,
	template: `
		<ngt-mesh-block
			*args="[buttonsPanelArgs]"
			[position]="[0, -0.7, -0.2]"
			(afterAttach)="onButtonPanelAttached($any($event).node)"
		>
			@for (button of buttons; track $index) {
				<ngt-mesh-block
					*args="[button.args()]"
					[position]="button.position"
					(click)="button.onClick($any($event))"
					(afterAttach)="onButtonAttached($any($event).node)"
				>
					<ngt-mesh-text *args="[button.textArgs()]" />
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

	protected buttons = [
		{
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.next.emit()
				}
			},
			args: computed(() => ({
				...DEFAULT_BUTTON_OPTIONS,
				name: 'Frame ' + this.artwork().id + ' ' + 'Next Button',
			})),
			textArgs: computed(() => ({
				content: 'Next',
				name: 'Frame ' + this.artwork().id + ' ' + 'Next Button Text',
			})),
			position: [-0.75, 0, 0.0],
		},
		{
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.playInfo.emit()
				}
			},
			args: computed(() => ({
				...DEFAULT_BUTTON_OPTIONS,
				name: 'Frame ' + this.artwork().id + ' ' + 'Info Button',
			})),
			textArgs: computed(() => ({
				content: 'Info',
				name: 'Frame ' + this.artwork().id + ' ' + 'Info Button Text',
			})),
			position: [-0.8, 0.8, -0.1],
		},
		{
			onClick: (event: NgtThreeEvent<any>) => {
				if (event.object.name === 'MeshUI-Frame') {
					this.previous.emit()
				}
			},
			args: computed(() => ({
				...DEFAULT_BUTTON_OPTIONS,
				name: 'Frame ' + this.artwork().id + ' ' + 'Previous Button',
			})),
			textArgs: computed(() => ({
				content: 'Previous',
				name: 'Frame ' + this.artwork().id + ' ' + 'Previous Button Text',
			})),
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

	onButtonPanelAttached(panel: Block) {
		panel.rotateY(Math.PI)
		panel.rotateX(-0.55)
	}

	onButtonAttached(button: Block) {
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
