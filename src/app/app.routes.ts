import type { Routes } from '@angular/router'

export const routes: Routes = [
	{
		path: 'gallery',
		loadComponent: () => import('./gallery/gallery.page'),
		title: 'Gallery',
	},
	{
		path: '',
		redirectTo: '/gallery',
		pathMatch: 'full',
	},
]
