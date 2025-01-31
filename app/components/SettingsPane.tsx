import { SuperhumanFooter } from "@/components/SuperhumanFooter"
import { Switch } from "@/components/ui/Switch"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import Link from "next/link"
import { useEffect } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"

export const SettingsPane = () => {
	const {
		setIsShortcutsPaneOpen,
		setIsAISettingsOpen,
		setIsDownloadsOpen,
		setIsImageSettingsOpen,
		setIsAccountDialogOpen,
		setIsThemeDialogOpen,
		setIsEmojiSkinColorOpen,
		setIsGetMeToZeroOpen,
		setIsBulkActionsOpen,
		setIsAutoAdvanceDialogOpen,
		setIsSignatureDialogOpen,
		setIsAutoBCCDialogOpen,
		setIsBlockedSendersDialogOpen,
		setIsInstantIntroDialogOpen,
		setIsMeetingLinksOpen,
	} = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	useEffect(() => {
		const scrollable = document.getElementById("scrollingArea")
		let timer: NodeJS.Timeout
		let isScrolling = false

		const handleScroll = () => {
			if (!isScrolling) {
				scrollable?.classList.add("scrolling")
				isScrolling = true
			}
			clearTimeout(timer)
			timer = setTimeout(() => {
				scrollable?.classList.remove("scrolling")
				isScrolling = false
			}, 500)
		}

		scrollable?.addEventListener("scroll", handleScroll)
		return () => {
			scrollable?.removeEventListener("scroll", handleScroll)
			clearTimeout(timer)
		}
	}, [])

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
							<Link
								href="https://help.superhuman.com/article/580-superhuman-fundamentals"
								target="_blank"
							>
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Get Started Guide
								</p>
							</Link>
							<Tooltip delayDuration={300}>
								<TooltipTrigger>
									<div
										className="flex cursor-pointer items-center justify-between"
										onClick={() =>
											setSettings({
												isQuickTipsOpen:
													!settings.isQuickTipsOpen,
											})
										}
									>
										<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
											Quick Tips
										</p>
										<Switch
											variant="small"
											checked={settings.isQuickTipsOpen}
											onCheckedChange={() => {
												setSettings({
													isQuickTipsOpen:
														!settings.isQuickTipsOpen,
												})
											}}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent side="left">
									Show the Quick Tips bar and learn common
									shortcuts to work twice as fast.
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">My Account</h2>
						<div className="flex flex-col gap-1">
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsAccountDialogOpen(true)}
							>
								Add Accounts
							</p>
							<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
								Calendars
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsThemeDialogOpen(true)}
							>
								Theme
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Triage</h2>
						<div className="flex flex-col gap-1">
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsGetMeToZeroOpen(true)}
							>
								Get Me To Zero
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsBulkActionsOpen(true)}
							>
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
								<Switch
									variant="small"
									checked={settings.autocomplete}
									onCheckedChange={() => {
										setSettings({
											autocomplete:
												!settings.autocomplete,
										})
									}}
								/>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Autocorrect
								</p>
								<Switch
									variant="small"
									checked={settings.autocorrect}
									onCheckedChange={() => {
										setSettings({
											autocorrect: !settings.autocorrect,
										})
									}}
								/>
							</div>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsEmojiSkinColorOpen(true)}
							>
								Emoji
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsSignatureDialogOpen(true)}
							>
								Signatures
							</p>
						</div>
					</div>

					<div>
						<h2 className="mb-2 text-xs font-bold">Workflow</h2>
						<div className="flex flex-col gap-1">
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsAutoAdvanceDialogOpen(true)}
							>
								Auto-Advance
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsAutoBCCDialogOpen(true)}
							>
								Auto-Bcc
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() =>
									setIsBlockedSendersDialogOpen(true)
								}
							>
								Blocked Senders
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsDownloadsOpen(true)}
							>
								Downloads
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsImageSettingsOpen(true)}
							>
								Images
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() =>
									setIsInstantIntroDialogOpen(true)
								}
							>
								Instant Intro
							</p>
							<p
								className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
								onClick={() => setIsMeetingLinksOpen(true)}
							>
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
								<Switch
									variant="small"
									checked={settings.backtickAsEscape}
									onCheckedChange={() => {
										setSettings({
											backtickAsEscape:
												!settings.backtickAsEscape,
										})
									}}
								/>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Send + Mark Done
								</p>
								<Switch
									variant="small"
									checked={settings.sendAndMarkDone}
									onCheckedChange={() => {
										setSettings({
											sendAndMarkDone:
												!settings.sendAndMarkDone,
										})
									}}
								/>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									RSVP + Mark Done
								</p>
								<Switch
									variant="small"
									checked={settings.rsvpAndMarkDone}
									onCheckedChange={() => {
										setSettings({
											rsvpAndMarkDone:
												!settings.rsvpAndMarkDone,
										})
									}}
								/>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
									Show Sender Full Names
								</p>
								<Switch
									variant="small"
									checked={settings.showSenderFullNames}
									onCheckedChange={() => {
										setSettings({
											showSenderFullNames:
												!settings.showSenderFullNames,
										})
									}}
								/>
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
