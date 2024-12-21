import { create } from "zustand"

interface ComposeState {
	toQuery: string
	ccQuery: string
	bccQuery: string
	subject: string
	message: string
	toContacts: Contact[]
	ccContacts: Contact[]
	bccContacts: Contact[]
	attachments: Attachment[]
	showCcBcc: boolean
	showSuggestions: boolean
	selectedContactIndex: number
	activeField: "to" | "cc" | "bcc"

	setQuery: (value: string, field: "to" | "cc" | "bcc") => void
	addContact: (contact: Contact, field: "to" | "cc" | "bcc") => void
	removeContact: (email: string, field: "to" | "cc" | "bcc") => void
	setSubject: (subject: string) => void
	setMessage: (message: string) => void
	addAttachment: (attachment: Attachment) => void
	removeAttachment: (path: string) => void
	toggleCcBcc: () => void
	reset: () => void
	setSelectedContactIndex: (index: number) => void
	setActiveField: (field: "to" | "cc" | "bcc") => void
	setShowSuggestions: (show: boolean) => void
}

export const useComposeStore = create<ComposeState>((set) => ({
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
	removeAttachment: (path) =>
		set((state) => ({
			attachments: state.attachments.filter((a) => a.path !== path),
		})),
	toggleCcBcc: () => set((state) => ({ showCcBcc: !state.showCcBcc })),
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
}))
