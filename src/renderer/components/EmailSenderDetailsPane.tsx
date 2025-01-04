import { SuperhumanFooter } from "@/components/SuperhumanFooter"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { getDomainFromEmail } from "@/libs/emailUtils"
import { formatSender } from "@/libs/stringOps"
import { Link, Mail } from "lucide-react"

interface EmailSenderDetailsPaneProps {
	email: EmailThread | undefined
}

export const EmailSenderDetailsPane = ({
	email,
}: EmailSenderDetailsPaneProps) => {
	if (!email) return null

	return (
		<div className="flex h-full w-full flex-col gap-6 p-3">
			<div className="flex w-full flex-col gap-4">
				<span className="text-sm">{email.messages[0].sender.name}</span>
				<div className="flex flex-row items-start gap-4">
					<Avatar className="h-10 w-10">
						<AvatarFallback className="bg-blue-100 text-blue-700">
							{formatSender(
								email.messages[0].sender
							)[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span className="text-xs font-medium text-slate-500">
						{email.messages[0].sender.email}
					</span>
				</div>
			</div>

			{/* <div className="flex gap-2">
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<Linkedin className="h-4 w-4" />
				</button>
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<Twitter className="h-4 w-4" />
				</button>
				<button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
					<Mail className="h-4 w-4" />
				</button>
			</div> */}

			<div className="flex flex-col gap-2">
				<div className="group flex items-center gap-2">
					<div className="rounded-full bg-slate-400 p-1 transition-colors group-hover:bg-slate-600">
						<Mail className="h-2 w-2 text-white" />
					</div>
					<span className="text-xs font-medium text-slate-600">
						Mail
					</span>
				</div>
				<p className="text-xs text-slate-500">
					Insert previous emails here
				</p>
			</div>

			<div
				className="group flex cursor-pointer items-center gap-2"
				onClick={() => {
					window.open(
						`https://${getDomainFromEmail(email.messages[0].sender.email)}`,
						"_blank"
					)
				}}
			>
				<div className="rounded-full bg-slate-400 p-1 transition-colors group-hover:bg-slate-600">
					<Link className="h-2 w-2 text-white" />
				</div>
				<span className="text-xs font-medium text-slate-600">
					{getDomainFromEmail(email.messages[0].sender.email)}
				</span>
			</div>

			<SuperhumanFooter />
		</div>
	)
}
