import { Switch } from "@/components/ui/Switch"
import { useUIStore } from "@/hooks/useUIStore"

export const SettingsPane = () => {
	const { setIsSettingsOpen, setIsShortcutsPaneOpen, setIsAISettingsOpen } =
		useUIStore()

	return (
		<div className="flex h-screen flex-col">
			<div className="flex-1 overflow-y-auto p-3">
				<h1 className="text-md pb-2">Settings</h1>

				<div className="flex flex-col gap-4">
					<div>
						<h2 className="mb-2 text-xs font-bold">
							Superhuman AI
						</h2>
						<p
							className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
							onClick={() => setIsAISettingsOpen(true)}
						>
							Write with AI
						</p>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">
							Superhuman for Sales
						</h2>
						<div className="flex flex-col gap-1">
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								HubSpot
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Pipedrive
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Salesforce
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">
							Learn Superhuman
						</h2>
						<div className="flex flex-col gap-1">
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsShortcutsPaneOpen(true)}
							>
								Shortcuts
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Start Tutorial
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Attend a Live Webinar
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Book 1:1 Coaching
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Get Started Guide
							</p>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Quick Tips
								</p>
								<Switch />
							</div>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">My Account</h2>
						<div className="flex flex-col gap-1">
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Add Accounts
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Edit Profile
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Calendars
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Theme
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Achievements
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Billing
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Triage</h2>
						<div className="flex flex-col gap-1">
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Get Me To Zero
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Bulk Actions
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Writing</h2>
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Autocomplete
								</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Autocorrect
								</p>
								<Switch />
							</div>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Emoji
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Signatures
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Workflow</h2>
						<div className="flex flex-col gap-1">
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Auto-Advance
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Auto-Bcc
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Blocked Senders
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Downloads
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Images
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
