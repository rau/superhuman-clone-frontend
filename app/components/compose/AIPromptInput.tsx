import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/Dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Separator } from "@/components/ui/Separator"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useAIPromptStore } from "@/hooks/usePromptStore"
import { useUIStore } from "@/hooks/useUIStore"
import {
	queryGptDraft,
	queryGptDraftMakeLonger,
	queryGptDraftMakeShorter,
	queryGptDraftSimplify,
	queryGptEdit,
	queryGptFixSpellingAndGrammar,
	queryGptImproveWriting,
	queryGptUpdate,
} from "@/libs/gpt/gptUtils"
import { cn } from "@/libs/utils"
import { ArrowUp } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"

const AIPromptInput = () => {
	const { setShowAIPrompt } = useUIStore()
	const { setShowDiscardDialog, selectedText } = useComposeStore()
	const {
		aiPrompt,
		setAiPrompt,
		aiPromptMode,
		showAIPromptContextMenu,
		setShowAIPromptContextMenu,
		aiPromptEdit,
		setAiPromptEdit,
		isAiPromptLoading,
		setIsAiPromptLoading,
	} = useAIPromptStore()
	const { watch, getValues } = useFormContext<ComposeFormData>()
	const message = watch("message")

	const promptRef = useRef<HTMLDivElement>(null)

	const handleGptAction = async (
		action: (text: string) => Promise<string | null>
	) => {
		setIsAiPromptLoading(true)
		setShowAIPromptContextMenu(false)
		const result = await action(aiPrompt)
		if (result) {
			setAiPrompt(result)
		}
		setShowAIPromptContextMenu(true)
		setIsAiPromptLoading(false)
	}

	const handleSubmit = () => handleGptAction(queryGptDraft)

	const handleEdit = async () => {
		setIsAiPromptLoading(true)
		setShowAIPromptContextMenu(false)
		const result = await queryGptEdit(
			aiPrompt,
			getValues("message").slice(selectedText.start, selectedText.end)
		)
		if (result) {
			setAiPrompt(result)
		}
		setShowAIPromptContextMenu(true)
		setIsAiPromptLoading(false)
	}

	const handleUpdate = async () => {
		setIsAiPromptLoading(true)
		setShowAIPromptContextMenu(false)
		const result = await queryGptUpdate(aiPromptEdit, aiPrompt)
		if (result) {
			setAiPrompt(result)
			setAiPromptEdit("")
		}
		setShowAIPromptContextMenu(true)
		setIsAiPromptLoading(false)
	}

	useEffect(() => {
		if (showAIPromptContextMenu) {
			setTimeout(() => {
				const editField = document.querySelector(
					"[data-ai-prompt-edit]"
				) as HTMLTextAreaElement
				editField?.focus()
			}, 100)
		}
	}, [showAIPromptContextMenu])

	// useEffect(() => {
	// 	const handleClickOutside = (e: MouseEvent) => {
	// 		if (
	// 			promptRef.current &&
	// 			!promptRef.current.contains(e.target as Node)
	// 		) {
	// 			if (aiPrompt.length > 0) {
	// 				setShowDiscardDialog(true)
	// 			} else {
	// 				setShowAIPrompt(false)
	// 			}
	// 		}
	// 	}

	// 	document.addEventListener("mousedown", handleClickOutside)
	// 	return () =>
	// 		document.removeEventListener("mousedown", handleClickOutside)
	// }, [aiPrompt])

	return (
		<div className="relative">
			<div
				className="mb-1 h-fit rounded-lg border-[2px] border-blue-100 p-2"
				ref={promptRef}
			>
				{isAiPromptLoading && (
					<p className="text-xs font-medium text-gray-800">
						Writing...
					</p>
				)}
				{showAIPromptContextMenu && (
					<div className="relative flex-1">
						<TextareaAutosize
							data-ai-prompt
							className="mt-2 w-full resize-none bg-transparent text-xs text-gray-800 outline-none"
							value={aiPrompt}
							onChange={(e) => setAiPrompt(e.target.value)}
							minRows={1}
							// maxRows={10}
							disabled
						/>
						<Separator orientation="horizontal" />
						<TextareaAutosize
							data-ai-prompt-edit
							placeholder={
								aiPromptMode === "draft"
									? "Describe how to edit the generated draft"
									: "Describe how to edit the selected text"
							}
							className="mt-2 w-full resize-none bg-transparent text-xs text-gray-800 placeholder-gray-500 outline-none"
							value={aiPromptEdit}
							onChange={(e) => setAiPromptEdit(e.target.value)}
							minRows={1}
							maxRows={10}
							autoFocus
						/>
						{aiPromptEdit.length > 0 && (
							<div
								className="absolute bottom-0 right-0 h-fit w-fit rounded-full bg-[#AFB1DC] p-[1px] text-white transition-colors hover:cursor-pointer hover:bg-[#9da0dc]"
								onClick={handleUpdate}
							>
								<ArrowUp className="h-3 w-3 text-white hover:cursor-pointer" />
							</div>
						)}
					</div>
				)}
				{!isAiPromptLoading && !showAIPromptContextMenu && (
					<>
						<p
							className="text-xs font-medium text-gray-800"
							onClick={() =>
								setShowAIPromptContextMenu(
									!showAIPromptContextMenu
								)
							}
						>
							{aiPromptMode === "draft"
								? "Write a draft"
								: "Edit"}
						</p>
						<div className="relative flex-1 overflow-y-auto">
							<TextareaAutosize
								data-ai-prompt
								placeholder={
									aiPromptMode === "draft"
										? "Outline your email in brief notes"
										: "Describe how to edit the selected text"
								}
								className="mt-2 w-full resize-none text-xs text-gray-800 outline-none"
								value={aiPrompt}
								onChange={(e) => setAiPrompt(e.target.value)}
								minRows={1}
								maxRows={10}
								onKeyDown={async (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault()
										if (aiPromptMode === "draft") {
											await handleSubmit()
										} else {
											await handleEdit()
										}
									}
								}}
							/>
							{aiPrompt.length > 0 && (
								<div
									className="absolute bottom-0 right-0 h-fit w-fit rounded-full bg-[#AFB1DC] p-[1px] text-white transition-colors hover:cursor-pointer hover:bg-[#9da0dc]"
									onClick={() => handleSubmit()}
								>
									<ArrowUp className="h-3 w-3 text-white hover:cursor-pointer" />
								</div>
							)}
						</div>
						<div
							className={cn(
								"flex flex-col",
								message.length > 0 ? "block" : "hidden"
							)}
						>
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
					</>
				)}
			</div>

			<DiscardDialog />
			<EditDropdownMenu />
		</div>
	)
}

