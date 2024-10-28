import { format } from "date-fns"
import { formatSender } from "@/libs/stringOps"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import {
	Linkedin as LinkedinIcon,
	Twitter as TwitterIcon,
	Mail as MailIcon,
} from "lucide-react"

interface EmailSenderDetailsPaneProps {
	email: Email | undefined
}

export const EmailSenderDetailsPane = ({
	email,
}: EmailSenderDetailsPaneProps) => {
	if (!email) return null

	return (
		<div className="flex h-full w-full flex-col gap-6 p-4">
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-row items-center gap-4">
					<Avatar>
						<AvatarFallback className="bg-blue-100 text-blue-700">
							{formatSender(email.sender)[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">
							{formatSender(email.sender)}
						</span>
						<span className="text-sm text-slate-500">
							{email.sender}
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
		</div>
	)
}
