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

	type Email = {
		id: string
		subject: string
		sender: string
		date: Date
		snippet: string
		body: string
		read: boolean
	}
}

export {}
