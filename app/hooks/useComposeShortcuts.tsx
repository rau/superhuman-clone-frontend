import { useDiscardDraft } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useAIPromptStore } from "@/hooks/usePromptStore"
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
	const { setIsComposing, isComposing, setShowAIPrompt, showAIPrompt } =
		useUIStore()
	const {
		showSuggestions,
		selectedContactIndex,
		setSelectedContactIndex,
		draftId,
		activeField,
		selectedContacts,
		setSelectedContacts,
		toQuery,
		ccQuery,
		bccQuery,
		selectedRange,
		setSelectedRange,
	} = useComposeStore()
	const {
		aiPromptMode,
		setAiPromptMode,
		setAiPrompt,
		setAiPromptEdit,
		showAIPromptContextMenu,
		setShowAIPromptContextMenu,
	} = useAIPromptStore()
	const { mutateAsync: discardDraft } = useDiscardDraft()

	const send = sendEmail(form)
	const addContact = useAddContact(form)
	const filteredContacts = filterContacts(form)

	const shortcuts: ShortcutConfig[] = [
		{
			key: "Escape",
			handler: () => {
				if (showAIPrompt) {
					setShowAIPrompt(false)
					setAiPrompt("")
					if (showAIPromptContextMenu) {
						setShowAIPromptContextMenu(false)
						setAiPromptEdit("")
					}
					return
				}

				const hasSelectedContacts = Object.values(
					selectedContacts
				).some((set) => set.size > 0)

				if (hasSelectedContacts) {
					setSelectedContacts("to", new Set())
					setSelectedContacts("cc", new Set())
					setSelectedContacts("bcc", new Set())
					return
				}
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
		{
			key: "a",
			handler: (e) => {
				const activeElement = document.activeElement
				const isFieldFocused =
					activeElement?.getAttribute("data-field") === activeField

				const query =
					activeField === "to"
						? toQuery
						: activeField === "cc"
							? ccQuery
							: bccQuery

				if (!isFieldFocused) {
					e.preventDefault()
					e.stopPropagation()
					return
				}

				if (isFieldFocused && query.length > 0) {
					// @ts-ignore
					activeElement?.select()
					e.stopPropagation()
					return
				}

				if (isFieldFocused) {
					const contacts = form.getValues(activeField)
					const emails = new Set(contacts.map((c) => c.email))
					setSelectedContacts(activeField, emails)
					e.preventDefault()
				}
			},
			meta: true,
		},
		{
			key: "j",
			handler: () => {
				const messageArea = document.querySelector(
					"[data-message-field]"
				) as HTMLTextAreaElement
				const hasSelectedText =
					(window.getSelection()?.toString().length ?? 0) > 0
				// console.log("messageArea", messageArea)
				const selection = window.getSelection()
				console.log("selection", selection)
				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0)
					const rect = range.getBoundingClientRect()
					console.log("rect", rect)
					setSelectedRange(rect.top, rect.bottom)
				}
				if (messageArea && !hasSelectedText) {
					messageArea.select()
				}
				if (showAIPrompt && messageArea?.value.length > 0) {
					setAiPromptMode(aiPromptMode === "draft" ? "edit" : "draft")
				} else if (showAIPrompt && hasSelectedText) {
					setAiPromptMode("edit")
				} else {
					setShowAIPrompt(true)
					setAiPromptMode("draft")
					setTimeout(() => {
						const promptInput = document.querySelector(
							"[data-ai-prompt]"
						) as HTMLElement
						// console.log(promptInput)
						promptInput?.focus()
					}, 100)
				}
			},
			meta: true,
		},
	]

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			let handled = false

			shortcuts.forEach(({ key, handler, meta, shift, ctrl }) => {
				if (handled) return

				if (!isComposing) return

				const metaMatch = meta ? e.metaKey : !e.metaKey
				const shiftMatch = shift ? e.shiftKey : !e.shiftKey
				const ctrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey

				if (
					e.key.toLowerCase() === key.toLowerCase() &&
					metaMatch &&
					shiftMatch &&
					ctrlMatch
				) {
					if (
						e.key === "a" &&
						meta &&
						!document.activeElement?.hasAttribute("data-field")
					) {
						return
					}

					e.preventDefault()
					e.stopPropagation()
					handler(e)
					handled = true
				}
			})
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isComposing, shortcuts, showSuggestions, aiPromptMode, selectedRange])
}
