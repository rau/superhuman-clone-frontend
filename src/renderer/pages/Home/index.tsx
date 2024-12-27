// React/Next
// Components
// Hooks
// Libraries
// Icons
// Types

import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { EmailsContainer } from "@/components/EmailsContainer"
import { SearchPane } from "@/components/SearchPane"
import { SignInPane } from "@/components/SignInPane"
import { TipBar } from "@/components/TipBar"
import { ViewEmailPane } from "@/components/ViewEmailPane"
import {
	useAccounts,
	useFolderEmails,
	useMarkEmailDone,
} from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useEffect } from "react"

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
	} = useUIStore()
	const { mutate: markDone } = useMarkEmailDone()

	const selectedIndex = selectedIndices[selectedFolder?.id || "inbox"] || 0
	const selectedEmail = emails?.[selectedIndex]
	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setSelectedAccountId(accounts[0].id)
		}
	}, [accounts])

	console.log(emails)

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
				if (selectedEmail?.id) {
					console.log("marking email done", selectedEmail.id)
					markDone(selectedEmail.id)
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
	])

	if (isLoading) {
		return null
	}

	if (accounts?.length === 0 || isSignInOpen) {
		return <SignInPane />
	}

	return (
		<div className="relative flex h-screen flex-col">
			<main className="flex h-full flex-1 flex-col">
				<EmailsContainer />
				<TipBar />
			</main>

			<ComposePaneOverlay />
			<SearchPane />
			<ViewEmailPane />
		</div>
	)
}
