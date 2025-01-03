import { EmailRow } from "@/components/EmailRow"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { SettingsPane } from "@/components/SettingsPane"
import { ShortcutsPane } from "@/components/ShortcutsPane"
import { EmptyState } from "@/components/ui/EmptyState"
import { Loader } from "@/components/ui/Loader"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { useFolderEmails } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { cn } from "@/libs/utils"
import { Pencil, Search, Square, SquareCheckBig } from "lucide-react"
import { useEffect } from "react"

const SelectAllButton = () => {
	const { selectedFolder, selectedThreads, setSelectedThreads } = useUIStore()
	const { data: emails } = useFolderEmails()

	return (
		<KeyboardTooltip
			tooltips={[
				{
					keys: ["⌘", "shift", "A"],
					label: "Select all",
				},
				{
					keys: ["⌘", "A"],
					label: "Select all from here",
				},
			]}
		>
			<button
				onClick={() => {
					const allThreadIds = new Set(
						emails?.map((email) => email.id)
					)
					const currentSelected =
						selectedThreads[selectedFolder?.id || "INBOX"]
					const allSelected = currentSelected?.size === emails?.length
					setSelectedThreads(
						selectedFolder?.id || "INBOX",
						allSelected ? new Set() : allThreadIds
					)
				}}
				className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100"
			>
				{selectedThreads[selectedFolder?.id || "INBOX"]?.size ===
				emails?.length ? (
					<SquareCheckBig className="h-4 w-4 text-slate-600" />
				) : (
					<Square className="h-4 w-4 text-slate-600" />
				)}
			</button>
		</KeyboardTooltip>
	)
}

const ComposeButton = () => {
	const { setIsComposing } = useUIStore()

	return (
		<KeyboardTooltip
			tooltips={[
				{
					keys: ["C"],
					label: "New message",
				},
			]}
			delayDuration={150}
		>
			<Pencil
				className="h-4 w-4 text-slate-400 transition-colors duration-100 hover:cursor-pointer hover:text-slate-900"
				onClick={() => setIsComposing(true)}
			/>
		</KeyboardTooltip>
	)
}

const SearchButton = () => {
	const { setIsSearching } = useUIStore()

	return (
		<KeyboardTooltip
			tooltips={[
				{
					keys: ["/"],
					label: "Search",
				},
			]}
			delayDuration={150}
		>
			<Search
				className="h-4 w-4 text-slate-400 transition-colors duration-100 hover:cursor-pointer hover:text-slate-900"
				onClick={() => setIsSearching(true)}
			/>
		</KeyboardTooltip>
	)
}

export const EmailsContainer = () => {
	const { data: emails, isLoading } = useFolderEmails()
	const {
		setIsShowingEmail,
		selectedFolder,
		selectedIndices,
		setSelectedIndex,
		isSettingsOpen,
		isShortcutsPaneOpen,
		isQuickTipsOpen,
		selectedThreads,
	} = useUIStore()

	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const hasSelectedThreads =
		selectedThreads[selectedFolder?.id || "INBOX"]?.size > 0

	useEffect(() => {
		setSelectedIndex(selectedFolder?.id || "INBOX", 0)
	}, [selectedFolder])

	const showEmptyState = !isLoading && (!emails || emails.length === 0)
	const showEmails = !isLoading && emails && emails.length > 0

	return (
		<div className="max-w-screen flex h-full w-screen flex-1">
			<div className="relative flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white p-4">
				<div className="flex h-14 items-center justify-between px-4">
					<div className="flex items-center gap-2">
						{hasSelectedThreads ? (
							<SelectAllButton />
						) : (
							<SidebarTrigger />
						)}
						<h2 className="text-base font-semibold normal-case text-slate-900">
							{selectedFolder?.name || "Inbox"}
						</h2>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
							{emails?.length || 0}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<ComposeButton />
						<SearchButton />
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
										selectedFolder?.id || "INBOX",
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
				{isShortcutsPaneOpen || hasSelectedThreads ? (
					<ShortcutsPane />
				) : isSettingsOpen ? (
					<SettingsPane />
				) : (
					<EmailSenderDetailsPane email={emails?.[selectedIndex]} />
				)}
			</div>
		</div>
	)
}
