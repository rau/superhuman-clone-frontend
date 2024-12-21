import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/Sidebar"
import { AlertOctagon, FileEdit, Inbox, Send, Trash } from "lucide-react"

const folders = [
	{ id: 1, name: "Inbox", icon: Inbox, count: 12 },
	{ id: 2, name: "Sent", icon: Send, count: 5 },
	{ id: 3, name: "Drafts", icon: FileEdit, count: 2 },
	{ id: 4, name: "Spam", icon: AlertOctagon, count: 8 },
	{ id: 5, name: "Trash", icon: Trash, count: 0 },
]

export const FolderSidebar = () => {
	return (
		<SidebarMenu>
			{folders.map((folder) => (
				<SidebarMenuItem key={folder.id}>
					<SidebarMenuButton tooltip={folder.name}>
						<folder.icon />
						<span>{folder.name}</span>
						{folder.count > 0 && (
							<span className="ml-auto text-xs text-muted-foreground">
								{folder.count}
							</span>
						)}
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	)
}
