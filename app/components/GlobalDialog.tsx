"use client"

import { AccountPickerDialog } from "@/components/dialogs/AccountPickerDialog"
import { AISettingsDialog } from "@/components/dialogs/AISettingsDialog"
import { AutoAdvanceDialog } from "@/components/dialogs/AutoAdvanceDialog"
import { AutoBCCDialog } from "@/components/dialogs/AutoBCCDialog"
import { BlockedSendersDialog } from "@/components/dialogs/BlockedSendersDialog"
import { BulkActionsDialog } from "@/components/dialogs/BulkActionsDialog"
import { DownloadsDialog } from "@/components/dialogs/DownloadsDialog"
import { EmojiSkinColorDialog } from "@/components/dialogs/EmojiSkinColorDialog"
import { FileDialogOverlay } from "@/components/dialogs/FileDialogOverlay"
import { GetMeToZeroDialog } from "@/components/dialogs/GetMeToZeroDialog"
import { ImageSettingsDialog } from "@/components/dialogs/ImageSettingsDialog"
import { InstantIntroDialog } from "@/components/dialogs/InstantIntroDialog"
import { MeetingLinksDialog } from "@/components/dialogs/MeetingLinksDialog"
import { MoveToDialog } from "@/components/dialogs/MoveToDialog"
import { NotificationsDialog } from "@/components/dialogs/NotificationsDialog"
import { RemindersDialog } from "@/components/dialogs/RemindersDialog"
import { SignatureDialog } from "@/components/dialogs/SignatureDialog"
import { ThemeDialog } from "@/components/dialogs/ThemeDialog"

export const GlobalDialog = () => {
	return (
		<>
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
			<AccountPickerDialog />
			<FileDialogOverlay />
		</>
	)
}
