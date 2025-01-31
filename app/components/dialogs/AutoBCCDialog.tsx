import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { IconButton } from "@/components/ui/IconButton"
import { Input } from "@/components/ui/Input"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { TrashIcon } from "lucide-react"
import { useState } from "react"

export const AutoBCCDialog = () => {
	const { isAutoBCCDialogOpen, setIsAutoBCCDialogOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()
	const [autoBccEmail, setAutoBccEmail] = useState("")

	return (
		<Dialog
			open={isAutoBCCDialogOpen}
			onOpenChange={setIsAutoBCCDialogOpen}
		>
			<DialogTitle hidden>Auto-BCC</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold">Auto-BCC</h2>
					<p className="text-xs text-slate-800">
						Add an email to automatically BCC on all your outgoing
						emails.
					</p>
					<div className="flex h-fit flex-col gap-2">
						{Array.from(settings.autoBccEmails).map((email) => (
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
						))}
					</div>
					<Input
						placeholder="Enter an Auto-BCC address, e.g. 123@bcc.hubspot.com"
						value={autoBccEmail}
						onChange={(e) => setAutoBccEmail(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setSettings({
									autoBccEmails: new Set([
										...(settings.autoBccEmails || []),
										autoBccEmail,
									]),
								})
								setAutoBccEmail("")
							}
						}}
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}
