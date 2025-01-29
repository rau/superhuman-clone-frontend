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
	isQuickTipsOpen: boolean
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
				isQuickTipsOpen: true,
			},
			setSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),
		}),
		{ name: "settings" }
	)
)
