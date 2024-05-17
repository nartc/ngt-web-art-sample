import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: `
		<h1>Welcome to {{ title }}!</h1>

		<router-outlet />
	`,
	styles: `
		:host {
			isolation: isolate;
		}
	`,
})
export class AppComponent {
	title = 'ngt-webxr-art'
}
