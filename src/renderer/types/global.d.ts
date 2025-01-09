declare global {
	type GoogleAuthToken = {
		access_token: string
		refresh_token: string
	}

	type RouterURL = {
		path: string
		element: React.ReactNode
		title: string
	}

	type EmailThread = {
		id: string
		messages: EmailMessage[]
		subject: string
		snippet: string
		last_message_timestamp: number
		starred: boolean
		is_draft: boolean
	}

	type EmailMessage = {
		id: string
		thread_id: string
		subject: string
		sender: EmailParticipant
		to: EmailParticipants
		date: Date
		timestamp: number
		snippet: string
		body: string
		read: boolean
		attachments: EmailAttachment[]
	}

	type EmailParticipant = {
		email: string
		name?: string
		is_me: boolean
		interactionCount?: number
	}

	type EmailParticipants = {
		bcc?: EmailParticipant[]
		cc?: EmailParticipant[]
		to?: EmailParticipant[]
	}

	type DraftAttachment = {
		name: string
		size: number
		path: string
		content?: string
		type: string
	}

	type EmailAttachment = {
		id: string
		filename: string
		mime_type: string
		size: number
	}

	type Folder = {
		id: string
		type: string
		name: string
		messageCount: number
	}

	type Account = {
		id: string
		email: string
		name: string
		picture: string
		provider: "gmail"
	}

	type ShortcutMode = "global" | "compose" | "search" | "email" | "dialog"
	type RecipientField = "to" | "cc" | "bcc"
}

export {}
