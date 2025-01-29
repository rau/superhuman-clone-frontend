"use client"

import { ComposePaneOverlay } from "@/components/compose/ComposePaneOverlay"
import { AISettingsDialog } from "@/components/dialogs/AISettingsDialog"
import { DownloadsDialog } from "@/components/dialogs/DownloadsDialog"
import { ImageSettingsDialog } from "@/components/dialogs/ImageSettingsDialog"
import { MoveToDialog } from "@/components/dialogs/MoveToDialog"
import { ThemeDialog } from "@/components/dialogs/ThemeDialog"
import { EmailsContainer } from "@/components/EmailsContainer"
import { FileDialogOverlay } from "@/components/FileDialogOverlay"
import { SearchPane } from "@/components/SearchPane"
import { SignInPane } from "@/components/SignInPane"
import { TipBar } from "@/components/TipBar"
import { ViewEmailPane } from "@/components/ViewEmailPane"
import { useAccounts, useFolderEmails } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useAppShortcuts } from "@/hooks/useAppShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useEffect } from "react"

const Home = () => {
	const { data: accounts, isLoading } = useAccounts()
	const { data: emails } = useFolderEmails()
	const { setSelectedAccountId } = useAccountStore()
	const { isSignInOpen, isFileDialogOpen } = useUIStore()

	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setSelectedAccountId(accounts[0].id)
		}
	}, [accounts])

	useAppShortcuts()

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
			<AISettingsDialog />
			<DownloadsDialog />
			<ImageSettingsDialog />
			<ThemeDialog />
			<MoveToDialog />
			<ComposePaneOverlay />
			<SearchPane />
			<ViewEmailPane />
			<FileDialogOverlay />
		</div>
	)
}

export { Home }
