import { AppSidebar } from "@/components/AppSidebar"
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider } from "@/components/ui/Sidebar"
import { TooltipProvider } from "@/components/ui/Tooltip"
import "@/globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ToastContainer } from "react-toastify"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Superhuman",
	description: "Superhuman",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReactQueryClientProvider>
					<ThemeProvider>
						<TooltipProvider>
							<SidebarProvider defaultOpen={false}>
								<ToastContainer />
								<div className="flex h-screen w-screen flex-row">
									<div className="flex flex-1 flex-col overflow-hidden">
										<div className="flex flex-1 flex-col overflow-hidden">
											{children}
											<AppSidebar />
										</div>
									</div>
								</div>
							</SidebarProvider>
						</TooltipProvider>
					</ThemeProvider>
				</ReactQueryClientProvider>
			</body>
		</html>
	)
}
