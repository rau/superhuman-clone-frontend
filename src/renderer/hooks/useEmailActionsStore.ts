import { create } from "zustand"

type ActionType = "done" | "star" | "read" | "trash"

interface Action {
	type: ActionType
	email: EmailThread
	previousValue: boolean
}

interface EmailActionsState {
	lastAction: Action | null
	setLastAction: (action: Action | null) => void
}

export const useEmailActionsStore = create<EmailActionsState>((set) => ({
	lastAction: null,
	setLastAction: (action) => set({ lastAction: action }),
}))
