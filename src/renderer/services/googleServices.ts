import { fetchWithAxios } from "@/libs/fetch"

export const initiateGoogleAuth = async () => {
	try {
		const { data } = await fetchWithAxios("auth/gmail/", {
			method: "GET",
		})
		console.log(data, "data")
		window.electron.openExternalUrl(data.auth_url)
	} catch (err) {
		console.error("Error initiating Google auth", err)
	}
}

export const fetchAuthTokens = async (): Promise<GoogleAuthToken[]> => {
	const { data } = await fetchWithAxios("tokens/", {
		method: "GET",
	})
	return data
}

export const fetchEmails = async (): Promise<EmailThread[]> => {
	const { data } = await fetchWithAxios("emails/", {
		method: "GET",
	})

	return data.map((email: any) => ({
		...email,
		date: new Date(email.date),
	}))
}

export const fetchContacts = async (): Promise<Contact[]> => {
	const { data } = await fetchWithAxios("contacts/", {
		method: "GET",
	})

	return data.map((contact: any) => ({
		...contact,
		lastInteraction: new Date(contact.lastInteraction),
	}))
}

interface SendEmailPayload {
	to: Contact[]
	cc: Contact[]
	bcc: Contact[]
	subject: string
	body: string
	attachments: Attachment[]
	replyToEmail?: EmailMessage
}

export const sendEmail = async (payload: SendEmailPayload) => {
	console.log("payload", payload)

	return fetchWithAxios("send-email/", {
		method: "POST",
		data: {
			to: payload.to.map((c) => c.email),
			cc: payload.cc.map((c) => c.email),
			bcc: payload.bcc.map((c) => c.email),
			subject: payload.subject,
			body: payload.body,
			attachments: payload.attachments,
			reply_to_email: payload.replyToEmail?.id,
		},
	})
}

export const searchEmails = async (query: string): Promise<EmailThread[]> => {
	const params = new URLSearchParams()

	const filters = {
		q: query.match(/(?!"[^"]*")[^\s:]+/g)?.[0] || "",
		from: query.match(/from:([^\s]+)/)?.[1] || "",
		to: query.match(/to:([^\s]+)/)?.[1] || "",
		subject: query.match(/subject:([^\s]+)/)?.[1] || "",
		in: query.match(/in:([^\s]+)/)?.[1] || "inbox",
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (value) params.append(key, value)
	})

	const { data } = await fetchWithAxios(`search/?${params.toString()}`, {
		method: "GET",
	})
	return data
}

export const markEmailDone = async (emailId: string) => {
	const { data } = await fetchWithAxios(`markdone/`, {
		method: "POST",
		data: { email_id: emailId },
	})
	return data
}

export const markEmailRead = async (emailId: string) => {
	const { data } = await fetchWithAxios(`markread/`, {
		method: "POST",
		data: { email_id: emailId },
	})
	return data
}
