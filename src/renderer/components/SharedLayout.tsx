// React/Next
import { Outlet } from "react-router-dom"
// Components
import {
	Sidebar,
	SidebarContent,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/Sidebar"
import { FolderSidebar } from "./FolderSidebar"
// Hooks
// Libraries
// Icons
// Types

const SharedLayoutContent = () => {
	const { open } = useSidebar()

	return (
		<div className="flex h-screen w-screen flex-row">
			<div className="absolute left-4 top-4 z-50">
				<SidebarTrigger />
			</div>
			<Sidebar>
				<SidebarContent>
					<FolderSidebar />
				</SidebarContent>
			</Sidebar>
			<div className="flex flex-1 flex-col overflow-hidden transition-transform duration-300 ease-in-out data-[state=open]:translate-x-[16rem]" data-state={open ? "open" : "closed"}>
				<div className="flex w-full flex-row gap-2 p-4">
					{/* Menu bar content */}
				</div>
				<Outlet />
			</div>
		</div>
	)
}

const SharedLayout = () => {
	return (
		<SidebarProvider defaultOpen={false}>
			<SharedLayoutContent />
		</SidebarProvider>
	)
}

export { SharedLayout }
