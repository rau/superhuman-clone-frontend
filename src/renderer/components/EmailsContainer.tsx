import { useEmails } from "@/hooks/dataHooks"
import { EmailRow } from "@/components/EmailRow"
import { useState, useEffect } from "react"
import { EmailSenderDetailsPane } from "./EmailSenderDetailsPane"

export const EmailsContainer = () => {
	const { data: emails } = useEmails()
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!emails?.length) return

			if (e.key === "ArrowDown") {
				setSelectedIndex((prev) =>
					Math.min(prev + 1, emails.length - 1)
				)
			}
			if (e.key === "ArrowUp") {
				setSelectedIndex((prev) => Math.max(prev - 1, 0))
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [emails])

	return (
		<div className="flex flex-1">
			<div className="flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white p-4">
				<div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-semibold text-slate-900">
							Inbox
						</h2>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
							{emails?.length || 0}
						</span>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto pt-2">
					{emails?.map((email, index) => (
						<EmailRow
							key={email.id}
							email={email}
							isSelected={index === selectedIndex}
							onClick={() => setSelectedIndex(index)}
						/>
					))}
				</div>
			</div>
			<div className="w-[400px] bg-slate-50 p-6">
				<EmailSenderDetailsPane email={emails?.[selectedIndex]} />
			</div>
		</div>
	)
}
