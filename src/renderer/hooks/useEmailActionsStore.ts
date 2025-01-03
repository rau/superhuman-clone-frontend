import { create } from "zustand"

type ActionType = "done" | "star" | "read" | "trash" | "spam" | "modifyLabels"

interface Action {
	type: ActionType
	emails: EmailThread[]
	previousValues: any[]
}

interface EmailActionsState {
	lastAction: Action | null
	setLastAction: (action: Action | null) => void
}

export const useEmailActionsStore = create<EmailActionsState>((set) => ({
	lastAction: null,
	setLastAction: (action) => set({ lastAction: action }),
}))
