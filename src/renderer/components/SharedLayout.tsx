// React/Next
import { Outlet } from "react-router-dom"
// Components
import { AccountPickerDialog } from "@/components/AccountPickerDialog"
import { FolderSidebar } from "@/components/FolderSidebar"
import {
	Sidebar,
	SidebarContent,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/Sidebar"
// Hooks
// Libraries
// Icons
// Types

const SharedLayoutContent = () => {
	const { setOpen } = useSidebar()

	return (
		<div className="flex h-screen w-screen flex-row">
			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="flex w-full flex-row gap-2">
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
				</div>
				<AccountPickerDialog />
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
