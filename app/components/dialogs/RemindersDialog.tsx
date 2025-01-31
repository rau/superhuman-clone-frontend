import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import {
	NotificationsReminderBehavior,
	useSettingsStore,
} from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"

export const RemindersDialog = () => {
	const { isRemindersOpen, setIsRemindersOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog open={isRemindersOpen} onOpenChange={setIsRemindersOpen}>
			<DialogTitle hidden>Reminders</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-4">
					<h2 className="text-xl font-semibold">Reminders</h2>
					<div className="flex gap-2 text-xs text-slate-600">
						<p>When no time is specified, remind me at:</p>
						<p>TODO: INSERT TIME PICKER</p>
					</div>
					<div className="flex h-4">
						<p className="text-xs text-slate-600">
							By default, remind me:
						</p>
						<Select
							value={settings.notificationsReminderBehavior}
							onValueChange={(value) => {
								setSettings({
									notificationsReminderBehavior:
										value as NotificationsReminderBehavior,
								})
							}}
						>
							<SelectTrigger className="h-full w-fit border-none text-xs text-slate-600">
								<SelectValue>
									{settings.notificationsReminderBehavior ===
									NotificationsReminderBehavior.NO_REPLY
										? "if no reply"
										: settings.notificationsReminderBehavior ===
											  NotificationsReminderBehavior.REGARDLESS
											? "regardless"
											: settings.notificationsReminderBehavior}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="no-reply">
									No Reply
								</SelectItem>
								<SelectItem value="regardless">
									Regardless
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
