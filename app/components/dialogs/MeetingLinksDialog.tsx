import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import {
	MeetingLinksBehavior,
	useSettingsStore,
} from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import Link from "next/link"

export const MeetingLinksDialog = () => {
	const { isMeetingLinksOpen, setIsMeetingLinksOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog open={isMeetingLinksOpen} onOpenChange={setIsMeetingLinksOpen}>
			<DialogTitle hidden>Meeting Links</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-6">
					<h2 className="text-xl font-semibold">Meeting Links</h2>
					<RadioGroup
						defaultValue={settings.meetingLinksBehavior}
						className="flex flex-col gap-4"
						onValueChange={(value) => {
							setSettings({
								meetingLinksBehavior:
									value as MeetingLinksBehavior,
							})
						}}
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								value={MeetingLinksBehavior.AUTO_ZOOM}
								id="auto-zoom"
							/>
							<Label htmlFor="auto-zoom">
								Automatically add Zoom links to all new events
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								value={
									MeetingLinksBehavior.AUTO_MEETS_AND_TEAMS
								}
								id="auto-meets-and-teams"
							/>
							<Label htmlFor="auto-meets-and-teams">
								Automatically add Meets links to Google events
								and Teams links to Outlook events
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								value={MeetingLinksBehavior.DO_NOT}
								id="do-not"
							/>
							<Label htmlFor="do-not">
								Do not automatically add meeting links
							</Label>
						</div>
					</RadioGroup>
					<div className="flex items-center gap-2 text-xs text-slate-600">
						<p>Zoom account:</p>
						<Link href="https://zoom.us/signin">
							<p className="text-blue-500 hover:cursor-pointer">
								Sign in
							</p>
						</Link>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
