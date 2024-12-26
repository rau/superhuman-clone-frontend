import { SuperhumanFooter } from "@/components/SuperhumanFooter"
import { Switch } from "@/components/ui/Switch"
import { useUIStore } from "@/hooks/useUIStore"

export const SettingsPane = () => {
	const {
		isQuickTipsOpen,
		setIsSettingsOpen,
		setIsShortcutsPaneOpen,
		setIsAISettingsOpen,
		setIsQuickTipsOpen,
		setIsDownloadsOpen,
	} = useUIStore()

	// useEffect(() => {
	// 	const scrollable = document.getElementById("scrollingArea")
	// 	let timer: NodeJS.Timeout
	// 	let isScrolling = false

	// 	const handleScroll = () => {
	// 		if (!isScrolling) {
	// 			scrollable?.classList.add("scrolling")
	// 			isScrolling = true
	// 		}
	// 		clearTimeout(timer)
	// 		timer = setTimeout(() => {
	// 			scrollable?.classList.remove("scrolling")
	// 			isScrolling = false
	// 		}, 500)
	// 	}

	// 	scrollable?.addEventListener("scroll", handleScroll)
	// 	return () => {
	// 		scrollable?.removeEventListener("scroll", handleScroll)
	// 		clearTimeout(timer)
	// 	}
	// }, [])

	return (
		<div className="flex h-full flex-col p-3">
			<div className="flex-none">
				<h1 className="text-md pb-2">Settings</h1>
			</div>

			<div
				className="transition-[p adding] flex-1 overflow-y-auto py-2 duration-200"
				id="scrollingArea"
			>
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
								<Switch
									checked={isQuickTipsOpen}
									onCheckedChange={() => {
										setIsQuickTipsOpen(!isQuickTipsOpen)
									}}
								/>
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
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsDownloadsOpen(true)}
							>
								Downloads
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Images
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Instant Intro
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Meeting Links
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Notifications
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Reminders
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Advanced</h2>
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Backtick as Escape
								</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Send + Mark Done
								</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									RSVP + Mark Done
								</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Hide Comment Bar
								</p>
								<Switch />
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Show Sender Full Names
								</p>
								<Switch />
							</div>
						</div>
					</div>

					<div>
						<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
							Sign out
						</p>
					</div>
				</div>
			</div>

			<SuperhumanFooter />
		</div>
	)
}
