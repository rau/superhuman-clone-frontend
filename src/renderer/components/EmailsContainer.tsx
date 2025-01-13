import { EmailRow } from "@/components/EmailRow"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { SettingsPane } from "@/components/SettingsPane"
import { ShortcutsPane } from "@/components/ShortcutsPane"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconButton } from "@/components/ui/IconButton"
import { Loader } from "@/components/ui/Loader"
import { useSidebar } from "@/components/ui/Sidebar"
import { useFolderEmails } from "@/hooks/dataHooks"
import { useThemeStore } from "@/hooks/useThemeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { groupEmailsByDate } from "@/libs/emailUtils"
import { cn } from "@/libs/utils"
import { Menu, Pencil, Search, Square, SquareCheckBig } from "lucide-react"
import { useEffect } from "react"

const SelectAllButton = () => {
	const { selectedFolder, selectedThreads, setSelectedThreads } = useUIStore()
	const { data: emails } = useFolderEmails()

	return (
		<IconButton
			icon={
				selectedThreads[selectedFolder?.id || "INBOX"]?.size ===
				emails?.length
					? SquareCheckBig
					: Square
			}
			onClick={() => {
				const allThreadIds = new Set(emails?.map((email) => email.id))
				const currentSelected =
					selectedThreads[selectedFolder?.id || "INBOX"]
				const allSelected = currentSelected?.size === emails?.length
				setSelectedThreads(
					selectedFolder?.id || "INBOX",
					allSelected ? new Set() : allThreadIds
				)
			}}
			keyboardShortcuts={[
				{
					keys: ["⌘", "shift", "A"],
					label: "Select all",
				},
				{
					keys: ["⌘", "A"],
					label: "Select all from here",
				},
			]}
		/>
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
		setIsComposing,
		setIsSearching,
	} = useUIStore()
	const { toggleSidebar } = useSidebar()
	const { theme } = useThemeStore()

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
			<div className="relative flex flex-1 flex-col overflow-hidden border-r border-slate-200 bg-background">
				<div className="flex items-center justify-between pb-2 pr-4 pt-4">
					<div className="flex items-center gap-2">
						<div className="w-10 pl-4">
							{hasSelectedThreads ? (
								<SelectAllButton />
							) : (
								<IconButton
									icon={Menu}
									onClick={() => toggleSidebar()}
									tooltipLabel="Folders"
								/>
							)}
						</div>
						<div className="flex items-baseline gap-2">
							<span className="text-sm font-medium text-slate-700">
								{(selectedFolder?.name || "inbox")
									.toLowerCase()
									.charAt(0)
									.toUpperCase() +
									(
										selectedFolder?.name.toLowerCase() ||
										"inbox"
									).slice(1)}
							</span>
							<span className="text-xs text-slate-400">
								{emails?.length || 0}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<IconButton
							icon={Pencil}
							onClick={() => setIsComposing(true)}
							keyboardShortcuts={[
								{
									keys: ["C"],
									label: "New message",
								},
							]}
						/>
						<IconButton
							icon={Search}
							onClick={() => setIsSearching(true)}
							keyboardShortcuts={[
								{
									keys: ["/"],
									label: "Search",
								},
							]}
						/>
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
						Object.entries(groupEmailsByDate(emails)).map(
							([date, groupEmails]) => (
								<div key={date}>
									{date !== "Today" && (
										<>
											<div className="flex w-full flex-row pb-2 pt-2">
												<div className="h-px w-[4.25rem] pt-2" />
												<span className="text-xs text-slate-400">
													{date}
												</span>
											</div>
										</>
									)}
									{groupEmails.map((email, index) => (
										<EmailRow
											key={email.id}
											email={email}
											isSelected={
												emails.indexOf(email) ===
												selectedIndex
											}
										/>
									))}
								</div>
							)
						)}
				</div>
			</div>

			<div
				className={cn(
					"w-1/5 bg-[#FBFDFF]",
					isQuickTipsOpen ? "h-[calc(100vh-20px)]" : "h-screen"
				)}
			>
				{isShortcutsPaneOpen ? (
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
