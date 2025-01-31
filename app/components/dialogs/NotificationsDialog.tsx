import { Checkbox } from "@/components/ui/Checkbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"

export const NotificationsDialog = () => {
	const { isNotificationsOpen, setIsNotificationsOpen } = useUIStore()
	return (
		<Dialog
			open={isNotificationsOpen}
			onOpenChange={setIsNotificationsOpen}
		>
			<DialogTitle hidden>Notifications</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-4">
					<h2 className="text-xl font-semibold">Notifications</h2>
					<div className="flex w-full flex-row justify-between">
						<div className="flex flex-col">
							<p className="text-xs font-semibold text-slate-700">
								Email notifications
							</p>
							<div className="flex flex-row items-center gap-1 text-xs text-slate-500">
								<p>If Important</p>
								<p>•</p>
								<p>Other is on, notify for Important only</p>
							</div>
						</div>
						<Checkbox />
					</div>
					<div className="flex w-full flex-row justify-between">
						<div className="flex flex-col">
							<p className="text-xs font-semibold text-slate-700">
								Event notifications
							</p>
							<p>
								TODO: LOAD ALL CALENDARS IN AND PUT CHECKBOXES
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
