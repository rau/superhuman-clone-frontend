import { create } from "zustand"

interface ComposeState {
	draftId?: string
	setDraftId: (id: string) => void

	toQuery: string
	ccQuery: string
	bccQuery: string
	subject: string
	message: string
	toContacts: EmailParticipant[]
	ccContacts: EmailParticipant[]
	bccContacts: EmailParticipant[]
	attachments: DraftAttachment[]
	showCcBcc: boolean
	showSuggestions: boolean
	selectedContactIndex: number
	activeField: RecipientField

	attachmentsToDelete: string[]
	setQuery: (value: string, field: RecipientField) => void
	addContact: (contact: EmailParticipant, field: RecipientField) => void
	removeContact: (email: string, field: RecipientField) => void
	setSubject: (subject: string) => void
	setMessage: (message: string) => void
	addAttachment: (attachment: DraftAttachment) => void
	removeAttachment: (attachment: DraftAttachment) => void
	reset: () => void
	setSelectedContactIndex: (index: number) => void
	setActiveField: (field: RecipientField) => void
	setShowSuggestions: (show: boolean) => void
	setShowCcBcc: (show: boolean) => void
	setAttachments: (attachments: DraftAttachment[]) => void
	setToContacts: (contacts: EmailParticipant[]) => void
	setCcContacts: (contacts: EmailParticipant[]) => void
	setBccContacts: (contacts: EmailParticipant[]) => void
	setAttachmentsToDelete: (attachmentsToDelete: string[]) => void
}

export const useComposeStore = create<ComposeState>((set) => ({
	draftId: undefined,
	setDraftId: (id) => set({ draftId: id }),
	toQuery: "",
	ccQuery: "",
	bccQuery: "",
	subject: "",
	message: "",
	toContacts: [],
	ccContacts: [],
	bccContacts: [],
	attachments: [],
	attachmentsToDelete: [],
	showCcBcc: false,

	showSuggestions: false,
	selectedContactIndex: 0,
	activeField: "to",

	setQuery: (value, field) =>
		set((state) => ({
			[field === "to"
				? "toQuery"
				: field === "cc"
					? "ccQuery"
					: "bccQuery"]: value,
			activeField: field,
			showSuggestions: true,
			selectedContactIndex: 0,
		})),

	addContact: (contact, field) =>
		set((state) => ({
			[field === "to"
				? "toContacts"
				: field === "cc"
					? "ccContacts"
					: "bccContacts"]: [
				...state[
					field === "to"
						? "toContacts"
						: field === "cc"
							? "ccContacts"
							: "bccContacts"
				],
				contact,
			],
			[field === "to"
				? "toQuery"
				: field === "cc"
					? "ccQuery"
					: "bccQuery"]: "",
			showSuggestions: false,
		})),

	removeContact: (email, field) =>
		set((state) => ({
			[field === "to"
				? "toContacts"
				: field === "cc"
					? "ccContacts"
					: "bccContacts"]: state[
				field === "to"
					? "toContacts"
					: field === "cc"
						? "ccContacts"
						: "bccContacts"
			].filter((c) => c.email !== email),
		})),

	setSubject: (subject) => set({ subject }),
	setMessage: (message) => set({ message }),
	addAttachment: (attachment) =>
		set((state) => ({ attachments: [...state.attachments, attachment] })),
	removeAttachment: (attachment) =>
		set((state) => ({
			attachments: state.attachments.filter((a) => a !== attachment),
		})),
	setShowCcBcc: (show) => set({ showCcBcc: show }),
	reset: () =>
		set({
			toQuery: "",
			ccQuery: "",
			bccQuery: "",
			subject: "",
			message: "",
			toContacts: [],
			ccContacts: [],
			bccContacts: [],
			attachments: [],
			showCcBcc: false,
			showSuggestions: false,
			selectedContactIndex: 0,
			activeField: "to",
		}),
	setSelectedContactIndex: (index) => set({ selectedContactIndex: index }),
	setActiveField: (field) => set({ activeField: field }),
	setShowSuggestions: (show) => set({ showSuggestions: show }),
	setToContacts: (contacts) => set({ toContacts: contacts }),
	setCcContacts: (contacts) => set({ ccContacts: contacts }),
	setBccContacts: (contacts) => set({ bccContacts: contacts }),
	setAttachments: (attachments) => set({ attachments: attachments }),
	setAttachmentsToDelete: (attachmentsToDelete) =>
		set({ attachmentsToDelete }),
}))
