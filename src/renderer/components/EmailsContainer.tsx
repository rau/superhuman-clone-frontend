import { AISettingsDialog } from "@/components/AISettingsDialog"
import { DownloadsDialog } from "@/components/DownloadsDialog"
import { EmailRow } from "@/components/EmailRow"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { ImageSettingsDialog } from "@/components/ImageSettingsDialog"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { SettingsPane } from "@/components/SettingsPane"
import { ShortcutsPane } from "@/components/ShortcutsPane"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Loader } from "@/components/ui/Loader"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { useFolderEmails } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { cn } from "@/libs/utils"
import { Pencil, Search } from "lucide-react"
import { useEffect } from "react"
const ComposeButton = ({ onClick }: { onClick: () => void }) => (
	<KeyboardTooltip
		tooltips={[
			{
				keys: ["C"],
				label: "New message",
			},
		]}
		delayDuration={150}
	>
		<Button onClick={onClick} className="flex items-center gap-2">
			<span>Compose</span>
			<Pencil className="h-4 w-4" />
		</Button>
	</KeyboardTooltip>
)

const SearchButton = ({ onClick }: { onClick: () => void }) => (
	<KeyboardTooltip
		tooltips={[
			{
				keys: ["/"],
				label: "Search",
			},
		]}
		delayDuration={150}
	>
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

export const EmailsContainer = () => {
	const { data: emails, isLoading } = useFolderEmails()
	const {
		isComposing,
		setIsComposing,
		setIsSearching,
		setIsShowingEmail,
		selectedFolder,
		selectedIndices,
		setSelectedIndex,
		isSettingsOpen,
		isShortcutsPaneOpen,
		isQuickTipsOpen,
	} = useUIStore()

	const selectedIndex = selectedIndices[selectedFolder?.id || "inbox"] || 0

	useEffect(() => {
		setSelectedIndex(selectedFolder?.id || "inbox", 0)
	}, [selectedFolder])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!emails?.length || isComposing) return

			if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault()
				setIsShowingEmail(true)
			}

			if (e.key === "ArrowDown") {
				setSelectedIndex(
					selectedFolder?.id || "inbox",
					Math.min(selectedIndex + 1, emails.length - 1)
				)
			}
			if (e.key === "ArrowUp") {
				setSelectedIndex(
					selectedFolder?.id || "inbox",
					Math.max(selectedIndex - 1, 0)
				)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [emails, isComposing, selectedIndex, selectedFolder])

	const showEmptyState = !isLoading && (!emails || emails.length === 0)
	const showEmails = !isLoading && emails && emails.length > 0

	return (
		<div className="max-w-screen flex h-full w-screen flex-1">
			<div className="relative flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white p-4">
				<div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<h2 className="text-base font-semibold text-slate-900">
							{selectedFolder?.name || "Inbox"}
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
					{isLoading && (
						<div className="flex h-full items-center justify-center">
							<Loader className="h-8 w-8" />
						</div>
					)}
					{showEmptyState && <EmptyState />}
					{showEmails &&
						emails.map((email, index) => (
							<EmailRow
								key={email.id}
								email={email}
								isSelected={index === selectedIndex}
								onClick={() => {
									setSelectedIndex(
										selectedFolder?.id || "inbox",
										index
									)
									setIsShowingEmail(true)
								}}
							/>
						))}
				</div>
			</div>

			<div
				className={cn(
					"w-[400px] bg-slate-50",
					isQuickTipsOpen ? "h-[calc(100vh-40px)]" : "h-screen"
				)}
			>
				{isShortcutsPaneOpen ? (
					<ShortcutsPane />
				) : isSettingsOpen ? (
					<SettingsPane />
				) : (
					<EmailSenderDetailsPane email={emails?.[selectedIndex]} />
				)}
				<AISettingsDialog />
				<DownloadsDialog />
				<ImageSettingsDialog />
			</div>
		</div>
	)
}
