import { fetchWithAxios } from "@/libs/fetch"

export const initiateGoogleAuth = async () => {
	try {
		const { data } = await fetchWithAxios("auth/gmail/", {
			method: "GET",
		})
		window.electron.openExternalUrl(data.auth_url)
	} catch (err) {
		console.error("Error initiating Google auth", err)
	}
}

export const fetchEmails = async (
	accountId: string
): Promise<EmailThread[]> => {
	const { data } = await fetchWithAxios("emails/", {
		method: "GET",
		accountId: accountId,
	})

	return data.map((email: any) => ({
		...email,
		date: new Date(email.date),
	}))
}

export const fetchContacts = async (accountId: string): Promise<Contact[]> => {
	const { data } = await fetchWithAxios("contacts/", {
		method: "GET",
		accountId: accountId,
	})

	return data.map((contact: any) => ({
		...contact,
		lastInteraction: new Date(contact.lastInteraction),
	}))
}

export interface SendEmailPayload {
	to: Contact[]
	cc: Contact[]
	bcc: Contact[]
	subject: string
	body: string
	attachments: Attachment[]
	replyToEmail?: EmailMessage
}

export const sendEmail = async (
	payload: SendEmailPayload,
	accountId: string
) => {
	return fetchWithAxios("send-email/", {
		method: "POST",
		accountId: accountId,
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

export const searchEmails = async (
	query: string,
	accountId: string
): Promise<EmailThread[]> => {
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
		accountId: accountId,
	})
	return data
}

export const markEmailDone = async (emailId: string, accountId: string) => {
	const { data } = await fetchWithAxios(`markdone/`, {
		method: "POST",
		accountId: accountId,
		data: { email_id: emailId },
	})
	return data
}

export const markEmailRead = async (emailId: string, accountId: string) => {
	const { data } = await fetchWithAxios(`markread/`, {
		method: "POST",
		accountId: accountId,
		data: { email_id: emailId },
	})
	return data
}

export const fetchFolders = async (accountId: string): Promise<Folder[]> => {
	const { data } = await fetchWithAxios("folders/", {
		method: "GET",
		accountId: accountId,
	})
	return data
}

export const fetchFolderEmails = async (
	folderId: string,
	accountId: string
): Promise<EmailThread[]> => {
	const { data } = await fetchWithAxios(
		`folder-emails/?folder_id=${folderId}`,
		{
			method: "GET",
			accountId: accountId,
		}
	)
	return data
}

export const createDoneFolder = async (accountId: string) => {
	const { data } = await fetchWithAxios("create-folder/", {
		method: "POST",
		accountId: accountId,
		data: { folder_name: "[SHClone] Done" },
	})
	return data
}

export const fetchAccounts = async (): Promise<Account[]> => {
	const { data } = await fetchWithAxios("accounts/", {
		method: "GET",
	})
	return data
}

export const signOutAccount = async (accountId: string) => {
	await fetchWithAxios(`tokens/${accountId}/`, {
		method: "DELETE",
	})
}
