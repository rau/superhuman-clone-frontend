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
	}

	type EmailMessage = {
		id: string
		thread_id: string
		subject: string
		sender: EmailSender
		to: EmailSender[]
		date: Date
		timestamp: number
		snippet: string
		read: boolean
	}

	type EmailSender = {
		email: string
		name?: string
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
}

export {}
