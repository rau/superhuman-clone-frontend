"use client"

import { ActionUndoToast } from "@/components/ActionUndoToast"
import { useSidebar } from "@/components/ui/Sidebar"
import {
	useAccounts,
	useFolderEmails,
	useFolders,
	useMarkEmailDone,
	useMarkEmailRead,
	useModifyLabels,
	useSpamEmail,
	useStarEmail,
	useTrashEmail,
} from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { useUndo } from "@/hooks/useUndo"
import { getSelectedEmails } from "@/libs/emailUtils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"

interface ShortcutConfig {
	key: string
	handler: (e: KeyboardEvent) => void | Promise<void>
	meta?: boolean
	shift?: boolean
	ctrl?: boolean
	mode: ShortcutMode
	disabledModes?: ShortcutMode[]
}

export const useAppShortcuts = () => {
	const {
		selectedFolder,
		selectedIndices,
		setSelectedIndex,
		selectedThreads,
		setSelectedThreads,
		setIsMoveToDialogOpen,
		isMoveToDialogOpen,
		toggleThreadSelection,
		moveToDialogIndex,
		setMoveToDialogIndex,
		selectedMessageIndex,
		setSelectedMessageIndex,
		setShowReplyPane,
		collapsedMessages,
		setCollapsedMessages,
		isAISettingsOpen,
		isShortcutsPaneOpen,
		isAutoBCCDialogOpen,
		isInstantIntroDialogOpen,
	} = useUIStore()

	const { lastAction } = useEmailActionsStore()
	const { data: emails } = useFolderEmails()
	const { data: folders } = useFolders()
	const { mutateAsync: markDone } = useMarkEmailDone()
	const { mutateAsync: starEmail } = useStarEmail()
	const { mutateAsync: markEmailRead } = useMarkEmailRead()
	const { mutateAsync: trashEmail } = useTrashEmail()
	const { mutateAsync: spamEmail } = useSpamEmail()
	const { mutate: modifyLabels } = useModifyLabels()
	const { data: accounts } = useAccounts()
	const { setSelectedAccountId } = useAccountStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const selectedEmail = emails?.[selectedIndex]
	const email = emails?.[selectedIndex]

	const { handleUndo } = useUndo()
	const { setOpen } = useSidebar()
	const selectedEmails = getSelectedEmails(
		selectedThreads,
		selectedFolder,
		selectedIndices,
		emails
	)

	const pathname = usePathname()
	const router = useRouter()

	const toggleMessage = (index: number) => {
		const next: Record<number, boolean> = { ...collapsedMessages }
		next[index] = !collapsedMessages[index]
		setCollapsedMessages(next)
	}

	const handleMove = (targetFolder: Folder) => {
		modifyLabels({
			threads: selectedEmails,
			addLabels: [targetFolder.id],
			removeLabels: [selectedFolder?.id || "INBOX"],
		})
		setIsMoveToDialogOpen(false)
	}

	const handleIndexChange = (newIndex: number) => {
		if (!folders?.length) return
		const cycledIndex = (newIndex + folders.length) % folders.length
		setMoveToDialogIndex(cycledIndex)

		const element = document.getElementById("move-to-dialog-scroll")
			?.children[cycledIndex] as HTMLElement
		element?.scrollIntoView({ block: "nearest" })
	}

	function isShowingEmail() {
		return pathname.includes("/email/")
	}

	const getCurrentMode = (): ShortcutMode => {
		if (isMoveToDialogOpen) return "dialog"
		if (pathname.includes("/compose")) return "compose"
		if (pathname.includes("/search")) return "search"
		if (pathname.includes("/email/")) return "email"
		return "global"
	}

	const shortcuts: ShortcutConfig[] = [
		{
			key: "c",
			handler: () => {
				router.push("/compose")
			},
			mode: "global",
			disabledModes: ["compose"],
		},
		{
			key: "Escape",
			handler: () => {
				if (!isShowingEmail()) {
					const currentSelected =
						selectedThreads[selectedFolder?.id || "INBOX"]
					if (currentSelected?.size > 0) {
						setSelectedThreads(
							selectedFolder?.id || "INBOX",
							new Set()
						)
					}
				}
				if (
					pathname.includes("/search") ||
					pathname.includes("/compose")
				) {
					router.push("/")
				}
				setOpen(false)
			},
			mode: "global",
		},
		{
			key: "/",
			handler: () => router.push("/search"),
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
		},
		{
			key: "Enter",
			handler: () => {
				if (isMoveToDialogOpen) {
					if (!folders?.length) return
					handleMove(folders[moveToDialogIndex])
					return
				}
				if (pathname.includes("/compose")) return
				if (
					isShowingEmail() &&
					collapsedMessages[selectedMessageIndex]
				) {
					const next = { ...collapsedMessages }
					next[selectedMessageIndex] = false
					setCollapsedMessages(next)
					return
				}
				if (emails?.[selectedIndex].is_draft) {
					router.push(`/compose/${emails[selectedIndex].id}`)
					return
				}
				router.push(`/email/${emails?.[selectedIndex].id}`)
			},
			mode: "global",
		},
		{
			key: "ArrowDown",
			handler: () => {
				if (isMoveToDialogOpen) {
					handleIndexChange(moveToDialogIndex + 1)
					return
				} else if (isShowingEmail()) {
					setSelectedMessageIndex(
						Math.min(
							selectedMessageIndex + 1,
							(email?.messages?.length || 0) - 1
						)
					)
				} else {
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						Math.min(selectedIndex + 1, (emails?.length || 0) - 1)
					)
				}
			},
			mode: "global",
		},
		{
			key: "ArrowUp",
			handler: () => {
				if (isMoveToDialogOpen) {
					handleIndexChange(moveToDialogIndex - 1)
					return
				} else if (isShowingEmail()) {
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
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
		},
		{
			key: "v",
			handler: () => setIsMoveToDialogOpen(true),
			mode: "global",
			disabledModes: ["compose"],
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
			disabledModes: ["compose"],
		},
		{
			key: "p",
			handler: () => {
				setSelectedMessageIndex(Math.max(selectedMessageIndex - 1, 0))
			},
			mode: "email",
			disabledModes: ["compose"],
		},
		{
			key: "r",
			handler: () => setShowReplyPane(true),
			mode: "email",
			disabledModes: ["compose"],
		},
		{
			key: "o",
			handler: () => setCollapsedMessages({}),
			shift: true,
			mode: "email",
			disabledModes: ["compose"],
		},
		{
			key: "o",
			handler: () => toggleMessage(selectedMessageIndex),
			mode: "email",
			disabledModes: ["compose"],
		},
	]

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const currentMode = getCurrentMode()
			let handled = false

			if (
				isAISettingsOpen ||
				isShortcutsPaneOpen ||
				isAutoBCCDialogOpen ||
				isInstantIntroDialogOpen
			) {
				return
			}

			console.log("key pressed", e.key)

			shortcuts.forEach(
				({ key, handler, meta, shift, ctrl, disabledModes = [] }) => {
					if (handled) return
					if (disabledModes.includes(currentMode)) return

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
				}
			)
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [
		isShowingEmail,
		isMoveToDialogOpen,
		shortcuts,
		isAISettingsOpen,
		isShortcutsPaneOpen,
		isAutoBCCDialogOpen,
		isInstantIntroDialogOpen,
		pathname,
	])
}
