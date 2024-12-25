import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/Sidebar"
import { useCreateDoneFolder, useFolders } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { ChevronRight } from "lucide-react"

const SYSTEM_FOLDERS = [
	{
		id: "inbox",
		name: "Inbox",
		type: "system",
		messageCount: 0,
	},
	{
		id: "starred",
		name: "Starred",
		type: "system",
		messageCount: 0,
	},
	{
		id: "drafts",
		name: "Drafts",
		type: "system",
		messageCount: 0,
	},
	{ id: "sent", name: "Sent", type: "system", messageCount: 0 },
	{
		id: "scheduled",
		name: "Scheduled",
		type: "system",
		messageCount: 0,
	},
	{
		id: "snippets",
		name: "Snippets",
		type: "system",
		messageCount: 0,
	},
	{
		id: "spam",
		name: "Spam",
		type: "system",
		messageCount: 0,
	},
	{
		id: "trash",
		name: "Trash",
		type: "system",
		messageCount: 0,
	},
]

export const FolderSidebar = () => {
	const { setIsAccountDialogOpen, selectedFolder, setSelectedFolder } =
		useUIStore()
	const { data: fetchedFolders } = useFolders()
	const { setOpen } = useSidebar()
	const { mutate: createFolder } = useCreateDoneFolder()

	const filteredCustomFolders = fetchedFolders?.filter(
		(folder) =>
			!SYSTEM_FOLDERS.some(
				(sys) =>
					sys.id.toLowerCase() === folder.id.toLowerCase() ||
					sys.name.toLowerCase() === folder.name.toLowerCase()
			)
	)

	return (
		<SidebarMenu className="h-full overflow-y-auto">
			<Button
				onClick={() => setIsAccountDialogOpen(true)}
				variant="ghost"
				className="flex h-fit w-full items-center gap-2 border-slate-200 p-4"
			>
				<Avatar>
					<AvatarFallback className="bg-blue-100 text-blue-700">
						R
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-1 items-center justify-between">
					<div className="flex flex-col">
						<span className="text-sm font-medium">
							rdaga@college.harvard.edu
						</span>
					</div>
					<ChevronRight className="h-4 w-4" />
				</div>
			</Button>

			{SYSTEM_FOLDERS.map((folder) => (
				<SidebarMenuItem key={folder.id}>
					<SidebarMenuButton
						tooltip={folder.name}
						onClick={() => {
							setSelectedFolder(folder)
							setOpen(false)
						}}
						isActive={selectedFolder?.id === folder.id}
					>
						<span>{folder.name}</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}

			<Separator className="my-2" />

			{filteredCustomFolders
				?.sort((a, b) => a.name.localeCompare(b.name))
				?.map((folder) => (
					<SidebarMenuItem key={folder.id}>
						<SidebarMenuButton
							tooltip={folder.name}
							onClick={() => {
								setSelectedFolder(folder)
								setOpen(false)
							}}
							isActive={selectedFolder?.id === folder.id}
						>
							<span>{folder.name}</span>
							{folder.messageCount > 0 && (
								<span className="ml-auto text-xs text-muted-foreground">
									{folder.messageCount}
								</span>
							)}
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			<Button
				onClick={() => createFolder()}
				variant="ghost"
				className="m-4 text-sm text-slate-600 hover:bg-slate-100"
			>
				Create Done Folder
			</Button>
		</SidebarMenu>
	)
}
