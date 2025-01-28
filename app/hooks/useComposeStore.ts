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

	selectedContacts: Record<RecipientField, Set<string>>
	setSelectedContacts: (field: RecipientField, emails: Set<string>) => void

	showDiscardDialog: boolean
	setShowDiscardDialog: (show: boolean) => void

	selectedText: {
		start: number
		end: number
	}
	setSelectedText: (start: number, end: number) => void
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

	selectedContacts: {
		to: new Set(),
		cc: new Set(),
		bcc: new Set(),
	},
	setSelectedContacts: (field, emails) =>
		set((state) => ({
			selectedContacts: { ...state.selectedContacts, [field]: emails },
		})),

	showDiscardDialog: false,
	setShowDiscardDialog: (show) => set({ showDiscardDialog: show }),

	selectedText: {
		start: 0,
		end: 0,
	},
	setSelectedText: (start, end) => set({ selectedText: { start, end } }),
}))
