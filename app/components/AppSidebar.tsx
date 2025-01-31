"use client"

import { Sidebar } from "@/components/ui/Sidebar"

import { FolderSidebar } from "@/components/FolderSidebar"
import { SidebarContent, useSidebar } from "@/components/ui/Sidebar"

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

export { AppSidebar }
