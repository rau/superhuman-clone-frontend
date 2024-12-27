import { create } from "zustand"

interface SettingsState {
	downloadPath: string
	setDownloadPath: (path: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
	downloadPath: "Downloads",
	setDownloadPath: (path) => set({ downloadPath: path }),
}))
