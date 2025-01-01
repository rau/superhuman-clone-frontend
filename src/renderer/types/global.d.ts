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
	}

	type EmailParticipant = {
		email: string
		name?: string
		is_me: boolean
	}

	type EmailParticipants = {
		bcc?: EmailParticipant[]
		cc?: EmailParticipant[]
		to?: EmailParticipant[]
	}

	type Contact = {
		email: string
		name?: string
		interactionCount?: number
		lastInteraction?: Date
	}

	type Attachment = {
		name: string
		size: number
		path: string
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

	type ShortcutMode = "global" | "compose" | "search" | "email"
}

export {}
