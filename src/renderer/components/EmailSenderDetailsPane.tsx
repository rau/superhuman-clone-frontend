import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { useUIStore } from "@/hooks/useUIStore"
import { formatSender } from "@/libs/stringOps"
import {
	Calendar,
	CircleHelp,
	Gift,
	Linkedin as LinkedinIcon,
	Mail as MailIcon,
	Settings,
	Twitter as TwitterIcon,
} from "lucide-react"
import { KeyboardTooltip } from "./KeyboardTooltip"

interface EmailSenderDetailsPaneProps {
	email: EmailThread | undefined
}

export const EmailSenderDetailsPane = ({
	email,
}: EmailSenderDetailsPaneProps) => {
	const { setIsSettingsOpen } = useUIStore()

	if (!email) return null

	return (
		<div className="flex h-full w-full flex-col gap-6 p-4">
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-row items-center gap-4">
					<Avatar>
						<AvatarFallback className="bg-blue-100 text-blue-700">
							{formatSender(
								email.messages[0].sender
							)[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">
							{formatSender(email.messages[0].sender)}
						</span>
						<span className="text-sm text-slate-500">
							{email.messages[0].sender.email}
						</span>
						<span className="mt-1 text-sm text-slate-400">
							CEO at Company
						</span>
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<LinkedinIcon className="h-4 w-4" />
				</button>
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<TwitterIcon className="h-4 w-4" />
				</button>
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<MailIcon className="h-4 w-4" />
				</button>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-sm font-medium text-slate-700">
					Previous Interactions
				</span>
				<div className="rounded-md bg-white p-3">
					<span className="text-sm text-slate-600">
						12 previous email threads
					</span>
				</div>
			</div>

			<div className="mt-auto flex flex-col">
				<Separator />

				<div className="flex flex-row items-center justify-between gap-2">
					<span className="text-sm font-medium text-slate-700">
						Superhuman
					</span>

					<div className="flex flex-row gap-0">
						<KeyboardTooltip
							tooltips={[
								{
									keys: ["?"],
									label: "Ask AI",
								},
							]}
						>
							<Button variant="ghost" size="icon">
								<span>AI</span>
							</Button>
						</KeyboardTooltip>
						<Button variant="ghost" size="icon">
							<Gift className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon">
							<CircleHelp className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon">
							<Calendar className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon">
							<Settings
								onClick={() => {
									setIsSettingsOpen(true)
								}}
								className="h-4 w-4"
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
