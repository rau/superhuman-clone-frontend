import { format } from "date-fns"

export const parseEmailBody = (html: string) => {
	const standardQuoteRegex = /<blockquote.*?>/i
	const standardMatch = html.match(standardQuoteRegex)

	const outlookDividerRegex =
		/<div style="border:none;border-top:solid #E1E1E1 1.0pt;padding:3.0pt 0in 0in 0in">/i
	const outlookMatch = html.match(outlookDividerRegex)

	const gmailQuoteRegex = /<div[^>]*class="[^"]*gmail_quote[^"]*"[^>]*>/i
	const gmailMatch = html.match(gmailQuoteRegex)

	const firstQuoteIndex = standardMatch?.index ?? Infinity
	const firstOutlookIndex = outlookMatch?.index ?? Infinity
	const firstGmailIndex = gmailMatch?.index ?? Infinity

	if (
		firstQuoteIndex === Infinity &&
		firstOutlookIndex === Infinity &&
		firstGmailIndex === Infinity
	) {
		return { mainContent: html, quotedContent: null }
	}

	const splitIndex = Math.min(
		firstQuoteIndex,
		firstOutlookIndex,
		firstGmailIndex
	)
	return {
		mainContent: html.slice(0, splitIndex),
		quotedContent: html.slice(splitIndex),
	}
}

export const formatRecipients = (message: EmailMessage) => {
	const recipients = [
		...(message.to?.to || []),
		...(message.to?.cc || []),
		...(message.to?.bcc || []),
	].map((recipient) =>
		recipient.is_me ? "Me" : recipient.name || recipient.email
	)

	if (recipients.length === 0) return ""
	if (recipients.length === 1) return `to ${recipients[0]}`
	if (recipients.length === 2)
		return `to ${recipients[0]} and ${recipients[1]}`

	return `to ${recipients[0]} and ${recipients.length - 1} others`
}

export const formatEmailParticipant = (participant: EmailParticipant) => {
	if (participant.is_me) return "Me"
	return participant.name?.split(" ")[0] || participant.email
}

export const getSelectedEmails = (
	selectedThreads: Record<string, Set<string>>,
	selectedFolder: Folder | null,
	selectedIndices: Record<string, number>,
	emails: EmailThread[] | undefined
): EmailThread[] => {
	const currentFolderId = selectedFolder?.id || "INBOX"

	if (selectedThreads[currentFolderId]?.size) {
		return Array.from(selectedThreads[currentFolderId])
			.map((id) => emails?.find((e) => e.id === id))
			.filter(Boolean) as EmailThread[]
	}

	const selectedEmail = emails?.[selectedIndices[currentFolderId] || 0]
	return selectedEmail ? [selectedEmail] : []
}

export const getDomainFromEmail = (email: string) => {
	return email.split("@")[1]
}

export const groupEmailsByDate = (emails: EmailThread[]) => {
	const today = new Date()
	const groups: { [key: string]: EmailThread[] } = {}

	emails?.forEach((email) => {
		const date = new Date(email.messages[email.messages.length - 1].date)
		const isToday = date.toDateString() === today.toDateString()

		let key = ""
		if (isToday) key = "Today"
		else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000))
			key = format(date, "MMMM do, yyyy")
		else if (date > new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
			key = format(date, "MMMM yyyy")
		else key = "Previous 3 months"

		groups[key] = [...(groups[key] || []), email]
	})

	return groups
}

export const mergeDraftsAndEmails = (
	drafts: EmailThread[],
	emails: EmailThread[]
): EmailThread[] => {
	return [...drafts, ...emails].sort(
		(a, b) => b.last_message_timestamp - a.last_message_timestamp
	)
}

export const formatSender = (sender: EmailParticipant) => {
	const match = sender.name?.match(/(.*?)\s*<(.+?)>/)
	if (!match) return sender.email

	const [_, name, email] = match
	return name.trim() || email
}

export const getUniqueSenderNames = (messages: EmailMessage[]): string => {
	const uniqueNames = new Set(
		messages
			.filter((m) => !m.sender.is_me)
			.map((m) => m.sender.name)
			.filter(Boolean)
	)

	if (uniqueNames.size === 0) return "Me"

	return uniqueNames.size >= 2
		? Array.from(uniqueNames)
				.map((name) => name?.split(" ")[0])
				.join(", ")
		: Array.from(uniqueNames).join(", ")
}

export const getUniqueSenderNamesForDraft = (
	messages: EmailMessage[]
): string => {
	return Array.from(messages[0].to?.to || [])
		.map((recipient) => recipient.name || recipient.email)
		.join(", ")
}
