import { createInjectable } from 'ngxtension/create-injectable'

export const SpeechClient = createInjectable(
	() => {
		return {
			speak: (text: string, lang = 'en-US') => {
				const utterance = new SpeechSynthesisUtterance(text)
				utterance.lang = lang
				return new Promise<void>((resolve) => {
					utterance.onend = () => resolve()
					speechSynthesis.speak(utterance)
				})
			},
		}
	},
	{ providedIn: 'root' },
)
