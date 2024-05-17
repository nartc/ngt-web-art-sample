import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: `
		<div class="content" role="main">
			<router-outlet />
		</div>
	`,
	styles: `
		:host {
			isolation: isolate;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
				'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
		}
	`,
})
export class AppComponent {
	title = 'ngt-webxr-art'
}