const EditDropdownMenu = () => {
	const {
		aiPrompt,
		setAiPrompt,
		originalAiPrompt,
		setOriginalAiPrompt,
		aiPromptMode,
		showAIPromptContextMenu,
		setShowAIPromptContextMenu,
		isAiPromptLoading,
		setIsAiPromptLoading,
	} = useAIPromptStore()
	const { setShowAIPrompt } = useUIStore()
	const { setValue } = useFormContext<ComposeFormData>()
	const firstItemRef = useRef<HTMLDivElement>(null)

	const handleGptAction = async (
		action: (text: string) => Promise<string | null>
	) => {
		setIsAiPromptLoading(true)
		setShowAIPromptContextMenu(false)
		const result = await action(aiPrompt)
		if (result) {
			setAiPrompt(result)
		}
		setShowAIPromptContextMenu(true)
		setIsAiPromptLoading(false)
	}

	const handleRetry = () =>
		handleGptAction(() => queryGptDraft(originalAiPrompt))
	const handleImproveWriting = () => handleGptAction(queryGptImproveWriting)
	const handleShorten = () => handleGptAction(queryGptDraftMakeShorter)
	const handleLengthen = () => handleGptAction(queryGptDraftMakeLonger)
	const handleSimplify = () => handleGptAction(queryGptDraftSimplify)
	const handleFixSpellingAndGrammar = () =>
		handleGptAction(queryGptFixSpellingAndGrammar)

	// useEffect(() => {
	// 	if (showAIPromptContextMenu) {
	// 		setTimeout(() => {
	// 			firstItemRef.current?.focus()
	// 		}, 0)
	// 	}
	// }, [showAIPromptContextMenu])

	return (
		<DropdownMenu open={showAIPromptContextMenu} modal={false}>
			<DropdownMenuTrigger asChild>
				<div className="absolute bottom-0 left-0 h-0 w-0 opacity-0" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" sideOffset={15}>
				<DropdownMenuItem
					onClick={() => {
						setValue("message", aiPrompt)
						setAiPrompt("")
						setShowAIPromptContextMenu(false)
						setShowAIPrompt(false)
						// focus on the message input
						const messageField = document.querySelector(
							"[data-message-field]"
						) as HTMLTextAreaElement
						console.log("messageField", messageField)
						if (messageField) {
							setTimeout(() => {
								messageField.focus()
							}, 50)
						}
					}}
					ref={firstItemRef}
				>
					Accept
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleRetry()}>
					Retry
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => handleImproveWriting()}>
					Improve writing
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleShorten()}>
					Shorten
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleLengthen()}>
					Lengthen
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleSimplify()}>
					Simplify
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleFixSpellingAndGrammar()}>
					Fix spelling and grammar
				</DropdownMenuItem>
				<DropdownMenuItem>Rewrite in my voice</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const DiscardDialog = () => {
	const { showDiscardDialog, setShowDiscardDialog } = useComposeStore()
	const { setAiPrompt } = useAIPromptStore()
	const { setShowAIPrompt } = useUIStore()

	return (
		<Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
			<DialogContent>
				<h3 className="text-lg font-medium">Discard AI response?</h3>
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
	)
}
export { AIPromptInput }
