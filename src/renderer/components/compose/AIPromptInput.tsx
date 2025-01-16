import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { ArrowUpCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
const AIPromptInput = () => {
	const { setShowAIPrompt } = useUIStore()
	const { aiPrompt, setAiPrompt, aiPromptMode, setAiPromptMode } =
		useComposeStore()
	const { watch } = useFormContext<ComposeFormData>()
	const message = watch("message")

	const promptRef = useRef<HTMLDivElement>(null)
	const [showDiscardDialog, setShowDiscardDialog] = useState(false)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				promptRef.current &&
				!promptRef.current.contains(e.target as Node)
			) {
				if (aiPrompt.length > 0) {
					setShowDiscardDialog(true)
				} else {
					setShowAIPrompt(false)
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () =>
			document.removeEventListener("mousedown", handleClickOutside)
	}, [aiPrompt])

	return (
		<>
			<div
				className="mb-1 rounded-lg border border-blue-100 p-2"
				ref={promptRef}
			>
				<p className="text-xs font-medium text-gray-800">
					{aiPromptMode === "draft" ? "Write a draft" : "Edit"}
				</p>
				<div className="relative flex-1 overflow-y-auto">
					<TextareaAutosize
						data-ai-prompt
						placeholder={
							aiPromptMode === "draft"
								? "Outline your email in brief notes"
								: "Describe how to edit the text"
						}
						className="mt-2 w-full resize-none text-sm text-gray-600 outline-none"
						value={aiPrompt}
						onChange={(e) => setAiPrompt(e.target.value)}
						minRows={1}
						maxRows={10}
					/>
					{aiPrompt.length > 0 && (
						<ArrowUpCircle
							className="absolute bottom-0 right-0 mb-1 h-4 w-4 text-blue-500 hover:cursor-pointer"
							onClick={() => {
								setAiPrompt("")
								// todo, send to ai
							}}
						/>
					)}
				</div>
				{message.length > 0 && (
					<div className="flex flex-col">
						<Separator orientation="horizontal" />
						<div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
							<span>Hit</span>
							<kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs font-medium">
								⌘
							</kbd>
							<kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs font-medium">
								J
							</kbd>
							<span>
								{aiPromptMode === "draft"
									? "to switch to Edit"
									: "to switch to Draft"}
							</span>
						</div>
					</div>
				)}
			</div>

			<Dialog
				open={showDiscardDialog}
				onOpenChange={setShowDiscardDialog}
			>
				<DialogContent>
					<h3 className="text-lg font-medium">
						Discard AI response?
					</h3>
					<p className="text-sm text-gray-500">
						The AI response will not be saved.
					</p>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setShowDiscardDialog(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								setShowDiscardDialog(false)
								setShowAIPrompt(false)
								setAiPrompt("")
							}}
						>
							Discard
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export { AIPromptInput }
