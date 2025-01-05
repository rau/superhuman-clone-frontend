export const filterContacts = (
	contacts: Contact[] | undefined,
	query: string,
	existingContacts: Contact[],
	maxResults = 5
) => {
	return (
		contacts
			?.filter(
				(contact) =>
					!existingContacts.find((c) => c.email === contact.email) &&
					(contact.email
						.toLowerCase()
						.includes(query.toLowerCase()) ||
						(contact.name?.toLowerCase() ?? "").includes(
							query.toLowerCase()
						))
			)
			.slice(0, maxResults) || []
	)
}
