import { useDiscardDraft } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { sendEmail, useAddAttachment, useAddContact } from "@/libs/composeUtils"
import { filterContacts } from "@/libs/contactUtils"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "react-toastify"

interface ShortcutConfig {
	key: string
	handler: (e: KeyboardEvent) => void | Promise<void>
	meta?: boolean
	shift?: boolean
	ctrl?: boolean
}

export const useComposeShortcuts = (form: UseFormReturn<ComposeFormData>) => {
	const { setIsComposing, isComposing } = useUIStore()
	const {
		showSuggestions,
		selectedContactIndex,
		setSelectedContactIndex,
		draftId,
	} = useComposeStore()
	const { mutateAsync: discardDraft } = useDiscardDraft()

	const send = sendEmail(form)
	const addContact = useAddContact(form)
	const filteredContacts = filterContacts(form)

	const shortcuts: ShortcutConfig[] = [
		{
			key: "Escape",
			handler: () => {
				setIsComposing(false)
			},
		},
		{
			key: "Enter",
			handler: () => {
				if (isComposing && showSuggestions && filteredContacts.length) {
					addContact(filteredContacts[selectedContactIndex])
					return
				}

				const { activeField, toQuery, ccQuery, bccQuery } =
					useComposeStore.getState()
				const query =
					activeField === "to"
						? toQuery
						: activeField === "cc"
							? ccQuery
							: bccQuery

				if (query && query.includes("@")) {
					addContact({
						email: query.toLowerCase(),
						name: query.toLowerCase(),
						is_me: false,
					})
				}
			},
		},
		{
			key: "ArrowDown",
			handler: () => {
				if (isComposing && showSuggestions) {
					setSelectedContactIndex(
						(selectedContactIndex + 1) % filteredContacts.length
					)
				}
			},
		},
		{
			key: "ArrowUp",
			handler: () => {
				if (isComposing && showSuggestions) {
					setSelectedContactIndex(
						(selectedContactIndex - 1 + filteredContacts.length) %
							filteredContacts.length
					)
				}
			},
		},
		{
			key: "b",
			handler: () => {
				const bccField = document.querySelector(
					"[data-bcc-field]"
				) as HTMLElement
				bccField?.focus()
			},
			meta: true,
			shift: true,
		},
		{
			key: "c",
			handler: () => {
				const ccField = document.querySelector(
					"[data-cc-field]"
				) as HTMLElement
				ccField?.focus()
			},
			meta: true,
			shift: true,
		},
		{
			key: ",",
			handler: () => {
				setIsComposing(false)
				discardDraft([draftId || ""]).then(() =>
					toast.success("Draft discarded")
				)
			},
			meta: true,
			shift: true,
		},
		{
			key: "u",
			handler: async () => {
				useAddAttachment(form)
			},
			meta: true,
			shift: true,
		},
		{
			key: "Enter",
			handler: () => {
				send()
			},
			meta: true,
		},
		{
			key: "Enter",
			handler: () => {
				send()
			},
			meta: true,
			shift: true,
		},
	]

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			let handled = false

			shortcuts.forEach(({ key, handler, meta, shift, ctrl }) => {
				if (handled) return

				const metaMatch = meta ? e.metaKey : !e.metaKey
				const shiftMatch = shift ? e.shiftKey : !e.shiftKey
				const ctrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey

				if (
					e.key.toLowerCase() === key.toLowerCase() &&
					metaMatch &&
					shiftMatch &&
					ctrlMatch
				) {
					e.preventDefault()
					e.stopPropagation()
					handler(e)
					handled = true
				}
			})
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isComposing, shortcuts, showSuggestions])
}
