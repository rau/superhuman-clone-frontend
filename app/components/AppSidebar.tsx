"use client"

import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/Sidebar"
import { useAccounts, useCreateDoneFolder, useFolders } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useUIStore } from "@/hooks/useUIStore"
import { ChevronRight } from "lucide-react"

const SYSTEM_FOLDERS = [
	{
		id: "INBOX",
		name: "INBOX",
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

const AppSidebar = () => {
	const { setOpen } = useSidebar()
	return (
		<div
			className="absolute z-10"
			onMouseLeave={() => {
				setOpen(false)
			}}
		>
			<Sidebar>
				<SidebarContent>
					<FolderSidebar />
				</SidebarContent>
			</Sidebar>
		</div>
	)
}

const FolderSidebar = () => {
	const { setIsAccountDialogOpen, selectedFolder, setSelectedFolder } =
		useUIStore()
	const { data: fetchedFolders } = useFolders()
	const { setOpen } = useSidebar()
	const { mutate: createFolder } = useCreateDoneFolder()
	const { selectedAccountId } = useAccountStore()
	const { data: accounts } = useAccounts()
	const selectedAccount = accounts?.find(
		(acc) => acc.id === selectedAccountId
	)

	const filteredCustomFolders = fetchedFolders?.filter(
		(folder) =>
			!SYSTEM_FOLDERS.some(
				(sys) =>
					sys.id.toLowerCase() === folder.id.toLowerCase() ||
					sys.name.toLowerCase() === folder.name.toLowerCase()
			)
	)

	return (
		<SidebarMenu className="z-50 h-full overflow-y-auto">
			<Button
				onClick={() => setIsAccountDialogOpen(true)}
				variant="ghost"
				className="flex h-fit w-full items-center gap-2 border-slate-200 p-4"
			>
				<Avatar>
					<AvatarFallback className="bg-blue-100 text-blue-700">
						{selectedAccount?.name?.[0] || "?"}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-1 items-center justify-between">
					<div className="flex flex-col">
						<span className="text-sm font-medium">
							{selectedAccount?.email || "Select Account"}
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

export { AppSidebar }
