import { useDiscardDraft } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useAIPromptStore } from "@/hooks/usePromptStore"
import { useUIStore } from "@/hooks/useUIStore"
import { sendEmail, useAddAttachment, useAddContact } from "@/libs/composeUtils"
import { filterContacts } from "@/libs/contactUtils"
import { useParams, usePathname, useRouter } from "next/navigation"
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
	const router = useRouter()
	const pathname = usePathname()
	const { draftId } = useParams()
	const { setShowAIPrompt, showAIPrompt } = useUIStore()
	const {
		showSuggestions,
		selectedContactIndex,
		setSelectedContactIndex,
		activeField,
		selectedContacts,
		setSelectedContacts,
		toQuery,
		ccQuery,
		bccQuery,
		selectedText,
		setSelectedText,
	} = useComposeStore()
	const {
		aiPromptMode,
		setAiPromptMode,
		setAiPrompt,
		setAiPromptEdit,
		showAIPromptContextMenu,
		setShowAIPromptContextMenu,
		isAiPromptLoading,
		setIsAiPromptLoading,
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
					setAiPromptMode("draft")
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
				router.push("/")
			},
		},
		{
			key: "Enter",
			handler: () => {
				if (
					pathname.includes("/compose") &&
					showSuggestions &&
					filteredContacts.length
				) {
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
				if (pathname.includes("/compose") && showSuggestions) {
					setSelectedContactIndex(
						(selectedContactIndex + 1) % filteredContacts.length
					)
				}
			},
		},
		{
			key: "ArrowUp",
			handler: () => {
				if (pathname.includes("/compose") && showSuggestions) {
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
				router.push("/")
				discardDraft([draftId as string]).then(() =>
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
				if (isAiPromptLoading) setIsAiPromptLoading(false)
				if (selectedText.start === selectedText.end && !showAIPrompt) {
					setShowAIPrompt(true)
					setAiPromptMode("draft")
				} else if (
					messageArea?.value.length > 0 &&
					selectedText.start !== selectedText.end
				) {
					setShowAIPrompt(true)
					setAiPromptMode("edit")
				} else {
					setShowAIPrompt(true)
					setAiPromptMode(aiPromptMode === "draft" ? "edit" : "draft")
				}
				setTimeout(() => {
					const promptInput = document.querySelector(
						"[data-ai-prompt]"
					) as HTMLElement
					promptInput?.focus()
				}, 100)
			},
			meta: true,
		},
	]

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			let handled = false

			shortcuts.forEach(({ key, handler, meta, shift, ctrl }) => {
				if (handled) return

				if (!pathname.includes("/compose")) return

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

					if (
						(e.key === "ArrowUp" || e.key === "ArrowDown") &&
						document.activeElement?.hasAttribute(
							"data-message-field"
						)
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
	}, [pathname, shortcuts, showSuggestions, aiPromptMode, selectedText])
}
