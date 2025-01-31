import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { TrashIcon } from "lucide-react"
import { IconButton } from "../ui/IconButton"

export const BlockedSendersDialog = () => {
	const { isBlockedSendersDialogOpen, setIsBlockedSendersDialogOpen } =
		useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog
			open={isBlockedSendersDialogOpen}
			onOpenChange={setIsBlockedSendersDialogOpen}
		>
			<DialogTitle hidden>Blocked Senders</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold">Blocked Senders</h2>
					{(settings.blockedSenders?.size || 0) === 0 && (
						<p className="text-xs text-slate-800">
							There are no blocked senders.
						</p>
					)}
					<div className="flex h-fit flex-col gap-2">
						{Array.from(settings.blockedSenders || []).map(
							(email) => (
								<div
									key={email}
									className="flex flex-row items-center justify-between"
								>
									<p className="text-xs font-semibold text-slate-800">
										{email}
									</p>
									<IconButton
										icon={TrashIcon}
										onClick={() => {
											setSettings({
												autoBccEmails: new Set(
													Array.from(
														settings.autoBccEmails
													).filter((e) => e !== email)
												),
											})
										}}
										size="sm"
									/>
								</div>
							)
						)}
					</div>
					<p className="text-xs text-slate-500">
						To block a sender, open a message from them, hit{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							⌘
						</kbd>{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							K
						</kbd>{" "}
						and Block.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
