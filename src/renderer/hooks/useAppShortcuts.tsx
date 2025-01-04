import { ActionUndoToast } from "@/components/ActionUndoToast"
import {
	useAccounts,
	useFolderEmails,
	useMarkEmailDone,
	useMarkEmailRead,
	useSpamEmail,
	useStarEmail,
	useTrashEmail,
} from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { useUndo } from "@/hooks/useUndo"
import { getSelectedEmails } from "@/libs/emailUtils"
import { useEffect } from "react"
import { toast } from "react-toastify"

interface ShortcutConfig {
	key: string
	handler: (e: KeyboardEvent) => void | Promise<void>
	meta?: boolean
	shift?: boolean
	ctrl?: boolean
	mode: ShortcutMode
}

export const useAppShortcuts = () => {
	const {
		setIsSearching,
		setIsComposing,
		setIsShowingEmail,
		selectedFolder,
		selectedIndices,
		setSelectedIndex,
		selectedThreads,
		setSelectedThreads,
		setIsMoveToDialogOpen,
		isComposing,
		isSearching,
		isShowingEmail,
		isMoveToDialogOpen,
		toggleThreadSelection,
		moveToDialogIndex,
		setMoveToDialogIndex,
		selectedMessageIndex,
		setSelectedMessageIndex,
		setShowReplyPane,
		collapsedMessages,
		setCollapsedMessages,
	} = useUIStore()

	const { lastAction } = useEmailActionsStore()
	const { data: emails } = useFolderEmails()
	const { mutateAsync: markDone } = useMarkEmailDone()
	const { mutateAsync: starEmail } = useStarEmail()
	const { mutateAsync: markEmailRead } = useMarkEmailRead()
	const { mutateAsync: trashEmail } = useTrashEmail()
	const { mutateAsync: spamEmail } = useSpamEmail()
	const { data: accounts } = useAccounts()
	const { setSelectedAccountId } = useAccountStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const selectedEmail = emails?.[selectedIndex]
	const email = emails?.[selectedIndex]

	const { handleUndo } = useUndo()
	const selectedEmails = getSelectedEmails(
		selectedThreads,
		selectedFolder,
		selectedIndices,
		emails
	)

	const toggleMessage = (index: number) => {
		const next: Record<number, boolean> = { ...collapsedMessages }
		next[index] = !collapsedMessages[index]
		setCollapsedMessages(next)
	}

	const getCurrentMode = (): ShortcutMode => {
		if (isMoveToDialogOpen) return "dialog"
		if (isComposing) return "compose"
		if (isSearching) return "search"
		if (isShowingEmail) return "email"
		return "global"
	}

	const shortcuts: ShortcutConfig[] = [
		{
			key: "c",
			handler: () => setIsComposing(true),
			mode: "global",
		},
		{
			key: "Escape",
			handler: () => {
				if (!isShowingEmail) {
					const currentSelected =
						selectedThreads[selectedFolder?.id || "INBOX"]
					if (currentSelected?.size > 0) {
						setSelectedThreads(
							selectedFolder?.id || "INBOX",
							new Set()
						)
					}
				}
				setIsSearching(false)
				setIsComposing(false)
				setIsShowingEmail(false)
			},
			mode: "global",
		},
		{
			key: "/",
			handler: () => setIsSearching(true),
			mode: "global",
		},
		{
			key: "z",
			handler: () => {
				if (lastAction) {
					handleUndo()
				}
			},
			mode: "global",
			meta: true,
		},
		{
			key: "j",
			handler: () => {
				if (emails && selectedIndex < emails.length - 1) {
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						selectedIndex + 1
					)
				}
			},
			mode: "global",
		},
		{
			key: "k",
			handler: () => {
				if (selectedIndex > 0) {
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						selectedIndex - 1
					)
				}
			},
			mode: "global",
		},
		{
			key: "x",
			handler: () => {
				if (selectedEmail) {
					toggleThreadSelection(
						selectedFolder?.id || "INBOX",
						selectedEmail.id
					)
				}
			},
			mode: "global",
		},
		...(accounts?.map((account, index) => ({
			key: index.toString(),
			handler: () => setSelectedAccountId(account.id),
			mode: "global" as ShortcutMode,
			ctrl: true,
		})) || []),
		{
			key: "s",
			handler: () => {
				if (selectedEmails.length) {
					starEmail({
						emails_input: selectedEmails,
						star: !selectedEmails[0].starred,
					}).then(() => {
						toast(
							<ActionUndoToast
								action={
									selectedEmails[0].starred
										? "Unstarred"
										: "Starred"
								}
							/>,
							{
								className:
									"px-2 w-[400px] border border-purple-600/40",
								closeButton: false,
							}
						)
					})
				}
			},
			mode: "global",
		},
		{
			key: "e",
			handler: () => {
				if (selectedEmails.length) {
					markDone(selectedEmails).then(() => {
						toast(<ActionUndoToast action="Marked as Done" />, {
							className:
								"px-2 w-[400px] border border-purple-600/40",
							closeButton: false,
						})
					})
				}
			},
			mode: "global",
		},

		{
			key: "u",
			handler: () => {
				if (selectedEmails.length) {
					markEmailRead({
						emails_input: selectedEmails,
						read: !selectedEmails[0].messages[0].read,
					}).then(() => {
						toast(
							<ActionUndoToast
								action={
									selectedEmails[0].messages[0].read
										? "Marked as Unread"
										: "Marked as Read"
								}
							/>,
							{
								className:
									"px-2 w-[400px] border border-purple-600/40",
								closeButton: false,
							}
						)
					})
				}
			},
			mode: "global",
		},
		{
			key: "#",
			handler: () => {
				if (selectedEmails.length) {
					trashEmail({
						emails_input: selectedEmails,
						trash: true,
					}).then(() => {
						toast(<ActionUndoToast action="Moved to trash" />, {
							className:
								"px-2 w-[400px] border border-purple-600/40",
							closeButton: false,
						})
					})
				}
			},
			mode: "global",
			shift: true,
		},
		{
			key: "!",
			handler: () => {
				if (selectedEmails.length) {
					spamEmail({
						emails_input: selectedEmails,
						spam: true,
					}).then(() => {
						toast(<ActionUndoToast action="Marked as Spam" />, {
							className:
								"px-2 w-[400px] border border-purple-600/40",
							closeButton: false,
						})
					})
				}
			},
			mode: "global",
			shift: true,
		},
		{
			key: "Enter",
			handler: () => {
				if (isShowingEmail && collapsedMessages[selectedMessageIndex]) {
					const next = { ...collapsedMessages }
					next[selectedMessageIndex] = false
					setCollapsedMessages(next)
					return
				}
				setIsShowingEmail(true)
			},
			mode: "global",
		},
		{
			key: "ArrowDown",
			handler: () => {
				if (!emails?.length) return
				if (isShowingEmail) {
					setSelectedMessageIndex(
						Math.min(
							selectedMessageIndex + 1,
							(email?.messages?.length || 0) - 1
						)
					)
				} else {
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						Math.min(selectedIndex + 1, emails.length - 1)
					)
				}
			},
			mode: "global",
		},
		{
			key: "ArrowUp",
			handler: () => {
				if (!emails?.length) return
				if (isShowingEmail) {
					setSelectedMessageIndex(
						Math.max(selectedMessageIndex - 1, 0)
					)
				} else {
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						Math.max(selectedIndex - 1, 0)
					)
				}
			},
			mode: "global",
		},
		{
			key: "a",
			handler: () => {
				const allThreadIds = new Set(emails?.map((email) => email.id))
				const currentSelected =
					selectedThreads[selectedFolder?.id || "INBOX"]
				const allSelected = currentSelected?.size === emails?.length
				setSelectedThreads(
					selectedFolder?.id || "INBOX",
					allSelected ? new Set() : allThreadIds
				)
			},
			meta: true,
			shift: true,
			mode: "global",
		},
		{
			key: "a",
			handler: () => {
				if (!emails?.length) return
				const threadIds = new Set(
					emails.slice(selectedIndex).map((email) => email.id)
				)
				setSelectedThreads(selectedFolder?.id || "INBOX", threadIds)
			},
			meta: true,
			mode: "global",
		},
		{
			key: "v",
			handler: () => setIsMoveToDialogOpen(true),
			mode: "global",
		},
		{
			key: "n",
			handler: () => {
				setSelectedMessageIndex(
					Math.min(
						selectedMessageIndex + 1,
						(email?.messages?.length || 0) - 1
					)
				)
			},
			mode: "email",
		},
		{
			key: "p",
			handler: () => {
				setSelectedMessageIndex(Math.max(selectedMessageIndex - 1, 0))
			},
			mode: "email",
		},
		{
			key: "r",
			handler: () => setShowReplyPane(true),
			mode: "email",
		},
		{
			key: "Escape",
			handler: () => setIsShowingEmail(false),
			mode: "email",
		},
		{
			key: "o",
			handler: () => setCollapsedMessages({}),
			shift: true,
			mode: "email",
		},
		{
			key: "o",
			handler: () => toggleMessage(selectedMessageIndex),
			mode: "email",
		},
	]

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const currentMode = getCurrentMode()
			let handled = false

			shortcuts.forEach(({ key, handler, meta, shift, ctrl, mode }) => {
				if (handled) return
				if (
					mode !== currentMode &&
					(mode !== "global" || currentMode === "dialog")
				)
					return

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
	}, [
		isComposing,
		isSearching,
		isShowingEmail,
		isMoveToDialogOpen,
		shortcuts,
	])
}
