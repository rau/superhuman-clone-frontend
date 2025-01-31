"use client"

import { ComposePaneOverlay } from "@/components/compose/ComposePaneOverlay"
import { AISettingsDialog } from "@/components/dialogs/AISettingsDialog"
import { AutoAdvanceDialog } from "@/components/dialogs/AutoAdvanceDialog"
import { AutoBCCDialog } from "@/components/dialogs/AutoBCCDialog"
import { BlockedSendersDialog } from "@/components/dialogs/BlockedSendersDialog"
import { BulkActionsDialog } from "@/components/dialogs/BulkActionsDialog"
import { DownloadsDialog } from "@/components/dialogs/DownloadsDialog"
import { EmojiSkinColorDialog } from "@/components/dialogs/EmojiSkinColorDialog"
import { GetMeToZeroDialog } from "@/components/dialogs/GetMeToZeroDialog"
import { ImageSettingsDialog } from "@/components/dialogs/ImageSettingsDialog"
import { InstantIntroDialog } from "@/components/dialogs/InstantIntroDialog"
import { MeetingLinksDialog } from "@/components/dialogs/MeetingLinksDialog"
import { MoveToDialog } from "@/components/dialogs/MoveToDialog"
import { NotificationsDialog } from "@/components/dialogs/NotificationsDialog"
import { RemindersDialog } from "@/components/dialogs/RemindersDialog"
import { SignatureDialog } from "@/components/dialogs/SignatureDialog"
import { ThemeDialog } from "@/components/dialogs/ThemeDialog"
import { EmailsContainer } from "@/components/EmailsContainer"
import { FileDialogOverlay } from "@/components/FileDialogOverlay"
import { SearchPane } from "@/components/SearchPane"
import { SignInPane } from "@/components/SignInPane"
import { TipBar } from "@/components/TipBar"
import { ViewEmailPane } from "@/components/ViewEmailPane"
import { useAccounts } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useAppShortcuts } from "@/hooks/useAppShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useEffect } from "react"

const Home = () => {
	const { data: accounts, isLoading } = useAccounts()
	const { setSelectedAccountId } = useAccountStore()
	const { isSignInOpen } = useUIStore()

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
			<EmojiSkinColorDialog />
			<ThemeDialog />
			<SignatureDialog />
			<GetMeToZeroDialog />
			<BulkActionsDialog />
			<AutoAdvanceDialog />
			<InstantIntroDialog />
			<AutoBCCDialog />
			<BlockedSendersDialog />
			<MeetingLinksDialog />
			<NotificationsDialog />
			<RemindersDialog />
			<MoveToDialog />
			<ComposePaneOverlay />
			<SearchPane />
			<ViewEmailPane />
			<FileDialogOverlay />
		</div>
	)
}

export { Home }
