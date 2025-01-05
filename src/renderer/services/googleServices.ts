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

export const fetchContacts = async (accountId: string): Promise<Contact[]> => {
	const { data } = await fetchWithAxios("contacts/", {
		method: "GET",
		accountId: accountId,
	})

	const contactMap = new Map<string, Contact>()
	data.filter((contact: Contact) => contact.email.includes("@")).forEach(
		(contact: Contact) => {
			const email = contact.email.toLowerCase()
			const existing = contactMap.get(email)
			if (existing) {
				existing.interactionCount =
					(existing.interactionCount || 0) +
					(contact.interactionCount || 0)
				if (contact.name) {
					existing.name = contact.name
						.split(" ")
						.map(
							(word) =>
								word.charAt(0).toUpperCase() +
								word.slice(1).toLowerCase()
						)
						.join(" ")
				}
			} else {
				contactMap.set(email, {
					...contact,
					email,
					name: contact.name
						? contact.name
								.split(" ")
								.map(
									(word) =>
										word.charAt(0).toUpperCase() +
										word.slice(1).toLowerCase()
								)
								.join(" ")
						: undefined,
				})
			}
		}
	)

	return Array.from(contactMap.values())
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
		in: query.match(/in:([^\s]+)/)?.[1] || "INBOX",
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

export const markEmailDone = async (
	emails: EmailThread[],
	accountId: string
) => {
	await fetchWithAxios(`markdone/`, {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id) },
	})
	return emails
}

export const markEmailUndone = async (
	emails: EmailThread[],
	accountId: string
) => {
	const { data } = await fetchWithAxios(`markundone/`, {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id) },
	})
	return data
}

export const markEmailRead = (
	emails: EmailThread[],
	accountId: string,
	read: boolean
) =>
	fetchWithAxios("read/", {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id), read },
	})

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

export const starEmail = async (
	emails: EmailThread[],
	accountId: string,
	star: boolean
) => {
	await fetchWithAxios("star/", {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id), star },
	})
}

export const trashEmail = async (
	emails: EmailThread[],
	accountId: string,
	trash: boolean
) => {
	await fetchWithAxios("trash/", {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id), trash },
	})
}

export const spamEmail = async (
	emails: EmailThread[],
	accountId: string,
	spam: boolean
) => {
	await fetchWithAxios("spam/", {
		method: "POST",
		accountId: accountId,
		data: { email_ids: emails.map((e) => e.id), spam },
	})
}

export const modifyLabels = async (
	accountId: string,
	threads: EmailThread[],
	addLabels: string[],
	removeLabels: string[]
) => {
	await fetchWithAxios("modify-labels/", {
		method: "POST",
		accountId: accountId,
		data: {
			thread_ids: threads.map((t) => t.id),
			add_labels: addLabels,
			remove_labels: removeLabels,
		},
	})
}
