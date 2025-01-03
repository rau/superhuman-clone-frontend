import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog"
import { useFolderEmails, useFolders, useModifyLabels } from "@/hooks/dataHooks"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { getSelectedEmails } from "@/libs/emailUtils"
import { cn } from "@/libs/utils"
import { useEffect, useRef } from "react"

const MoveToDialog = () => {
	const {
		isMoveToDialogOpen,
		setIsMoveToDialogOpen,
		selectedFolder,
		selectedThreads,
		selectedIndices,
	} = useUIStore()
	const { data: folders } = useFolders()
	const { data: emails } = useFolderEmails()
	const { moveToDialogIndex, setMoveToDialogIndex } = useUIStore()
	const scrollRef = useRef<HTMLDivElement>(null)
	const { mutate: modifyLabels } = useModifyLabels()
	const selectedEmails = getSelectedEmails(
		selectedThreads,
		selectedFolder,
		selectedIndices,
		emails
	)

	useEffect(() => {
		setMoveToDialogIndex(0)
	}, [folders])

	const handleMove = (targetFolder: Folder) => {
		modifyLabels({
			threads: selectedEmails,
			addLabels: [targetFolder.id],
			removeLabels: [selectedFolder?.id || "INBOX"],
		})
		setIsMoveToDialogOpen(false)
	}

	const handleIndexChange = (newIndex: number) => {
		if (!folders?.length) return
		const cycledIndex = (newIndex + folders.length) % folders.length
		setMoveToDialogIndex(cycledIndex)

		const element = scrollRef.current?.children[cycledIndex] as HTMLElement
		element?.scrollIntoView({ block: "nearest" })
	}

	useKeyboardShortcuts([
		{
			key: "ArrowDown",
			handler: () => handleIndexChange(moveToDialogIndex + 1),
			mode: "dialog",
		},
		{
			key: "ArrowUp",
			handler: () => handleIndexChange(moveToDialogIndex - 1),
			mode: "dialog",
		},
		{
			key: "Enter",
			handler: () => {
				if (!folders?.length) return
				handleMove(folders[moveToDialogIndex])
			},
			mode: "dialog",
		},
	])

	return (
		<Dialog open={isMoveToDialogOpen} onOpenChange={setIsMoveToDialogOpen}>
			<DialogContent className="p-0" hideOverlay>
				<DialogHeader className="border-b border-slate-800 p-4">
					<DialogTitle>Move to ...</DialogTitle>
				</DialogHeader>

				<div className="w-full">
					<div
						ref={scrollRef}
						className="max-h-[400px] w-full overflow-y-auto [&::-webkit-scrollbar]:!w-0"
					>
						{folders?.map((folder, index) => (
							<div
								key={folder.id}
								className={cn(
									"flex w-full cursor-pointer items-center justify-between py-1.5 pl-4",
									moveToDialogIndex === index
										? "bg-blue-500/20"
										: "hover:bg-blue-500/10"
								)}
								onClick={() => {
									handleIndexChange(index)
									handleMove(folder)
								}}
							>
								<span className="text-sm text-black">
									{folder.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export { MoveToDialog }
