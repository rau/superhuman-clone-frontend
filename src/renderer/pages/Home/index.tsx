// React/Next
// Components
// Hooks
// Libraries
// Icons
// Types

import { AISettingsDialog } from "@/components/AISettingsDialog"
import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { DownloadsDialog } from "@/components/DownloadsDialog"
import { EmailsContainer } from "@/components/EmailsContainer"
import { ImageSettingsDialog } from "@/components/ImageSettingsDialog"
import { SearchPane } from "@/components/SearchPane"
import { SignInPane } from "@/components/SignInPane"
import { ThemeDialog } from "@/components/ThemeDialog"
import { TipBar } from "@/components/TipBar"
import { ActionUndoToast } from "@/components/ui/ActionUndoToast"
import { ViewEmailPane } from "@/components/ViewEmailPane"
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
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useUndo } from "@/hooks/useUndo"
import { useEffect } from "react"
import { toast } from "react-toastify"
export default function Home() {
	const { data: accounts, isLoading } = useAccounts()
	const { data: emails } = useFolderEmails()
	const { setSelectedAccountId } = useAccountStore()
	const {
		setIsComposing,
		isSignInOpen,
		setIsSearching,
		setIsShowingEmail,
		selectedFolder,
		selectedIndices,
		setSelectedIndex,
	} = useUIStore()
	const { mutateAsync: markDone } = useMarkEmailDone()
	const { handleUndo } = useUndo()
	const selectedIndex = selectedIndices[selectedFolder?.id || "inbox"] || 0
	const selectedEmail = emails?.[selectedIndex]
	const { lastAction } = useEmailActionsStore()
	const { mutateAsync: starEmail } = useStarEmail()
	const { mutateAsync: markEmailRead } = useMarkEmailRead()
	const { mutateAsync: trashEmail } = useTrashEmail()
	const { mutateAsync: spamEmail } = useSpamEmail()

	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setSelectedAccountId(accounts[0].id)
		}
	}, [accounts])

	useKeyboardShortcuts([
		{
			key: "c",
			handler: () => setIsComposing(true),
			mode: "global",
		},
		{
			key: "/",
			handler: () => setIsSearching(true),
			mode: "global",
		},
		{
			key: "Escape",
			handler: () => {
				setIsSearching(false)
				setIsComposing(false)
				setIsShowingEmail(false)
			},
			mode: "global",
		},
		{
			key: "e",
			handler: () => {
				if (selectedEmail) {
					markDone(selectedEmail).then(() => {
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
						selectedFolder?.id || "inbox",
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
						selectedFolder?.id || "inbox",
						selectedIndex - 1
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
				if (selectedEmail) {
					starEmail({
						email: selectedEmail,
						star: !selectedEmail.starred,
					}).then(() => {
						toast(
							<ActionUndoToast
								action={
									selectedEmail.starred
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
			key: "u",
			handler: () => {
				if (selectedEmail) {
					markEmailRead({
						email: selectedEmail,
						read: !selectedEmail.messages[0].read,
					}).then(() => {
						toast(
							<ActionUndoToast
								action={
									selectedEmail.messages[0].read
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
				if (selectedEmail) {
					trashEmail({
						email: selectedEmail,
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
				if (selectedEmail) {
					spamEmail({
						email: selectedEmail,
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
	])

	if (isLoading) {
		return null
	}

	if (accounts?.length === 0 || isSignInOpen) {
		return <SignInPane />
	}

	console.log(emails)

	return (
		<div className="relative flex h-screen flex-col">
			<main className="flex h-full flex-1 flex-col">
				<EmailsContainer />
				<TipBar />
			</main>
			<AISettingsDialog />
			<DownloadsDialog />
			<ImageSettingsDialog />
			<ThemeDialog />

			<ComposePaneOverlay />
			<SearchPane />
			<ViewEmailPane />
		</div>
	)
}
