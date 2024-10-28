import { create } from "zustand"

type TimeframeState = {
	timeframe: Date
	setTimeframe: (timeframe: Date) => void
}

type TimeframeScaleState = {
	scale: number
	start: Date
	setScale: (scale: number) => void
	setStart: (start: Date) => void
}

type EnabledAppsState = {
	cloneEnabled: boolean
	setCloneEnabled: (cloneEnabled: boolean) => void
	whoopEnabled: boolean
	setWhoopEnabled: (whoopEnabled: boolean) => void
	stravaEnabled: boolean
	setStravaEnabled: (stravaEnabled: boolean) => void
	spotifyEnabled: boolean
	setSpotifyEnabled: (spotifyEnabled: boolean) => void
}

export const useTimeframeStore = create<TimeframeState>((set) => ({
	timeframe: new Date(new Date().setHours(0, 0, 0, 0)),
	setTimeframe: (timeframe) => set({ timeframe }),
}))

export const useTimeframeScaleStore = create<TimeframeScaleState>((set) => ({
	scale: 160.0,
	start: new Date(new Date().setHours(new Date().getHours() - 5, 0, 0, 0)),
	setScale: (scale) => set({ scale }),
	setStart: (start) => set({ start }),
}))

export const useEnabledAppsStore = create<EnabledAppsState>((set) => ({
	cloneEnabled: true,
	whoopEnabled: true,
	stravaEnabled: true,
	spotifyEnabled: true,
	setCloneEnabled: (cloneEnabled) => set({ cloneEnabled }),
	setWhoopEnabled: (whoopEnabled) => set({ whoopEnabled }),
	setStravaEnabled: (stravaEnabled) => set({ stravaEnabled }),
	setSpotifyEnabled: (spotifyEnabled) => set({ spotifyEnabled }),
}))
