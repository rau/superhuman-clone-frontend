import { EmailRow } from "@/components/EmailRow"
import { useEmails } from "@/hooks/dataHooks"
import { useEffect } from "react"
import { EmailSenderDetailsPane } from "./EmailSenderDetailsPane"

import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { Button } from "@/components/ui/Button"
import { useUIStore } from "@/hooks/useUIStore"
import { Pencil, Search } from "lucide-react"

const ComposeButton = ({ onClick }: { onClick: () => void }) => (
	<KeyboardTooltip keys={["C"]} label="New message" delayDuration={150}>
		<Button onClick={onClick} className="flex items-center gap-2">
			<span>Compose</span>
			<Pencil className="h-4 w-4" />
		</Button>
	</KeyboardTooltip>
)

const SearchButton = ({ onClick }: { onClick: () => void }) => (
	<KeyboardTooltip keys={["/"]} label="Search" delayDuration={150}>
		<Button
			onClick={onClick}
			variant="ghost"
			size="icon"
			className="hover:bg-transparent"
		>
			<Search className="h-4 w-4" />
		</Button>
	</KeyboardTooltip>
)

export const EmailsContainer = ({
	selectedIndex,
	setSelectedIndex,
}: {
	selectedIndex: number
	setSelectedIndex: (index: number) => void
}) => {
	const { data: emails } = useEmails()
	const { isComposing, setIsComposing, setIsSearching, setIsShowingEmail } =
		useUIStore()
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			console.log("e from emails container", e)
			if (!emails?.length || isComposing) return

			if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault()
				setIsShowingEmail(true)
			}

			if (e.key === "ArrowDown") {
				setSelectedIndex(Math.min(selectedIndex + 1, emails.length - 1))
			}
			if (e.key === "ArrowUp") {
				setSelectedIndex(Math.max(selectedIndex - 1, 0))
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [emails, isComposing, selectedIndex])

	return (
		<div className="flex flex-1">
			<div className="relative flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white p-4">
				<div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-semibold text-slate-900">
							Inbox
						</h2>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
							{emails?.length || 0}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchButton onClick={() => setIsSearching(true)} />
						<ComposeButton onClick={() => setIsComposing(true)} />
					</div>
				</div>

				<div className="flex-1 overflow-y-auto pt-2">
					{emails?.map((email, index) => (
						<EmailRow
							key={email.id}
							email={email}
							isSelected={index === selectedIndex}
							onClick={() => {
								setSelectedIndex(index)
								setIsShowingEmail(true)
							}}
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
