import { create } from "zustand"
import { persist } from "zustand/middleware"

export enum AutoAdvanceBehavior {
	OLDER = "older",
	LIST = "list",
	NEWER = "newer",
}

export enum ImageDisplayBehavior {
	SHOW_ALL = "show-all",
	BLOCK_TRACKING = "block-tracking",
	BLOCK_ALL = "block-all",
}

export enum MeetingLinksBehavior {
	AUTO_ZOOM = "auto-zoom",
	AUTO_MEETS_AND_TEAMS = "auto-meets-and-teams",
	DO_NOT = "do-not",
}

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
	autoAdvanceBehavior: AutoAdvanceBehavior
	autoBccEmails: Set<string>
	blockedSenders: Set<string>
	imageDisplayBehavior: ImageDisplayBehavior
	instantIntro: string
	meetingLinksBehavior: MeetingLinksBehavior
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
				autoAdvanceBehavior: AutoAdvanceBehavior.OLDER,
				autoBccEmails: new Set(),
				blockedSenders: new Set(),
				imageDisplayBehavior: ImageDisplayBehavior.SHOW_ALL,
				instantIntro: "firstname",
				meetingLinksBehavior: MeetingLinksBehavior.DO_NOT,
			},
			setSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),
		}),
		{ name: "settings" }
	)
)
