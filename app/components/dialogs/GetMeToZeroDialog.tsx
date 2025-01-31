import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { Separator } from "@/components/ui/Separator"
import { useUIStore } from "@/hooks/useUIStore"
import { useState } from "react"

export const GetMeToZeroDialog = () => {
	const { isGetMeToZeroOpen, setIsGetMeToZeroOpen } = useUIStore()
	const [showMoreOptions, setShowMoreOptions] = useState(false)
	const [keepUnread, setKeepUnread] = useState(false)
	const [keepStarred, setKeepStarred] = useState(false)

	return (
		<Dialog open={isGetMeToZeroOpen} onOpenChange={setIsGetMeToZeroOpen}>
			<DialogTitle hidden>Get Me to Zero</DialogTitle>
			<DialogContent className="w-[700px]">
				<div className="flex flex-col gap-4 p-2">
					<h2 className="text-lg font-semibold">Get Me To Zero</h2>
					<div className="flex flex-col gap-2">
						<p className="text-xs text-slate-700">
							Let's get you to Inbox Zero! ✨
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xs text-slate-700">
							We'll move old email from your Inbox to the Done
							folder.
						</p>
						<p className="text-xs text-slate-700">
							You can always find them again with search.
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xs text-slate-700">
							What counts as old? most people move email older
							than 1 week.
						</p>
						<p className="text-xs text-slate-700">
							Be bold, and say goodbye to the old!
						</p>
					</div>
					<Separator orientation="horizontal" />
					<div className="flex h-2 flex-row items-center">
						<p className="text-xs text-slate-700">
							Clean up email older than:{" "}
						</p>
						<Select>
							<SelectTrigger className="h-1/2 w-fit border-none text-xs text-slate-700">
								<SelectValue placeholder="1 week (most popular)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1 day">1 day</SelectItem>
								<SelectItem value="3 days">3 days</SelectItem>
								<SelectItem value="1 week">
									1 week (most popular)
								</SelectItem>
								<SelectItem value="2 weeks">2 weeks</SelectItem>
								<SelectItem value="1 month">1 month</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{!showMoreOptions ? (
						<p
							className="cursor-pointer text-xs text-slate-500 transition-colors hover:text-slate-700"
							onClick={() => setShowMoreOptions(true)}
						>
							More options...
						</p>
					) : (
						<div className="flex flex-col gap-2">
							<div className="flex w-fit flex-row items-center gap-2">
								<Checkbox
									checked={keepUnread}
									onCheckedChange={() =>
										setKeepUnread(!keepUnread)
									}
								/>
								<p className="text-xs text-slate-700">
									Keep unread email
								</p>
							</div>
							<div className="flex w-fit flex-row items-center gap-2">
								<Checkbox
									checked={keepStarred}
									onCheckedChange={() =>
										setKeepStarred(!keepStarred)
									}
								/>
								<p className="text-xs text-slate-700">
									Keep starred email
								</p>
							</div>
						</div>
					)}
				</div>
				<div className="flex w-full flex-row justify-end gap-2">
					<Button
						onClick={() => setIsGetMeToZeroOpen(false)}
						variant={"ghost"}
						size={"sm"}
					>
						Cancel
					</Button>
					<Button
						onClick={() => setIsGetMeToZeroOpen(false)}
						variant={"default"}
						size={"sm"}
					>
						Let's Go! ✨
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
