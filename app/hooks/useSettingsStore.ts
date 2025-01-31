import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Settings {
	downloadPath: string
	jobTitle: string
	company: string
	companyDescription: string
	firstName: string
	lastName: string
	greeting: string
	signature: string
	autocomplete: boolean
	autocorrect: boolean
	isQuickTipsOpen: boolean
	backtickAsEscape: boolean
	sendAndMarkDone: boolean
	rsvpAndMarkDone: boolean
	showSenderFullNames: boolean
	emojiSkinColor: number
}

interface SettingsState {
	settings: Settings
	setSettings: (settings: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			settings: {
				downloadPath: "Downloads",
				jobTitle: "",
				company: "",
				companyDescription: "",
				firstName: "",
				lastName: "",
				greeting: "",
				signature: "",
				autocomplete: true,
				autocorrect: true,
				isQuickTipsOpen: true,
				backtickAsEscape: false,
				sendAndMarkDone: false,
				rsvpAndMarkDone: false,
				showSenderFullNames: false,
				emojiSkinColor: 0,
			},
			setSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),
		}),
		{ name: "settings" }
	)
)
