export const parseEmailBody = (body: string) => {
	const quoteContainer = body.match(
		/<div class="gmail_quote[^>]*>([\s\S]*?)<\/div>/i
	)

	if (quoteContainer) {
		const mainContent = body.slice(0, quoteContainer.index).trim()
		const quotedContent = quoteContainer[0]
		return { mainContent, quotedContent }
	}

	const quotePatterns = [
		/<blockquote[^>]*class="?gmail_quote"?[^>]*>/i,
		/^>+\s*/gm,
		/<hr[^>]*class="?gmail_quote"?[^>]*>/i,
		/On.*wrote:/i,
	]

	for (const pattern of quotePatterns) {
		const match = body.search(pattern)
		if (match !== -1) {
			return {
				mainContent: body.slice(0, match).trim(),
				quotedContent: body.slice(match).trim(),
			}
		}
	}

	return {
		mainContent: body,
		quotedContent: "",
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
	return participant.name || participant.email
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
