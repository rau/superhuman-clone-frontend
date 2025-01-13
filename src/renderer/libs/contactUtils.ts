import { useContacts } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { UseFormReturn } from "react-hook-form"

export const filterContacts = (
	form: UseFormReturn<ComposeFormData>,
	maxResults = 5
) => {
	const { activeField, ccQuery, bccQuery, toQuery } = useComposeStore()
	const { data: contacts } = useContacts()
	const { getValues } = form
	let query = ""
	let existingContacts: EmailParticipant[] = []
	if (activeField === "to") {
		query = toQuery
		existingContacts = getValues("to")
	} else if (activeField === "cc") {
		query = ccQuery
		existingContacts = getValues("cc")
	} else if (activeField === "bcc") {
		query = bccQuery
		existingContacts = getValues("bcc")
	}

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
