import { create } from "zustand"

interface ComposeState {
	activeField: RecipientField
	bccQuery: string
	ccQuery: string
	draftId?: string
	selectedContactIndex: number
	showCcBcc: boolean
	showSuggestions: boolean
	toQuery: string

	setActiveField: (field: RecipientField) => void
	setBccQuery: (value: string) => void
	setCcQuery: (value: string) => void
	setDraftId: (id: string) => void
	setSelectedContactIndex: (index: number) => void
	setShowCcBcc: (show: boolean) => void
	setShowSuggestions: (show: boolean) => void
	setToQuery: (value: string) => void
}

export const useComposeStore = create<ComposeState>((set) => ({
	activeField: "to",
	bccQuery: "",
	ccQuery: "",
	draftId: undefined,
	selectedContactIndex: 0,
	showCcBcc: false,
	showSuggestions: false,
	toQuery: "",

	setActiveField: (field) => set({ activeField: field }),
	setBccQuery: (value) => set({ bccQuery: value }),
	setCcQuery: (value) => set({ ccQuery: value }),
	setDraftId: (id) => set({ draftId: id }),
	setSelectedContactIndex: (index) => set({ selectedContactIndex: index }),
	setShowCcBcc: (show) => set({ showCcBcc: show }),
	setShowSuggestions: (show) => set({ showSuggestions: show }),
	setToQuery: (value) => set({ toQuery: value }),
}))
